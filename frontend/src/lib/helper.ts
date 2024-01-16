
export const formatDecimal = (
  value: number, 
  decPlaces: number = 2
  ): number => 
{
  return Number(Math.round(parseFloat(`${value}e${decPlaces}`)) + `e-${decPlaces}`)
}


export const formatCurrency = (
  numeric: number | string, 
  currency: string = "USD", 
  locale: string = 'en-US'): string => 
{
  // const formatCommas = (fixedNum: string): string => {
  //   return fixedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // }
  
  const formatIntl = (
    price: number, 
    currency: string, 
    locale: string, 
    numFraction: number = 2): string => 
  {
    return Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: numFraction
    }).format(price)
  }

  if (Boolean(numeric) === false)
    return formatIntl(0, currency, locale)
  
  const number: number = 
    typeof numeric === 'string' ? parseFloat(numeric) : numeric

  if (isNaN(number))
    return 'NaN'
  
  let index = Math.floor(Math.log10(number) / 3)
  
  if (index < 2) {
    const numFraction = number.toFixed(2) === '0.00' ? 10 : 2
    return formatIntl(number, currency, locale, numFraction)
  }
  
  index = index > 5 ? 5 : index
  const suffixes = ["", "", "M", "B", "T", "Q"]
  const shorted = number / Math.pow(10, index * 3)
  const suffix = suffixes[index]
  return formatIntl(shorted, currency, locale, 1) + suffix
}


export const assetPriceInCurrency = (
  assetAmount: number,
  priceInUSD: number = 1, 
  currency: string = "USD"
): string => 
{
  if (Boolean(assetAmount) === false)
    return formatCurrency(0, currency)

  let localPrice = 1

  if (currency.length !== 3)
    return '0.00 ' + currency

  if (currency === "USD")
    localPrice = priceInUSD

  else 
    return formatDecimal(
      assetAmount
    ).toString() + ' ' + currency
  // TODO: implement currency converter here instead only USD
  // Using live data from API

  return formatCurrency(
    Math.floor(assetAmount * localPrice), currency)
}


export const titleToSlug = (title: string): string => {
  if (!title.trim().length)
    return ''

	return title
          .toLowerCase()
          .trim()
          .replace(/ /g, '-')
          .replace(/[^\w-.)([\]_]+/g, '')
}

