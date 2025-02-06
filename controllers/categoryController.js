const categoryService = require('../services/categoryService');
const { CError } = require('../middleware/error-handler');

const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const { status, message, categories } =
        await categoryService.getAllCategories();
      res.json({ status, message, categories });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
