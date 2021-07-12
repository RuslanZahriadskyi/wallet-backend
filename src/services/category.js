const { CategoryRepository } = require("../repository");

class CategoryService {
  constructor() {
    this.repository = {
      category: new CategoryRepository(),
    };
  }

  async getAllCategory(userId) {
    const data = await this.repository.category.getAllCategory(userId);
    return data;
  }

  async createCategory(userId, newCategory) {
    const data = await this.repository.category.createCategory(
      userId,
      newCategory
    );
    return data;
  }

  async findCategory(userId, category) {
    const data = await this.repository.category.findCategory(userId, category);
    return data;
  }

  async findColor(userId, color) {
    const data = await this.repository.category.findColor(userId, color);
    return data;
  }
}

module.exports = CategoryService;
