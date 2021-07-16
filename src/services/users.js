const { UserRepository } = require("../repository");
const EmailService = require("./email");
const ErrorHandler = require("../helpers/errorHandler");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
require("dotenv").config();

class UsersService {
  constructor() {
    this.cloudinary = cloudinary;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.repository = {
      users: new UserRepository(),
    };
    this.emailService = new EmailService();
  }

  async create(body) {
    const verifyToken = uuidv4();
    const { email, name } = body;

    try {
      await this.emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      throw new ErrorHandler(503, error.message, "Service email unavailable");
    }

    const data = await this.repository.users.createUser({
      ...body,
      verifyToken,
    });

    return data;
  }

  async getUserByEmail(email) {
    const data = await this.repository.users.getUserByEmail(email);
    return data;
  }

  async getUserById(id) {
    const data = await this.repository.users.getUserById(id);
    return data;
  }

  async getCurrentUser(id) {
    const data = await this.repository.users.getCurrentUser(id);
    return data;
  }

  async updateSubscriptionStatus(id, body) {
    const data = await this.repository.users.updateSubscriptionStatus(id, body);
    return data;
  }

  async updateAvatars(id, filePath) {
    try {
      const { secure_url: avatar, public_id: avatarId } =
        await this.#uploadCloudinaryImage(filePath);
      console.log(avatar);
      console.log(avatarId);

      const oldAvatar = await this.repository.users.getAvatar(id);
      if (oldAvatar) {
        this.cloudinary.uploader.destroy(oldAvatar.avatarId, (err, result) => {
          console.log(err, result);
        });
      }
      await this.repository.users.updateAvatars(id, avatar, avatarId);
      await fs.unlink(filePath);
      return avatar;
    } catch (error) {
      throw new ErrorHandler(null, "Error upload avatar");
    }
  }

  async verify({ token }) {
    const user = await this.repository.users.findByField({
      verifyToken: token,
    });
    if (user) {
      await user.updateOne({ verify: true, verifyToken: null });
      return true;
    }
    return false;
  }

  async verifyRepeatedly(verifyToken, email, name) {
    try {
      await this.emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      throw new ErrorHandler(503, error.message, "Service email unavailable");
    }
  }

  #uploadCloudinaryImage = (filePath) => {
    return new Promise((res, rej) => {
      this.cloudinary.uploader.upload(
        filePath,
        { folder: "avatars", transformation: { width: 250, crop: "pad" } },
        (error, result) => {
          if (error) {
            return rej(err);
          }
          if (result) {
            return res(result);
          }
        }
      );
    });
  };
}

module.exports = UsersService;
