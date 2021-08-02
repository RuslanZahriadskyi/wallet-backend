const UserCategories = require("../schema/userCategory");
const UserFinance = require("../schema/userOperation");
const CategoriesShema = require("../schema/categories");
const OperationsSchema = require("../schema/operations");

const mongoose = require("mongoose");

class CategoryRepository {
  constructor() {
    this.categories = UserCategories;
    this.category = CategoriesShema;
    this.finance = UserFinance;
    this.operation = OperationsSchema;
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

  async deleteCategory(userId, categoryId, category) {
    const getCategoryForDelete = await this.operation.find({
      owner: userId,
      category,
    });

    if (getCategoryForDelete.length > 0) {
      return { isDeleted: false, getCategoryForDelete };
    }

    const findCategory = await this.category.findOneAndDelete({
      _id: categoryId,
    });

    if (findCategory) {
      const deleteFromCategories = await this.categories.findOneAndUpdate(
        { owner: userId },
        {
          $pull: { category: categoryId },
        },
        { new: true }
      );
    }

    return { isDeleted: true, findCategory };
  }
}

module.exports = CategoryRepository;
