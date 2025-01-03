import React from 'react'
import SingleLineChart from '../charts/LineChart'
import DataTable from './TableData'

const chartData = [
    { month: "January", balance: 18},
    { month: "February", balance: 250},
    { month: "March", balance: 237},
    { month: "April", balance: 73},
    { month: "May", balance: 209},
    { month: "June", balance: 214},
    { month: "July", balance: 18},
    { month: "August", balance: 280},
    { month: "September", balance: 237},
    { month: "October", balance: 73},
    { month: "November", balance: 209},
    { month: "December", balance: 214},
  ]

const EodBalance = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <SingleLineChart title='EOD Balance'
      data={chartData} 
      xAxis={{ key: "month"}}
      />
      <div>
            <DataTable data={chartData} />
          </div>
    </div>
  )
}

export default EodBalance;
