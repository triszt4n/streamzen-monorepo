export function shortenStringWithEllipsis(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str // No need to shorten
  }

  var halfLength = Math.floor((maxLength - 3) / 2) // Calculate half of the remaining length after removing ellipsis
  var firstHalf = str.slice(0, halfLength) // Take the first half of the string
  var secondHalf = str.slice(-halfLength) // Take the last half of the string
  return firstHalf + '...' + secondHalf // Concatenate with ellipsis in between
}
