export const currencyFormater = (amount) => {
	const digit = amount.split('.')[0]
  
	if (digit.length >= 13) //T
		return `$${digit/(10**12)}T`

	if (digit.length >= 10) //B
		return `$${digit/(10**9)}B`

	if (digit.length >= 7) //M
		return `$${digit/(10**6)}M`

	return `$${amount}`
}

export const coloredNumber = (ele):void => {
	if (!ele || !ele.innerHTML) return;
	if (ele.innerHTML[0] === '+') {
		ele.classList.add('text-green-600')
	} else if (ele.innerHTML[0] === '-') {
		ele.classList.add('text-red-600')
	}
	return;
}

export const titleToSlug = (title: string): string => {
  if (!title.trim().length)
    return ''

	return title
          .toLowerCase()
          .trim()
          .replace(/ /g, '-')
          .replace(/[^\w-.)(\[\]_]+/g, '')
}