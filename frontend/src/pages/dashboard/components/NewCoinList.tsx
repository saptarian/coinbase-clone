import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link, LinkProps } from 'react-router-dom'
import { useNewCoins } from '@/lib/hooks'
import { CryptoListViewWithPassTime } from '@/types'

const A_DAY_IN_MILLISECONDS = (1000 * 3600 * 24)


const NewCoinList: React.FC<{ 
	limit?: number 
}> = ({ limit = 5 }) => 
{
	const {coins, isLoading} = useNewCoins(limit)
	// console.log('NewCoinList.render', coins)


	return (
		<ul className="overflow-x-hidden leading-5">
			{coins ? (
				coins.map((coin) => (
					<li key={coin.slug}>
						<CoinListItemLinked
							to={coin.slug ? `/price/${coin.slug}` : ''}>
							<CoinListItem coin={coin} />
						</CoinListItemLinked>
					</li>
				))
			) : (
				Array.from({ length: 5 }).map((_,val) => (
					<li key={val}>
						<CoinListItem isLoading={isLoading} />
					</li>
				))
			)}
		</ul>
	)
}


const CoinListItemLinked: React.FC<
	LinkProps & React.RefAttributes<HTMLAnchorElement>
> = ({ to, children }) => {
		return (
			<Link to={to}
				className={`hover:bg-slate-100/50 block ${
					to === '' ? "pointer-events-none" : ""
				}`}>
				{children}
			</Link>
		)
	}


export const CoinListItem = (
	{ coin = {}, isLoading }: {
		coin?: Partial<CryptoListViewWithPassTime>
		isLoading?: boolean
	}
) => 
{
	return (
		<SkeletonTheme enableAnimation={isLoading}>
			<div className="flex gap-3 items-center grow px-6 py-3">
				<span className="w-6 flex-none" >
					{coin.logo ? (
						<img src={coin.logo} />
					) : (
						<Skeleton circle height={30} width={30} />
					)}
				</span>
				<div className="overflow-x-hidden grow">
					<h3 className="truncate">
						{coin.name || <Skeleton />}
					</h3>
					<p className="text-sm text-gray-500">
						{coin.passedTime
							? `Added ${coin.passedTime}`
							: <Skeleton />
						}
					</p>
				</div>
			</div>
		</SkeletonTheme>
	)
}


export default NewCoinList
