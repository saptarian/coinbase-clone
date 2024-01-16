
type Props = {
	title: string
	children: React.ReactNode
	headers: Array<React.ReactNode>
}


function TableTemplateLink(
	{ title, headers, children }: Props) {
	return (
		<>
			<h2 className="font-medium text-lg truncate px-5 py-3">
				{title}
			</h2>

			<ul className="text-sm text-gray-500 font-medium 
				grid grid-cols-10 px-5 py-2">
				{headers.map((header, index) => (
					<li key={index}
						className="last:text-right col-span-2 
						first:col-span-4">
						{header}
					</li>
				))}
			</ul>

			<ul className="leading-5 divide-y">
				{children}
			</ul>
		</>
	)
}


export default TableTemplateLink
