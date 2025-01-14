// NetworkGraph.js
import React from 'react';
import NetworkGraphComponent from './networkgraph.jsx';
import 'reactflow/dist/style.css'; // This import is crucial!
import transactiondata from "../../data/Transaction.json"

// Sample data


function NetworkGraph() {
return (
  <div className="w-full h-full p-4">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-semibold">Network Graph</h1>
      <div className="flex gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Person</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span>Entity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span>Common Entity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-green-600"></div>
          <span>Credit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-red-600"></div>
          <span>Debit</span>
        </div>
      </div>
    </div>
    <div className="h-[80vh]">
      <NetworkGraphComponent transactions={transactiondata} />
    </div>
  </div>
);
}

export default NetworkGraph;