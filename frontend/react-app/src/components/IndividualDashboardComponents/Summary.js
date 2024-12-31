import React from 'react'
import SingleBarChart from '../charts/BarChart'
import {PieCharts} from '../charts/PieCharts'
import DataTable from './TableData'


const chartData = [
    { month: "January", credit: 186, debit: 80 },
    { month: "February", credit: 305, debit: 200 },
    { month: "March", credit: 237, debit: 120 },
    { month: "April", credit: 73, debit: 190 },
    { month: "May", credit: 209, debit: 130 },
    { month: "June", credit: 214, debit: 140 },
    { month: "July", credit: 186, debit: 80 },
    { month: "August", credit: 305, debit: 200 },
    { month: "September", credit: 237, debit: 120 },
    { month: "October", credit: 73, debit: 190 },
    { month: "November", credit: 209, debit: 130 },
    { month: "December", credit: 214, debit: 140 },
  ]


const Summary = () => {
return (
        <>
        <div className="bg-white rounded-lg p-4 mb-4">
            <SingleBarChart data={chartData} title='Credit vs Debit'
            xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'credit', type: 'bar', color: 'hsl(var(--chart-3))' },
                    { key: 'debit', type: 'line', color: 'hsl(var(--chart-5))' },
                ]} />
        </div>
        <div className="bg-white rounded-lg p-4">
            <PieCharts />
        </div>
        <div>
            <DataTable data={chartData} />
          </div>
        </>
            


)
}

export default Summary