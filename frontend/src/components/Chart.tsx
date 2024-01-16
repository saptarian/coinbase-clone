import React from 'react'
// import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
// Import charts, all with Chart suffix
import { LineChart } from 'echarts/charts'
// import components, all suffixed with Component
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components' //DatasetComponent
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers' // SVGRenderer

// Register the required components
echarts.use(
  [LineChart, CanvasRenderer, GridComponent, TooltipComponent, TitleComponent]
)

// register theme object
// echarts.registerTheme('my_theme', {
//   backgroundColor: '#f4cccc'
// })
// echarts.registerTheme('another_theme', {
//   backgroundColor: '#eee'
// })


type ChartProps = {
  title?: string
  X?: Array<string>
  data?: Array<string | number>
  name?: string
  className?: string
  style?: React.CSSProperties
  yLimit?: number
}

const Chart: React.FC<ChartProps> = (
  {X=[], data=[], title, name, className, style, yLimit}
) => 
{
  const option: EChartsOption = {
    title: {
      left: 'center',
      text: title
    },
    tooltip : {
      trigger: 'axis',
      position: ['10%' ,0]
      // position: function (pt) {
      //   return [pt[0], '10%']
      // }
    },
    // legend: {
    //   data:['邮件营销','联盟广告','视频广告']
    // },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      top: '8%',
      containLabel: true,
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : X,
      }
    ],
    yAxis : [
      {
        type : 'value',
        max: yLimit,
        // boundaryGap: [0, '100%']
      }
    ],
    // dataZoom: [
    //   {
    //     type: 'inside',
    //     start: 0,
    //     end: 10
    //   },
    //   {
    //     start: 0,
    //     end: 10
    //   }
    // ],
    series : [
      {
        name: name,
        type:'line',
        sampling: 'lttb',
        // smooth: true,
        symbol: 'none',
        areaStyle: {},
        itemStyle: {
          color: 'gold'
        },
        animationEasing: 'cubicOut',
        animationDuration: 600,
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: 'rgb(90, 255, 131)'
        //     },
        //     {
        //       offset: 1,
        //       color: 'gold'
        //     }
        //   ])
        // },
        // areaStyle: {normal: {}},
        data: data,
      },
    ],
    // animationDurationUpdate: 0,
  }

  return (
  <>
    <ReactEChartsCore 
      echarts={echarts}
      option={option}
      lazyUpdate={true}
      className={className}
      style={style}
    />
    {/* <ReactECharts
      option={option}
      className={className}
      // theme='my_theme'
      style={style}
    /> */}
  </>
  )

  // render the echarts use option `theme`

}

export default Chart
