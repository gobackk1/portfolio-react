import React from 'react'
import BarChartGraph from '@/components/BarChartGraph'
import PieChartGraph from '@/components/PieChartGraph'
import axios, { auth } from '@/axios'

class Report extends React.Component {
  state = {
    study_hours: {
      today: 0,
      week: 0,
      total: 0
    },
    study_time_per_week: [],
    report_by_teaching_material: []
  }
  fetchData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/1/report`,
      auth
    )

    this.setState({
      ...res.data
    })

    console.log(res.data)
  }
  componentDidMount() {
    this.fetchData()
  }
  render() {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>今日</th>
              <th>今週</th>
              <th>総計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.study_hours.today}時間0分</td>
              <td>{this.state.study_hours.week}時間0分</td>
              <td>{this.state.study_hours.total}時間0分</td>
            </tr>
          </tbody>
        </table>
        <BarChartGraph data={this.state.study_time_per_week}></BarChartGraph>
        <PieChartGraph
          data={this.state.report_by_teaching_material}
        ></PieChartGraph>
      </>
    )
  }
}

export default Report
