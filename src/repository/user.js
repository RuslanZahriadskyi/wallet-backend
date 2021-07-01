const User = require("../schema/user");

class UserRepository {
  constructor() {
    this.User = User;
  }

  async createUser(body) {
    const user = new this.User(body);
    return user.save();
  }

  async getUserByEmail(email) {
    const user = await this.User.findOne({ email });
    return user;
  }

  async getUserById(id) {
    const user = await this.User.findOne({ _id: id });
    return user;
  }

  async updateToken(id, token) {
    await this.User.updateOne({ _id: id }, { token });
  }

  async getCurrentUser(id) {
    const { name, email, subscription } = await this.User.findOne({ _id: id });
    return { name, email, subscription };
  }

  async updateSubscriptionStatus(id, body) {
    const user = await this.User.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true }
    );
    return user;
  }

  async updateAvatars(id, avatar, avatarId) {
    await this.User.updateOne({ _id: id }, { avatar, avatarId });
  }

  async getAvatar(id) {
    const { avatar, avatarId } = await this.User.findOne({ _id: id });
    return { avatar, avatarId };
  }

  async findByField(field) {
    const result = await this.User.findOne(field);
    return result;
  }
}

module.exports = UserRepository;
