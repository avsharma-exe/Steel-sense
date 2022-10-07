export default function displayDate(dateObj) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return weekdays[dateObj.getDay()] + " " + months[dateObj.getMonth()] + " " + dateObj.getDate() + " " + dateObj.getFullYear()
}
