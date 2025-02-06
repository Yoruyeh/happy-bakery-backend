const sequelize = require('sequelize');
const { Category, Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

const productService = {
  getProducts: async (category, page, limit, sort, keyword) => {
    // define display products per page
    const perPage = Number(limit) || 12;
    // define sorting options
    const sortOptions = {
      price_desc: ['price_regular', 'DESC'],
      price_asc: ['price_regular', 'ASC'],
      date_desc: ['created_at', 'DESC'],
      date_asc: ['created_at', 'ASC'],
    };
    // get product count
    const productCount = await productService.getProductCount(
      category,
      keyword
    );

    const queryOptions = {
      where: {},
      order: [],
      limit: perPage,
      offset: (Number(page) - 1) * perPage,
      attributes: [
        'id',
        'name',
        'category_id',
        'cover',
        'stock_quantity',
        'price_regular',
        'price_sale',
        [sequelize.literal('DATE(Product.created_at)'), 'create_date'],
      ],
      include: {
        model: Category,
        attributes: ['id', 'name'],
      },
      raw: true,
      nest: true,
    };
    if (category) {
      queryOptions.where.category_id = category;
    }
    if (sort && sortOptions[sort]) {
      queryOptions.order.push(sortOptions[sort]);
    }
    if (keyword) {
      queryOptions.where[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const products = await Product.findAll(queryOptions);
    const paginationInfo = {
      productCount,
      currentPage: Number(page),
      limit: perPage,
      totalPage: Math.ceil(productCount / perPage),
    };

    return {
      status: 'success',
      message: products.length
        ? 'products retrieved succeed'
        : 'no products found',
      products: products.length ? products : [],
      pagination: paginationInfo,
    };
  },

  getProductCount: async (categoryId, keyword) => {
    const whereOptions = categoryId ? { category_id: categoryId } : {};
    if (keyword) {
      whereOptions.name = {
        [Op.like]: `%${keyword}%`,
      };
    }
    let totalCount;
    totalCount = await Product.count({ where: whereOptions });

    return totalCount;
  },

  getProduct: async (id) => {
    const product = await Product.findByPk(id, {
      attributes: [
        'id',
        'name',
        'cover',
        'price_regular',
        'price_sale',
        'description',
        'stock_quantity',
      ],
      include: {
        model: ProductImage,
        attributes: ['name', 'image_path'],
        where: {
          is_display: 1,
        },
        required: false,
      },
    });
    if (product !== null) {
      return {
        status: 'success',
        message: 'product retrieved succeed',
        product,
      };
    } else {
      return {
        status: 'success',
        message: 'no product found',
      };
    }
  },

  searchProducts: async (keyword, page, limit) => {
    const perPage = Number(limit) || 12;

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      limit: perPage,
      offset: (Number(page) - 1) * perPage,
      attributes: ['id', 'category_id', 'name', 'cover'],
      include: {
        model: Category,
        attributes: ['id', 'name'],
      },
    });

    // get product count
    const productCount = await productService.getProductCount('', keyword);

    const paginationInfo = {
      productCount,
      currentPage: Number(page),
      limit: perPage,
      totalPage: Math.ceil(productCount / perPage),
    };

    return {
      status: 'success',
      message: products.length
        ? 'products retrieved succeed'
        : 'no products found',
      products: products.length ? products : [],
      pagination: paginationInfo,
    };
  },

  getPopularProducts: async (top, startDate, endDate, sort) => {
    let queryOptions = {
      limit: top,
      attributes: ['id', 'category_id', 'name', 'cover', 'price_regular'],
      include: {
        model: Category,
        attributes: ['name'],
      },
      raw: true,
      nest: true,
    };

    if (startDate !== undefined && endDate !== undefined) {
      queryOptions.where = {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    if (sort === 'salesAmount') {
      queryOptions.attributes.push([
        sequelize.cast(
          sequelize.literal(
            '(SELECT SUM(quantity * price_each) FROM `OrderItems` WHERE `OrderItems`.`product_id` = `Product`.`id`)'
          ),
          'DECIMAL(10, 2)'
        ),
        'salesAmount',
      ]);
      queryOptions.order = [[sequelize.literal('salesAmount'), 'DESC']];
    } else {
      queryOptions.attributes.push([
        sequelize.cast(
          sequelize.literal(
            '(SELECT SUM(quantity) FROM `OrderItems` WHERE `OrderItems`.`product_id` = `Product`.`id`)'
          ),
          'SIGNED'
        ),
        'salesCount',
      ]);
      queryOptions.order = [[sequelize.literal('salesCount'), 'DESC']];
    }

    const products = await Product.findAll(queryOptions);

    if (products.length) {
      return {
        status: 'success',
        message: 'top products retrieved successfully',
        products,
      };
    } else {
      return {
        status: 'success',
        message: 'no products found',
      };
    }
  },
};

module.exports = productService;
