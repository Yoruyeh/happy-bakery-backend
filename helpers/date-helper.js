const { format } = require('date-fns')

// formate date
const dateFormate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// formate date to "Jan 22nd, 2022"
const dateFormateMonth = (dateString) => {
  const formattedDate = format(new Date(dateString), "MMM do, yyyy")
  return formattedDate
}

const getOneWeekAgo = () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return oneWeekAgo.toISOString().substring(0, 10)
}

const getToday = () => {
  const today = new Date()
  return today.toISOString().substring(0, 10)
}

module.exports = {
  dateFormate,
  dateFormateMonth,
  getOneWeekAgo,
  getToday
}
