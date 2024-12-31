import React from 'react';
import BarLineChart from '../charts/BarLineChart';

const chartData = [
    { month: "January", balance: 150, debit: 100 },
    { month: "February", balance: 280, debit: 180 },
    { month: "March", balance: 320, debit: 220 },
    { month: "April", balance: 180, debit: 150 },
    { month: "May", balance: 250, debit: 160 },
    { month: "June", balance: 290, debit: 200 },
    { month: "July", balance: 180, debit: 120 },
    { month: "August", balance: 220, debit: 170 },
    { month: "September", balance: 350, debit: 240 },
    { month: "October", balance: 270, debit: 190 },
    { month: "November", balance: 310, debit: 230 },
    { month: "December", balance: 400, debit: 260 },
];

const Investment = () => {
    return (
        <div className="bg-white rounded-lg p-4">
            <BarLineChart
                data={chartData}
                title="Investment"
                xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'debit', type: 'bar', color: 'hsl(var(--chart-3))' },
                    { key: 'balance', type: 'line', color: 'hsl(var(--chart-5))' },
                ]}
            />
        </div>
    );
};

export default Investment;
