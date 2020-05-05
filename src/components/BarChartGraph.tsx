import React from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

interface Props {
  data: any
}
class BarChartGraph extends React.Component<Props, {}> {
  render() {
    return (
      <BarChart
        width={800}
        height={300}
        data={this.props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="study_hour" fill="#8884d8" />
      </BarChart>
    )
  }
}

export default BarChartGraph
