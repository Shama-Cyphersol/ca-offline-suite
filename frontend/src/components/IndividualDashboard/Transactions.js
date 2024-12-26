import React from 'react'
import BarChart from "../charts/SingleBarChart"
import PieChart from "../charts/PieChart"
import HorizontalBarGraph from "../charts/HorizontalBarGraph"
import LineBarChart from "../charts/LineBarChart"
import Linechart from "../charts/Linechart"

const barChartData = [
    {
        month: 'Jan',
        credit: 1000,
        debit: 800
      },
      {
        month: 'Feb',
        credit: 1200,
        debit: 300
    },
    {
        month: 'Mar',
        credit: 1400,
        debit: 1000
    },
    {
        month: 'Apr',
        credit: 2000,
        debit: 500
    },
    {
        month: 'May',
        credit: 1500,
        debit: 700
    },
    {
        month: 'Jun',
        credit: 1200,
        debit: 900
    },
    {
        month: 'Jul',
        credit: 1000,
        debit: 800
    },
    {
        month: 'Aug',
        credit: 1200,
        debit: 300
    },

];

const expensesData = [
  { name: 'Creditor Amount', value: 50000 },
  { name: 'Salaries Paid', value: 75000 },
  { name: 'Probable EMI', value: 25000 },
  { name: 'Investment Details', value: 30000 }
];

const Transactions = () => {
  return (
    <div>
      <div className="">
        <div className="">
          <BarChart data={barChartData}/>
        </div>
        <div className="">
          <PieChart data={expensesData}/>
        </div>
      </div>
    </div>
  )
}

export default Transactions