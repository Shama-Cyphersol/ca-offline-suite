import React from 'react';
import PieCharts from '../charts/PieCharts';
import EntityTable from './EntityTable';
import entitydistdata from "../../data/entity_analysis.json";

function EntityDistribution() {
  // Sort the data by No_of_times_occurred in descending order
  const sortedData = [...entitydistdata].sort((a, b) => b.No_of_times_occurred - a.No_of_times_occurred);

  // Select the top 10 entities
  const top10Entities = sortedData.slice(0, 10);

  return (
    <div className="space-y-6 m-8">
      <PieCharts 
        title='Top 10 Entity Distribution'
        data={top10Entities}
        nameKey="Entity_Name"
        valueKey="No_of_times_occurred"
      />
      
      <EntityTable/>
    </div>
  );
}

export default EntityDistribution;