const categoryService = require('../services/categoryService');
const { CError } = require('../middleware/error-handler');

const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.json({ categories });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
