import { Link } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { PriceDisplay, DecimalDisplay, StyledNumericDisplay } from '@/components/Numeric'
import { CryptoListView } from '@/types'


const AssetList = ({asset, isLoading, className, listStyle}: {
	asset: CryptoListView
	isLoading: boolean
	className: string
	listStyle: Array<React.CSSProperties>
}) => 
{
	return (
		<Link to={`/price/`}
			className={`${className ? className : ''
				} items-center px-5 py-2 hover:bg-slate-100/50`}>
			<SkeletonTheme enableAnimation={isLoading}>
				<div style={listStyle?.[0]}
					className="flex items-center gap-3 grow">
					<span className="w-10" >
						{asset.logo ? (
							<img src={asset.logo} />
						) : (
							<Skeleton circle height="30px" />
						)}
					</span>
					<div className="w-full">
						<p className="font-medium">
							{asset.name || <Skeleton />}
						</p>
						<p className="text-gray-500">
							{asset.symbol || <Skeleton />}
						</p>
					</div>
				</div>
				<div style={listStyle?.[1]}
					className="w-full">
					<p>{asset.price
						? <PriceDisplay price={asset.price} />
						: <Skeleton />}
					</p>
				</div>
				<div style={listStyle?.[2]}
					className="w-full">
					{asset.percent_change_24h
						? <StyledNumericDisplay
							valueWithSign={asset.percent_change_24h} >
							<DecimalDisplay value={asset.percent_change_24h} />
						</StyledNumericDisplay>
						: <Skeleton />}
				</div>
				<div style={listStyle?.[3]}
					className="text-right w-full">
					{asset.market_cap
						? <PriceDisplay price={asset.market_cap} />
						: <Skeleton />}
				</div>
			</SkeletonTheme>
		</Link>
	)
}


export default AssetList
