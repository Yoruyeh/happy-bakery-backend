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
const isValidOrderItem = (item) => {
  return (
    item.id !== undefined &&
    item.quantity !== undefined &&
    item.price !== undefined &&
    isValidPositiveInteger(item.id) &&
    isValidPositiveInteger(item.quantity) &&
    isValidPositiveInteger(item.price)
  )
}

module.exports = {
  isValidateId,
  isValidOrderItem
}
