const sequelize = require('sequelize')
const { Product } = require('../models')

const productService = {
  getProducts: async (category, page, sort) => {
    // define display products per page
    const perPage = 9
    // define sorting options
    const sortOptions = {
      price_desc: ['price_regular', 'DESC'],
      price_asc: ['price_regular', 'ASC'],
      date_desc: ['createdAt', 'DESC'],
      date_asc: ['createdAt', 'ASC']
    }

    const queryOptions = {
      where: {},
      order: [],
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: [
        'id',
        'name',
        'category_id',
        'cover',
        'price_regular',
        'price_sale',
        [sequelize.literal('DATE(created_at)'), 'create_date'],
      ],
      raw: true,
      nest: true
    }
    if (category) {
      queryOptions.where.category_id = category
    }
    if (sort && sortOptions[sort]) {
      queryOptions.order.push(sortOptions[sort])
    }

    const products = await Product.findAll(queryOptions)
    if (products.length) {
      return {
        status: 'success',
        message: 'products retrieved succeed',
        products
      }
    } else {
      return {
        status: 'success',
        message: 'no products found'
      }
    }
  }
}

module.exports = productService