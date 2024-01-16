import { formatCurrency, formatDecimal } from '@/lib/helper'


export const PriceDisplay = (
	{price, currency}: {price: string | number, currency?: string}
) => formatCurrency(price, currency)


export const DecimalDisplay = (
	{value, decPlaces}: {value: number, decPlaces?: number}
) => formatDecimal(value, decPlaces)


type Props = {
	valueWithSign: number | string
	className?: string
	children?: React.ReactNode
  suffix?: string | number
}

export const StyledNumericDisplay: React.FC<Props> = (
  {valueWithSign, className, children, suffix}
) => 
{
	return (
		<span className={`${className ?? ''} ${
			valueWithSign.toString()[0] === '-'
			? "text-red-600" : "text-green-600"}`}>
			{children ? children : valueWithSign}{suffix}
    </span>
	)
}
