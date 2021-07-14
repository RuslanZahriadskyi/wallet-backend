const { UserRepository } = require("../repository");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY_JWT;

class AuthService {
  constructor() {
    this.repository = {
      users: new UserRepository(),
    };
  }

  async login({ email, password }) {
    const user = await this.repository.users.getUserByEmail(email);

    if (!user || !user.validPassword(password) || !user.verify) {
      return null;
    }

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
    await this.repository.users.updateToken(id, token);

    const { name, avatar, avatarId } = user;

    return { name, token, avatar, avatarId, email };
  }

  async logout(id) {
    const data = await this.repository.users.updateToken(id, null);
    return data;
  }
}

module.exports = AuthService;
