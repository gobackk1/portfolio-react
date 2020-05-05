import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  teaching_material
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {teaching_material}
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface Props {
  data: any
}

class PieChartGraph extends PureComponent<Props, {}> {
  render() {
    return (
      <>
        <PieChart width={600} height={400}>
          <Pie
            data={this.props.data}
            cx={200}
            cy={200}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={200}
            fill="#8884d8"
            dataKey="study_hours"
          >
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        {this.props.data.map((d, index) => (
          <div key={index}>{d.name}</div>
        ))}
      </>
    )
  }
}

export default PieChartGraph
