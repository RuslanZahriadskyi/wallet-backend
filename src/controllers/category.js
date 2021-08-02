const { HttpCode } = require("../helpers/constants");
const { CategoryService } = require("../services");
const categoriesService = new CategoryService();

const getAllCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const categories = await categoriesService.getAllCategory(userId);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      response: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category } = req.body;

    const newUserCategory =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    const categoryExist = await categoriesService.findCategory(
      userId,
      newUserCategory
    );

    if (categoryExist.length > 0) {
      return next({
        status: HttpCode.CONFLICT,
        message: "This category already exist",
      });
    }

    let colorForNewCategory =
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    const colorExist = await categoriesService.findColor(
      userId,
      colorForNewCategory
    );

    if (colorExist.length > 0 || colorForNewCategory.length < 7) {
      while (colorForNewCategory.length < 7) {
        colorForNewCategory =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
      }
    }

    const createNewCategory = {
      value: newUserCategory,
      color: colorForNewCategory,
      owner: userId,
    };

    const newCategory = await categoriesService.createCategory(
      userId,
      createNewCategory
    );

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      response: {
        newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category } = req.body;

    const response = await categoriesService.deleteCategory(
      userId,
      req.params.categoryId,
      category
    );

    if (response.findCategory && response.isDeleted) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: response,
      });
    }

    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      data: response.operationsWithCategory,
    });
  } catch (error) {
    next(error);
  }
};

const changeCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { newCategoryName, oldCategoryName } = req.body;

    const changedCategory = await categoriesService.changeCategory(
      userId,
      req.params.categoryId,
      newCategoryName,
      oldCategoryName
    );

    if (changedCategory) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: changedCategory,
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Category doesn`t exist",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  deleteCategory,
  changeCategory,
};
