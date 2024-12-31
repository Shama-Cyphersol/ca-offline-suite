import React from 'react';
import BarLineChart from '../charts/BarLineChart';

const chartData = [
    { month: "January", balance: 120, credit: 80 },
    { month: "February", balance: 305, credit: 200 },
    { month: "March", balance: 237, credit: 120 },
    { month: "April", balance: 73, credit: 190 },
    { month: "May", balance: 209, credit: 130 },
    { month: "June", balance: 214, credit: 140 },
    { month: "July", balance: 110, credit: 80 },
    { month: "August", balance: 175, credit: 200 },
    { month: "September", balance: 237, credit: 120 },
    { month: "October", balance: 73, credit: 190 },
    { month: "November", balance: 209, credit: 130 },
    { month: "December", balance: 100, credit: 140 },
];

const Debtors = () => {
    return (
        <div className="bg-white rounded-lg p-4">
            <BarLineChart
                data={chartData}
                title="Debtors"
                xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'credit', type: 'bar', color: 'hsl(var(--chart-3))' },
                    { key: 'balance', type: 'line', color: 'hsl(var(--chart-5))' },
                ]}
            />
        </div>
    );
};

export default Debtors;
