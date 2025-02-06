const { Category } = require('../models');

const categoryService = {
  getAllCategories: async () => {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
    });
    return {
      status: 'success',
      message: 'categories retrieved succeed',
      categories,
    };
  },
};

module.exports = categoryService;
