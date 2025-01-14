import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import DataTable from '../IndividualDashboardComponents/TableData';
import transactionData from "../../data/Transaction.json";

const FundTracking = () => {
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    entity: ''
  });

  const [allTransactions, setAllTransactions] = useState([]);
  const [detailTables, setDetailTables] = useState([]);

  useEffect(() => {
    setAllTransactions(transactionData);
  }, []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(item => {
      const matchesDate = !filters.date || item['Value Date'] === filters.date;
      const matchesCategory = !filters.category || item.Category === filters.category;
      const matchesEntity = !filters.entity || item.Entity === filters.entity;
      return matchesDate && matchesCategory && matchesEntity;
    }).map(item => ({
      Date: item['Value Date'],
      Description: item.Description,
      Credit: item.Credit || 0,
      Debit: item.Debit || 0,
      Balance: item.Balance,
      Category: item.Category,
      Entity: item.Entity
    }));
  }, [filters, allTransactions]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setDetailTables([]);
  };

  const resetFilters = () => {
    setFilters({
      date: '',
      category: '',
      entity: ''
    });
    setDetailTables([]);
  };

  const uniqueValues = useMemo(() => ({
    category: [...new Set(allTransactions.filter(item => item.Category?.trim()).map(item => item.Category))],
    entity: [...new Set(allTransactions.filter(item => item.Entity?.trim()).map(item => item.Entity))]
  }), [allTransactions]);

  const handleRowClick = (rowData) => {
    const relatedTransactions = allTransactions.filter(transaction => 
      transaction.Entity === rowData.Entity && 
      transaction['Value Date'] > rowData.Date
    ).map(item => ({
      Date: item['Value Date'],
      Description: item.Description,
      Credit: item.Credit || 0,
      Debit: item.Debit || 0,
      Balance: item.Balance,
      Category: item.Category,
      Entity: item.Entity
    }));

    setDetailTables([{ title: `Transactions for ${rowData.Entity}`, data: relatedTransactions }]);
  };

  const TableData = ({ data, title = "" }) => (
    <Card className="mt-4">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <DataTable 
          data={data}
          onRowClick={handleRowClick} // Adding click handler to the table rows
        />
      </CardContent>
    </Card>
  );

  const renderForwardTransactions = () => {
    if (detailTables.length === 0) return null;

    return (
      <div className="mt-4">
        <h3>Forward Transactions:</h3>
        <ul>
          {detailTables.map((tableData, index) => (
            <li key={index}>
              <h4>{tableData.title}</h4>
              <DataTable data={tableData.data} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className='m-8'>
        <CardHeader>
          <CardTitle>Fund Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <Select
              value={filters.category}
              onValueChange={value => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.category.map(category => (
                  <SelectItem key={category} value={category || "undefined"}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.entity}
              onValueChange={value => handleFilterChange('entity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.entity.map(entity => (
                  <SelectItem key={entity} value={entity || "undefined"}>{entity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
          </div>

          <TableData 
            data={filteredTransactions}
            title="All Transactions"
          />

          {renderForwardTransactions()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundTracking;
