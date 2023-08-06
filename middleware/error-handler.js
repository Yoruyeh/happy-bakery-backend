class CError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.name = 'CError'
  }
}

module.exports = {
  CError,
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      if (err.name === 'CError') {
        res.status(err.code || 500).json({
          status: 'error',
          message: `${err.name}: ${err.message}`
        })
      } else {
        res.status(err.status || 500).json({
          status: 'error',
          message: `${err.name}: ${err.message}`
        })
      }
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
