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

const getOneYearAgo = () => {
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  return oneYearAgo.toISOString().substring(0, 10)
}

const getToday = () => {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return today.toISOString().substring(0, 10)
}

// get random int
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// get random date between 2022-2023
const getRandomDate = () => {
  const year = getRandomInt(2022, 2023)
  const month = getRandomInt(1, 12)
  const daysInMonth = new Date(year, month, 0).getDate()
  const day = getRandomInt(1, daysInMonth)

  return new Date(year, month - 1, day)
}

module.exports = {
  dateFormate,
  dateFormateMonth,
  getOneYearAgo,
  getToday,
  getRandomDate
}
