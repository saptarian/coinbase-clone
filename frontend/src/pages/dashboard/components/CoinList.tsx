import { Link, LinkProps } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { PriceDisplay, DecimalDisplay, StyledNumericDisplay } from '@/components/Numeric'
import { CryptoListView } from '@/types'


type CoinListProps = {
	coins?: Array<CryptoListView>
	isLoading: boolean
	title?: string
	pathToSeeAll?: string
}

const CoinList: React.FC<CoinListProps> = (
	{coins, isLoading, title, pathToSeeAll}
) => 
{
	// console.log('CoinList.render', coins)

	return (
		<>
			{title ? (
				<div className="flex justify-between items-baseline 
					border-b">
					<CoinListTitle title={title} />
					{pathToSeeAll ? (
						<Link to={pathToSeeAll}
							className="px-5 link font-medium w-[5rem] text-right">
							See all</Link>
					) : ''}
				</div>
			) : ''}
			<ul className="overflow-x-hidden leading-5">
				{coins && !isLoading ? (
					coins.map((coin) => (
						<li key={coin.slug}>
							<CoinListItemLinked
								to={coin.slug ? `/price/${coin.slug}` : ''}>
								<CoinListItem coin={coin} />
							</CoinListItemLinked>
						</li>
					))
				) : (
					Array.from({ length: 7 }, (_, idx) => idx).map((val) => (
						<li key={val}>
							<CoinListItem isLoading={isLoading} />
						</li>
					))
				)}
			</ul>
		</>
	)
}


const headerItems = [
	{ name: 'name', label: 'Name', width: '' },
	{ name: 'price', label: 'Price', width: '8rem' },
	{ name: 'change', label: 'Change', width: '4rem' },
	{ name: 'market-cap', label: 'Market cap', width: '6rem' },
]

type HeaderItem = typeof headerItems[number]


export const CoinListWider: React.FC<CoinListProps> = ({
	title, coins, isLoading,
}) => {
	const handleBuy = (slug: string) => {
		console.warn('Unhndled! Use TableTemplate instead', slug)
	}

	const handleSort = (by: string) => {
		console.warn('Unhndled! Use TableTemplate instead', by)
	}


	return (
		<>
			{title ? (
				<div className="flex justify-between items-baseline">
					<CoinListTitle title={title} />
					<Link to="/trade"
						className="px-5 link font-medium w-[6rem] text-right">
						See all</Link>
				</div>
			) : ''}
			<div className="flex gap-8 max-sm:hidden">
				<CoinListHeader headerItems={headerItems} onSort={handleSort} />
				<div className="max-md:hidden invisible pr-3">
					<QuickBuyButton />
				</div>
			</div>
			<ul className="overflow-x-hidden leading-5">
				{coins && !isLoading ? (
					coins.map((coin, index) => (
						<li key={index} className="flex items-center gap-8">
							<CoinListItemLinked
								to={coin.slug ? `/price/${coin.slug}` : ''}>
								<CoinListItemWide
									coin={coin}
								/>
							</CoinListItemLinked>
							<div className="max-md:hidden pr-3">
								<QuickBuyButton onBuy={() => handleBuy(coin.slug)} />
							</div>
						</li>
					))
				) : (
					Array.from({ length: 7 }, (_, idx) => idx).map((val) => (
						<li key={val} className="flex items-center gap-8">
							<CoinListItemWide isLoading={isLoading} />
							<div className="max-md:hidden invisible pr-3">
								<QuickBuyButton />
							</div>
						</li>
					))
				)}
			</ul>
		</>
	)
}


const CoinListTitle = (
	{ title }: Required<Pick<CoinListProps, 'title'>>
) => {
	return (
		<h2 className="font-medium text-lg 
			py-4 px-5 truncate">
			{title}
		</h2>
	)
}


const QuickBuyButton = ({ onBuy }: { 
	onBuy?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void 
}) => 
{
	return (
		<button onClick={onBuy}
			className="primary-btn-sm">Buy
		</button>
	)
}

type CoinListHeaderProps = {
	headerItems: Array<HeaderItem>,
	onSort: (e: string) => void
}

