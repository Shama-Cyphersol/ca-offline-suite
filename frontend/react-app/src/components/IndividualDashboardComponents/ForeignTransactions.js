import React from 'react'
import SingleLineChart from '../charts/LineChart'

const data = []

const ForeignTransactions = () => {
    return (
        <div className="bg-white rounded-lg space-y-6 m-8">
                {data.length === 0 ? (
                        <div className="flex justify-center items-center p-6">
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                        </div>
                ) : (
                        <SingleLineChart data={data}/>
                )}
        </div>
    )
}

export default ForeignTransactions