// shipping fee
const shippingFeeMap = {
  store: 0,
  standard: 60,
}

const calShippingFee = (method) => {
  const fee = shippingFeeMap[method]
  return fee
}

module.exports = {
  calShippingFee
}
