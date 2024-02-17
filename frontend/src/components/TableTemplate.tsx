import React from 'react'
import { AngleRight } from '@/components/Icons'
import { SortByOption, SortableHeader } from '@/types'


type Props = {
	title?: string
	headers: Array<SortableHeader>
	className?: string
	children: React.ReactNode
	divider?: boolean
}

function TableTemplate({
	title, headers, children, className, divider = true
}: Props) {
	const [
		sort, setSort
	] = React.useState<SortByOption>(null)

	// console.log('TableTemplate.render', headers)


	return (
		<>
			{title ? (
				<h2 className="font-medium text-lg py-4 border-b">
					{title}
				</h2>
			) : ''}
			<table className="leading-5 table-fixed text-left w-full">
				<thead>
					<tr className="text-sm text-gray-500">
						{headers.map((header) => (
							<th key={header.id}
								title={header.label}
								className={`${
									className ?? 'first:pl-3 last:pr-3 py-3 last:text-center'
									} ${
									header.handleSort ? "cursor-pointer" : ""
									} pr-1.5`}
								style={{ width: header.width ?? '' }}
								onClick={() => {
									if (header.handleSort) {
										let sortBy = header.sortable

										if (sort === header.sortable)
											sortBy = 'default'

										setSort(sortBy)
										header.handleSort(sortBy)
									}
								}}
							>
								<p className="truncate grow">
									{header.label}
									<span className="inline-block pl-1.5">
										{header.handleSort ? sort === header.id ? (
											<AngleRight className="w-1.5 rotate-90
			        						text-blue-500" />
										) : (
											<AngleRight className="w-1.5" />
										)
											: ''}
									</span>
								</p>
							</th>
						))}
					</tr>
				</thead>
				<tbody className={
					`${divider ? "divide-y" : ''} border-t`
				}>
					{children}
				</tbody>
			</table>
		</>
	)
}


export default TableTemplate
