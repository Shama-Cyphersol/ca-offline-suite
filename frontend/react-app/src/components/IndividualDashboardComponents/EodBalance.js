import React from 'react'
import SingleLineChart from '../charts/LineChart'

const chartData = [
    { month: "January", desktop: 18},
    { month: "February", desktop: 300},
    { month: "March", desktop: 237},
    { month: "April", desktop: 73},
    { month: "May", desktop: 209},
    { month: "June", desktop: 214},
    { month: "July", desktop: 18},
    { month: "August", desktop: 280},
    { month: "September", desktop: 237},
    { month: "October", desktop: 73},
    { month: "November", desktop: 209},
    { month: "December", desktop: 214},
  ]

const EodBalance = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <SingleLineChart title='EOD Balance'
      data={chartData} 
      xAxis={{ key: "month"}}
      />
    </div>
  )
}

export default EodBalance;
