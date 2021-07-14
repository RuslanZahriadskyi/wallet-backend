const User = require("../schema/user");
const UserFinance = require("../schema/userOperation");
const UserCategories = require("../schema/userCategory");
const CategoriesShema = require("../schema/categories");
const { OutlayCategory } = require("../helpers/constants");

class UserRepository {
  constructor() {
    this.User = User;
  }

  async createUser(body) {
    const user = new this.User(body);
    const userFinance = new UserFinance({
      owner: user._id,
      totalBalance: 0,
      typeTotalBalance: "+",
    });
    const userCategories = new UserCategories({
      owner: user._id,
      category: OutlayCategory.map((category) => {
        const categoryUser = new CategoriesShema({
          value: category.value,
          color: category.color,
          owner: user._id,
        });

        categoryUser.save();

        return categoryUser;
      }),
    });

    userCategories.save();
    userFinance.save();
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
    const { name, email, subscription, avatar, avatarId } =
      await this.User.findOne({ _id: id });
    return { name, email, subscription, avatar, avatarId };
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
