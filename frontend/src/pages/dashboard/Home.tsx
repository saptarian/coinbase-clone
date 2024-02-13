import { PriceDisplay } from '@/components/Numeric'
import SimpleChart from '@/components/SimpleChart'
import LatestNews from '@/components/LatestNews'
import TransactionList from './components/TransactionList'
import { 
	useCoins, 
	useWallets, 
	useTransactionSparkData, 
} from '@/lib/hooks'
import CoinList from './components/CoinList'


export function Home() 
{
  const [data,] = useTransactionSparkData()
	// console.log('Home.render', data, isLoading)

	return (
		<main className="max-w-screen-xl grow mx-auto md:bg-slate-100
			flex gap-3 flex-col lg:flex-row md:px-5 md:py-3 w-full">
			<div className="space-y-3 max-md:divide-y grow">
				<section className="md:container-section">
					<div className="flex gap-5 justify-between
						items-end p-6">
						<BalanceInfo />
            <div className="w-44">
							<SimpleChart 
								data={data.length 
									? data.slice(-100) 
									: Array(8).fill(0)}
							/>
            </div>
					</div>
				</section>
				<section className="md:container-section divide-y">
					<h2 className="px-5 py-3 font-medium text-lg">
						Recent Transactions
					</h2>
					<TransactionList limit={7} />
				</section>

				<section className="md:container-section">
					<LatestNews  
						title="Latest Cryptocurrencies News"
					/>
				</section>
			</div>
			<div className="lg:w-[300px] shrink-0 
				flex flex-col gap-3">
				<section className="md:container-section">
					<ToptenCryptos />
				</section>
			</div>
		</main>
	)
}


const FiatBalanceInfo = () => 
{
	const [walletList,] = useWallets()
	let fiatBalance = 0

	if (walletList) {
		walletList.forEach(wallet => {
			if (wallet.asset_is_fiat === true) {
				fiatBalance += wallet.balance
			}
		})
	}


	return <PriceDisplay price={fiatBalance} />
}


const ToptenCryptos = () => 
{
	const { coins, isLoading } = useCoins({ limit: 10 })

	return (
		<CoinList
			title="Top 10 cryptocurrencies"
			coins={coins}
			isLoading={isLoading}
		// path="/trade"
		/>
	)
}


const BalanceInfo = () => 
{
	return (
		<div className="leading-5">
			<h3 className="font-medium text-lg text-stone-500">
				Your balance</h3>
			<h2 className="font-medium text-3xl">
				<FiatBalanceInfo />
			</h2>
		</div>
	)
}

// const WatchListRow: React.FC<{
// 	isLoading: boolean,
// 	coin: CryptoListWithNumeric
// }> = ({ isLoading, coin }) => {
// 	const navigate = useNavigate()

// 	return (
// 		<SkeletonTheme enableAnimation={isLoading}>
// 			<tr onClick={() => {
// 				if (!isLoading && coin.slug)
// 					navigate('/price/' + coin.slug)
// 			}} className="hover:bg-slate-100/50 cursor-pointer">
// 				<td className="flex items-center gap-3 py-2 pl-5 mr-3">
// 					<span className="w-6 flex-none" >
// 						{coin.logo ? (
// 							<img src={coin.logo} />
// 						) : (
// 							<Skeleton circle height="30px" />
// 						)}
// 					</span>
// 					<div className="overflow-x-hidden">
// 						<p className="font-medium truncate">
// 							{coin.name || <Skeleton />}
// 						</p>
// 						<p className="text-gray-500">
// 							{coin.symbol || <Skeleton />}
// 						</p>
// 					</div>
// 				</td>
// 				<td className="mr-3">
// 					<p className="truncate">{coin.price ? (
// 						<PriceDisplay price={coin.price} />
// 					) : (
// 						<Skeleton />
// 					)}
// 					</p>
// 					{/*<div className="sm:hidden">
// 	      		{coin.percent_change_24h ? (
// 	      			<StyledNumericDisplay
// 			        	valueWithSign={coin.percent_change_24h} >
// 			        	<DecimalDisplay value={coin.percent_change_24h} />
// 			        </StyledNumericDisplay>
// 		      	) : (
// 		      		<Skeleton />
// 		      	)}
// 	        </div>*/}
// 				</td>
// 				<td className="">
// 					{coin.percent_change_24h ? (
// 						<StyledNumericDisplay
// 							valueWithSign={coin.percent_change_24h} >
// 							<DecimalDisplay value={coin.percent_change_24h} />
// 						</StyledNumericDisplay>
// 					) : (
// 						<Skeleton />
// 					)}
// 				</td>
// 				<td className="">
// 					{coin.market_cap ? (
// 						<PriceDisplay price={coin.market_cap} />
// 					) : (
// 						<Skeleton />
// 					)}
// 				</td>
// 				<td className="pr-5 text-center">
// 					{coin.price ? (
// 						<button onClick={(e) => {
// 							e.stopPropagation()
// 					 // console.log('Unwatch')
// 						}}
// 							className="link"><small
// 								className="font-medium">unwatch</small>
// 						</button>
// 					) : ''}
// 				</td>
// 			</tr>
// 		</SkeletonTheme>
// 	)
// }


// const tableHeaders = ['Name', 'Balance', 'Price', 'Allocation']
// const colSpan = (n: number) => ({
// 	gridColumnStart: `span ${n}`,
// 	gridColumnEnd: `span ${n}`,
// })

// const watchListHeaders: Array<SortableHeader> = [
// 	{ id: 'name', label: 'Name', width: '35%' },
// 	{ id: 'price', label: 'Price', sortable: 'price', width: '5em' },
// 	{ id: 'change', label: 'Change', sortable: 'change', width: '4em' },
// 	{ id: 'market-cap', label: 'Market cap', sortable: 'market-cap', width: '5em' },
// 	{ id: 'watch', label: 'Watch', width: '4em' },
// ]

// const TableSections = () => {
// 	const { pref } = useOutletContext<DashboardContextType>()
// 	const [
// 		sortBy,
// 		setSortBy
// 	] = React.useState<SortByOption>(null)

// 	const { coins, isLoading } = useCoins({
// 		limit: 10,
// 		sortBy,
// 		currency: pref.currency,
// 	})

// 	const watchListHeadersWithHandleSort =
// 		React.useMemo<Array<SortableHeader>>(() =>
// 			watchListHeaders.map((header) => {
// 				return {
// 					...header,
// 					handleSort: header.sortable ? setSortBy : undefined
// 				}
// 			}), [])


// 	return (
// 		<>
// 			<section className="md:container-section">
// 				<TableTemplate title="WatchList"
// 					className="first:pl-5 last:pr-5"
// 					headers={watchListHeadersWithHandleSort}>
// 					{coins?.map((coin, idx) => (
// 						<WatchListRow key={idx}
// 							coin={coin}
// 							isLoading={isLoading}
// 						/>
// 					))}
// 				</TableTemplate>
// 			</section>
// 			<section className="md:container-section divide-y">
// 				<TableTemplateLink title="Your assets"
// 					headers={tableHeaders}>
// 					{coins?.slice(0, 2).map((asset, index) => (
// 						<li key={index} >
// 							<AssetList asset={asset}
// 								listStyle={[
// 									colSpan(4),
// 									colSpan(2),
// 									colSpan(2),
// 									colSpan(2),
// 								]}
// 								isLoading={isLoading}
// 								className="grid grid-cols-10"
// 							/>
// 						</li>
// 					))}
// 				</TableTemplateLink>
// 			</section>
// 		</>
// 	)
// }
