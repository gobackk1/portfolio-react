import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Props {
  data: any
}
class BarChartGraph extends React.Component<Props, {}> {
  render() {
    const { data } = this.props

    return (
      <ResponsiveContainer width="95%" height={400}>
        <BarChart
          width={800}
          height={300}
          data={data}
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
          <Tooltip content={CustomTooltip} />
          {/* <Legend /> */}
          <Bar
            dataKey="study_hour"
            name="勉強時間"
            fill="#8884d8"
            barSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}時間`}</p>
      </div>
    )
  }

  return null
}

export default BarChartGraph
