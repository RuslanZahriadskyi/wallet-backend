const UserCategories = require("../schema/userCategory");
const CategoriesShema = require("../schema/categories");
const mongoose = require("mongoose");

class CategoryRepository {
  constructor() {
    this.categories = UserCategories;
    this.category = CategoriesShema;
  }

  async getAllCategory(userId) {
    const { category } = await this.categories
      .findOne({ owner: userId })
      .populate({
        path: "category",
        select: "value color",
      });
    return category;
  }

  async createCategory(userId, newCategory) {
    const category = await this.category.create(newCategory);

    await this.categories.findOneAndUpdate(
      { owner: userId },
      {
        $push: { category },
      },
      { new: true }
    );

    const { _id, value, color } = category;

    return { id: _id, value, color };
  }

  async findCategory(userId, category) {
    const data = await this.category.aggregate([
      {
        $match: {
          $and: [
            { owner: mongoose.Types.ObjectId(userId) },
            { value: category },
          ],
        },
      },
    ]);

    return data;
  }

  async findColor(userId, color) {
    const data = await this.category.aggregate([
      {
        $match: {
          $and: [{ owner: mongoose.Types.ObjectId(userId) }, { color }],
        },
      },
    ]);

    return data;
  }
}

module.exports = CategoryRepository;