const CoinListHeader = ({ headerItems, onSort }: CoinListHeaderProps) => {
	return (
		<div className="text-sm text-gray-500 py-4 px-5
			font-medium flex w-full gap-5">
			{headerItems.map((item) => (
				<div key={item.name}
					className="last:text-right first:grow"
					style={{ width: item.width }}>
					<button
						onClick={() => onSort(item.name)}
						name={item.name}
					>
						{item.label}
					</button>
				</div>
			))}
		</div>
	)
}


const CoinListItemLinked: React.FC<LinkProps> = (
	{ to, children }
) => {
	return (
		<Link to={to}
			className={`hover:bg-slate-100/50 block ${to === '' ? "pointer-events-none" : ""}`}>
			{children}
		</Link>
	)
}


export const CoinListItemBase: React.FC<Partial<
	Pick<CryptoListView, 'logo' | 'name' | 'symbol'>
>> = (
	{ logo, name, symbol }
) => {
		return (
			<div className="flex gap-3 items-center grow max-w-[55%]">
				<span className="w-6 flex-none" >
					{logo ? (
						<img src={logo} />
					) : (
						<Skeleton circle height={30} width={30} />
					)}
				</span>
				<div className="overflow-x-hidden grow">
					<h3 className="font-medium truncate">
						{name || <Skeleton />}
					</h3>
					<p className="text-gray-700">
						{symbol || <Skeleton />}
					</p>
				</div>
			</div>
		)
	}


type CoinListItemProps = {
	coin?: Partial<CryptoListView>
	isLoading?: boolean
}

export const CoinListItem: React.FC<CoinListItemProps> = (
	{ coin = {}, isLoading }
) => {
	return (
		<div className="flex gap-3 justify-between py-3 px-5">
			<SkeletonTheme enableAnimation={isLoading}>
				<CoinListItemBase
					logo={coin.logo}
					name={coin.name}
					symbol={coin.symbol}
				/>
				<div className="text-right overflow-x-hidden grow">
					<p className="truncate">{coin.price
						? <PriceDisplay price={coin.price} />
						: <Skeleton />}
					</p>
					{coin.percent_change_24h ? (
						<StyledNumericDisplay
							valueWithSign={coin.percent_change_24h} >
							<DecimalDisplay value={coin.percent_change_24h} />
						</StyledNumericDisplay>
					) : (
						<Skeleton />
					)}
				</div>
			</SkeletonTheme>
		</div>
	)
}


export const CoinListItemWide: React.FC<CoinListItemProps> = (
	{ coin = {}, isLoading }
) => {
	return (
		<div className="flex gap-5 items-center w-full py-3 px-5">
			<SkeletonTheme enableAnimation={isLoading}>
				<div style={{ width: headerItems[0].width }}
					className="flex items-center gap-3 grow">
					<span className="w-10" >
						{coin.logo
							? <img src={coin.logo} />
							: <Skeleton circle height="30px" />}
					</span>
					<div className="w-full">
						<h3 className="font-medium">
							{coin.name || <Skeleton />}
						</h3>
						<span className="text-gray-500">
							{coin.symbol || <Skeleton />}
						</span>
					</div>
				</div>
				<div style={{ width: headerItems[1].width }}
					className="text-right sm:text-left">
					<p>{coin.price
						? <PriceDisplay price={coin.price} />
						: <Skeleton />}
					</p>
					<div className="sm:hidden">
						{coin.percent_change_24h
							? <StyledNumericDisplay
								valueWithSign={coin.percent_change_24h} >
								<DecimalDisplay value={coin.percent_change_24h} />
							</StyledNumericDisplay>
							: <Skeleton />}
					</div>
				</div>
				<div style={{ width: headerItems[2].width }}
					className="hidden sm:block">
					{coin.percent_change_24h
						? <StyledNumericDisplay
							valueWithSign={coin.percent_change_24h} >
							<DecimalDisplay value={coin.percent_change_24h} />
						</StyledNumericDisplay>
						: <Skeleton />}
				</div>
				<div style={{ width: headerItems[3].width }}
					className="hidden sm:block text-right">
					{coin.market_cap
						? <PriceDisplay price={coin.market_cap} />
						: <Skeleton />}
				</div>
			</SkeletonTheme>
		</div>
	)
}


export default CoinList
