function precision(a) {
  if (!isFinite(a)) return 0
  var e = 1,
    p = 0
  while (Math.round(a * e) / e !== a) {
    e *= 10
    p++
  }
  return p
}

export const wholeNumberToFractionArray = wholeNumber => {
  if (typeof wholeNumber !== 'number')
    throw new Error(
      `wholeNumberToFractionArray only handles numbers, value: ${wholeNumber} is type: ${typeof wholeNumber}`
    )
  const decimalPlaces = precision(wholeNumber)
  const numerator = wholeNumber * Math.pow(10, decimalPlaces)
  const denominator = Math.pow(100, decimalPlaces)
  return [numerator, denominator]
}

export const fractionArrayToWholeNumber = fractionArray => {
  if (!Array.isArray(fractionArray) || fractionArray.length !== 2)
    throw new Error(
      `fractionArrayToWholeNumber only handles arrays of size 2, value: ${fractionArray} is type: ${typeof fractionArray}`
    )
  if (
    typeof fractionArray[0] !== 'number' ||
    typeof fractionArray[1] !== 'number'
  )
    throw new Error(
      `fractionArrayToWholeNumber only handles arrays of size 2 composed of numbers, value: ${fractionArray} is composed of types: [${typeof fractionArray[0]}, ${typeof fractionArray[1]}]`
    )

  const wholeNumber = (fractionArray[0] / fractionArray[1]) * 100
  return wholeNumber
}
