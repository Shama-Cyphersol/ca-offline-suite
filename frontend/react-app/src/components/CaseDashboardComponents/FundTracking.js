import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import DataTable from '../IndividualDashboardComponents/TableData';

const FundTracking = () => {
  const [linkedTables, setLinkedTables] = useState([]);
  const [clickedRows, setClickedRows] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    date: '',
  });

  const allTransactions = [
    {
      id: "1",
      name: "John Smith",
      date: "2024-01-05",
      description: "Initial Investment",
      credit: "100000.00",
      debit: "",
      balance: "100000.00",
      category: "Investment",
      entity: "HDFC Bank"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      date: "2024-01-06",
      description: "Business Revenue",
      credit: "150000.00",
      debit: "",
      balance: "150000.00",
      category: "Revenue",
      entity: "ICICI Bank"
    }
  ];

  const linkedTransactionsData = {
    "HDFC Bank-1": [
      {
        id: "3",
        name: "John Smith",
        date: "2024-01-06",
        description: "Stock Purchase",
        credit: "",
        debit: "30000.00",
        balance: "70000.00",
        category: "Stocks",
        entity: "Zerodha"
      },
      {
        id: "4",
        name: "John Smith",
        date: "2024-01-07",
        description: "Mutual Fund",
        credit: "",
        debit: "40000.00",
        balance: "30000.00",
        category: "Mutual Funds",
        entity: "ICICI Direct"
      }
    ],
    "ICICI Bank-2": [
      {
        id: "5",
        name: "Sarah Johnson",
        date: "2024-01-07",
        description: "Property Investment",
        credit: "",
        debit: "100000.00",
        balance: "50000.00",
        category: "Real Estate",
        entity: "PropFirm"
      }
    ]
  };

  const uniqueCategories = useMemo(() => 
    [...new Set(allTransactions.map(item => item.category))], 
    []
  );

  const filteredData = useMemo(() => {
    return allTransactions.filter(item => {
      const matchesName = !filters.name || item.name === filters.name;
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesDate = !filters.date || item.date === filters.date;
      return matchesName && matchesCategory && matchesDate;
    });
  }, [filters]);

  const handleRowClick = (row) => {
    const tableKey = `${row.entity}-${row.id}`;
    const linkedTransactions = linkedTransactionsData[tableKey];

    if (!clickedRows.includes(row.id) && linkedTransactions) {
      setClickedRows(prev => [...prev, row.id]);
      setLinkedTables(prev => [
        ...prev,
        {
          id: row.id,
          data: linkedTransactions,
          title: `Fund Utilization - ${row.entity} (${row.name})`
        }
      ]);
    }
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      category: '',
      date: '',
    });
    setLinkedTables([]);
    setClickedRows([]);
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
          onRowClick={handleRowClick}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fund Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="date"
              value={filters.date}
              onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
            />
            <Select
              value={filters.category}
              onValueChange={value => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
          </div>

          <TableData 
            data={filteredData}
            title="All Transactions"
          />

          {linkedTables.map(table => (
            <TableData
              key={table.id}
              data={table.data}
              title={table.title}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundTracking;
