import { Sparklines, SparklinesLine } from 'react-sparklines'


const SimpleChart: React.FC<{
  data?: Array<number>
  height?: number
  color?: string
  strokeWidth?: number
}> = ({data, height, color, strokeWidth}) => 
{
  return (
    <Sparklines 
      data={data ?? sampleData}
      height={height}
    >
      <SparklinesLine 
        color={color ?? "#2563EB"}
        style={{ 
          strokeWidth: strokeWidth ?? 2, 
        }} 
      />
    </Sparklines>
  )
}


const sampleData = [
  69.68458, 68.84907, 67.55169, 69.65722,  69.7613, 69.08838,
  68.95595, 69.32301, 70.35046, 71.24594,  71.1955, 70.81925,
  73.91264, 72.69453,  72.7095, 72.68272, 72.91882,  72.9555
]

export default SimpleChart