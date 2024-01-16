import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'

import { ArrowLeftToBracket, ArrowRightToBracket } from '@/components/Icons'
import { PriceDisplay, DecimalDisplay } from '@/components/Numeric'
import type { TransactionType } from '@/types'
import { useTransactions } from '@/lib/hooks'


type Variant = 'basic' | 'simple'
type TransactionListProps = {
	assetSlug?: string
	limit?: number
	variant?: Variant
}

const TransactionList: React.FC<TransactionListProps> = ({
	assetSlug = '', limit = 100, variant = 'basic'
}) => {
	const [transactions,] = useTransactions(assetSlug)
	// console.log('TransactionList.render', transactions)

	if (transactions?.length === 0)
		return <NoTransaction />


	return (
		<ul className="md:divide-y leading-5">
			{transactions ? transactions.slice(
				0, limit).map((item, index) => (
					<li className="hover:bg-slate-100/50" key={index}>
						<TransactionItem item={item} variant={variant} />
					</li>
				)) : (
				[1, 2, 3, 4].map((i) => (
					<li className="hover:bg-slate-100/50" key={i}>
						<TransactionItem />
					</li>
				))
			)}
		</ul>
	)
}


const NoTransaction = () => {
	return (
		<div className="flex flex-col gap-3 max-sm:text-center
			px-5 py-3">
			<span className="">
				<img src="" className="" />
			</span>
			<h3 className="font-medium text-lg">
				No transactions
			</h3>
			<p className="leading-4">
				You don't have any transactions. <br />
				Ready to make a purchase?
			</p>
			<span className="py-3">
				<Link to="/trade" className="primary-btn-sm">
					Trade
				</Link>
			</span>
		</div>
	)
}


type TransactionItemType = {
	item?: Partial<TransactionType>
	variant?: Variant
}


const TransactionItem: React.FC<TransactionItemType> = ({
	item = {},
	variant = 'basic'
}) => {
	const [date, month] =
		item.timestamp?.split(' ').slice(1, 3) ?? ['', '']

	return (
		<Link to={item.asset_slug
			? `/accounts/${item.asset_slug}`
			: ''}
			className={`items-center w-full flex gap-3 ${item.asset_slug ? '' : "pointer-events-none"} px-5 py-3`}>
			{variant === 'basic' ? (
				<div className="text-center w-8 leading-3">
					<p className="font-medium text-stone-800">
						{month || <Skeleton />}
					</p>
					<p className="text-stone-400 text-xl">
						{date || <Skeleton />}
					</p>
				</div>
			) : (
				<span className="w-4 shrink-0">
					{item.transaction_type
						? item.transaction_type === 'sell' ? (
							<ArrowRightToBracket
								className="text-amber-400"
							/>
						) : (
							<ArrowLeftToBracket
								className="text-amber-400 rotate-180"
							/>
						) : (
							<Skeleton width={32} height={32} circle />
						)}
				</span>
			)}
			{variant === 'basic' ? (
				<span className="w-6 shrink-0">
					{item.transaction_type
						? item.transaction_type === 'sell' ? (
							<ArrowRightToBracket
								className="text-amber-400"
							/>
						) : (
							<ArrowLeftToBracket
								className="text-amber-400 rotate-180"
							/>
						) : (
							<Skeleton width={32} height={32} circle />
						)}
				</span>
			) : ''}
			<div className="grow overflow-hidden">
				{item.transaction_type ? (
					<>
						<h2 className="font-medium truncate">
							{item.transaction_type === 'sell' ?
								"Sold" : "Bought"} {item.asset_name}
						</h2>
						<p className={`truncate ${variant === 'basic'
							? "" : "text-sm"} text-stone-400`}>
							{item.transaction_type === 'sell' ?
								"Added to" : "Using"} {item.wallet_name}
						</p>
					</>
				) : (
					<Skeleton width="100%" />
				)}
			</div>
			<div className={`shrink-0 ${variant === 'basic'
				? "" : "text-sm"} text-right`}>
				{item.transaction_type && item.order_amount
					&& item.order_price ? (
					<>
						<p className="font-medium truncate">
							{item.transaction_type === 'sell' ?
								"-" : "+"} <DecimalDisplay
								value={item.order_amount}
								decPlaces={4}
							/> {item.asset_symbol}
						</p>
						<p className="text-stone-400 truncate">
							{item.transaction_type === 'sell' ?
								"+" : "-"} <PriceDisplay
								price={item.order_amount * item.order_price}
							/>
						</p>
					</>
				) : (
					<Skeleton width={42} height={16} />
				)}
			</div>
		</Link>
	)
}


export default TransactionList
