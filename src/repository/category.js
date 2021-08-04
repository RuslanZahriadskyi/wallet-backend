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
    const operationsWithCategory = await this.operation.find(
      {
        owner: userId,
        category,
      },
      {
        comments: 1,
        date: 1,
        type: 1,
        category: 1,
        amount: 1,
        balanceAfter: 1,
        color: 1,
        id: 1,
      }
    );

    if (operationsWithCategory.length > 0) {
      return { isDeleted: false, operationsWithCategory };
    }

    const deletedCategory = await this.category.findOneAndDelete({
      _id: categoryId,
    });

    if (deletedCategory) {
      await this.categories.findOneAndUpdate(
        { owner: userId },
        {
          $pull: { category: categoryId },
        },
        { new: true }
      );

      return { isDeleted: true, deletedCategory };
    }
  }

  async changeCategory(userId, categoryId, newCategoryName, oldCategoryName) {
    const findCategoryForUpdate = await this.category.findOneAndUpdate(
      { owner: userId, _id: categoryId, value: oldCategoryName },
      {
        $set: { value: newCategoryName },
      },
      { fields: { value: 1, color: 1, id: 1 }, new: true }
    );

    if (findCategoryForUpdate) {
      await this.operation.updateMany(
        { owner: userId, category: oldCategoryName },
        {
          $set: { category: newCategoryName },
        },
        { multi: true, new: true }
      );

      const result = await this.finance.findOne({ owner: userId }).populate({
        path: "userOperations",
        select: "amount category comments type date balanceAfter _id",
        options: { sort: { date: -1 } },
      });

      return {
        newOperations: [...result.userOperations],
        newCategory: findCategoryForUpdate,
      };
    }

    return;
  }
}

module.exports = CategoryRepository;
