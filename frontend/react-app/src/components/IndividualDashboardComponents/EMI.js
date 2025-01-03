import React from 'react';
import BarLineChart from '../charts/BarLineChart';
import DataTable from './TableData';

const chartData = [
    { month: "January", balance: 80, credit: 100 },
    { month: "February", balance: 180, credit: 220 },
    { month: "March", balance: 150, credit: 180 },
    { month: "April", balance: 120, credit: 150 },
    { month: "May", balance: 140, credit: 160 },
    { month: "June", balance: 110, credit: 130 },
    { month: "July", balance: 150, credit: 170 },
    { month: "August", balance: 190, credit: 210 },
    { month: "September", balance: 170, credit: 190 },
    { month: "October", balance: 200, credit: 230 },
    { month: "November", balance: 180, credit: 200 },
    { month: "December", balance: 160, credit: 180 },
];

const EMI = () => {
    return (
        <div className="bg-white rounded-lg p-4">
            <BarLineChart
                data={chartData}
                title="Probable EMI"
                xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'credit', type: 'bar', color: 'hsl(var(--chart-5))' },
                    { key: 'balance', type: 'line', color: 'hsl(var(--chart-3))' },
                ]}
            />

        <div>
            <DataTable data={chartData} />
          </div>
        </div>
    );
};

export default EMI;
