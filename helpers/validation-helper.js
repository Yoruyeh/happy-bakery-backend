const { CError } = require('../middleware/error-handler')

// check id is non-zero number
const isValidateId = (id) => {
  const idPattern = /^[1-9]\d*$/
  if (idPattern.test(id)) {
    return true
  }
}

const isValidPositiveInteger = (value) => {
  return Number.isInteger(value) && value > 0
}

// check order item id, quantity, price
const isValidItem = (item) => {
  return (
    item.id !== undefined &&
    item.quantity !== undefined &&
    item.price !== undefined &&
    isValidPositiveInteger(item.id) &&
    isValidPositiveInteger(item.quantity) &&
    isValidPositiveInteger(item.price)
  )
}

// check admin post product
const validProduct = (product) => {
  const { name, description, category, cover, sku, quantity, priceRegular, priceSale } = product
  let err = ''

  if (name === undefined || typeof name !== 'string' || name.length > 100) err += 'invalid product name. '
  if (description === undefined || typeof description !== 'string' || description.length > 500) err += 'invalid product description. '
  if (cover === undefined || typeof cover !== 'string') err += 'invalid product cover. '
  if (category === undefined || typeof category !== 'string') err += 'invalid product category. '

  if (err) {
    throw new CError(err, 400)
  }

  return (
    isValidPositiveInteger(sku) &&
    isValidPositiveInteger(quantity) &&
    isValidPositiveInteger(priceRegular) &&
    isValidPositiveInteger(priceSale)
  )
}

// check admin post product image
const validateImages = (images) => {
  if (!Array.isArray(images) || images.length !== 3) {
    throw new Error("Invalid images array length")
  }

  for (const image of images) {
    if (
      !image ||
      typeof image !== "object" ||
      typeof image.id !== "string" ||
      typeof image.name !== "string" ||
      typeof image.link !== "string"
    ) {
      throw new Error("Invalid image format")
    }
  }

  return true
}

module.exports = {
  isValidateId,
  isValidPositiveInteger,
  isValidItem,
  validProduct,
  validateImages
}
