// check id is non-zero number
const validateId = (id) => {
  const idPattern = /^[1-9]\d*$/
  if (idPattern.test(id)) {
    return true
  }
}

module.exports = {
  validateId
}
