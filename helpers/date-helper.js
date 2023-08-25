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

module.exports = {
  dateFormate,
  dateFormateMonth
}
