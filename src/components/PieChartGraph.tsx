import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// const RADIAN = Math.PI / 180
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   teaching_material
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
//   const x = cx + radius * Math.cos(-midAngle * RADIAN)
//   const y = cy + radius * Math.sin(-midAngle * RADIAN)

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//     >
//       {teaching_material}
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   )
// }

interface Props {
  data: any
}

class PieChartGraph extends PureComponent<Props, {}> {
  render() {
    const { data } = this.props
    console.log(data, 'data')

    return (
      <>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx={100}
            cy={100}
            labelLine={false}
            // label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="study_hours"
            startAngle={450}
            endAngle={90}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            formatter={(value, { payload }) => payload.teaching_material}
          ></Legend>
        </PieChart>
      </>
    )
  }
}

export default PieChartGraph
