import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const DataTable = ({ data = [] }) => {
  const [tableData, setTableData] = useState(data);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const categoryOptions = [
    "Bank Charges",
    "Bank Interest Received",
    "Bonus Paid",
    "Bonus Received",
    "Bounce",
    "Cash Deposits",
    "Cash Reversal",
    "Cash Withdrawal",
    "Closing Balance",
    "Credit Card Payment",
    "Debtor List",
    "Departmental Stores",
    "Donation",
    "Food Expense/Hotel",
    "General Insurance",
    "Gold Loan",
    "GST Paid",
    "Income Tax Paid",
    "Income Tax Refund",
    "Indirect tax",
    "Interest Debit",
    "Interest Received",
    "Investment",
    "Life insurance",
    "Loan",
    "Loan given",
    "Local Cheque Collection",
    "Online Shopping",
    "Opening Balance",
    "Other Expenses",
    "POS-Cr",
    "POS-Dr",
    "Probable Claim Settlement",
    "Property Tax",
    "Provident Fund",
    "Redemption, Dividend & Interest",
    "Refund/Reversal",
    "Rent Paid",
    "Rent Received",
    "Salary Paid",
    "Salary Received",
    "Subscription / Entertainment",
    "TDS Deducted",
    "Total Income Tax Paid",
    "Travelling Expense",
    "UPI-Cr",
    "UPI-Dr",
    "Utility Bills"
  ];

  const handleCategoryChange = (rowId, newCategory) => {
    // Update the local table data
    setTableData(prevData => 
      prevData.map(row => 
        row.id === rowId ? { ...row, category: newCategory } : row
      )
    );

    // Track the change in pendingChanges
    setPendingChanges(prev => ({
      ...prev,
      [rowId]: {
        id: rowId,
        oldCategory: data.find(row => row.id === rowId)?.category,
        newCategory
      }
    }));
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Convert pendingChanges object to array
      const changes = Object.values(pendingChanges);
      
      // Here you would make your API call
      // For demonstration, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear pending changes after successful save
      setPendingChanges({});
      
      toast({
        title: "Changes saved successfully",
        description: `Updated ${changes.length} transaction${changes.length === 1 ? '' : 's'}`,
      });
      
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get columns from first data item
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View and edit your transaction categories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>
                    {column.charAt(0).toUpperCase() + column.slice(1).toLowerCase()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="max-w-[200px] group relative">
                      {column === 'category' ? (
                        <Select
                          value={row[column]}
                          onValueChange={(value) => handleCategoryChange(row.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>{row[column]}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="truncate">{row[column]}</div>
                      )}{column.toLowerCase() === "description" && (
                        <div className="absolute left-0 top-10 hidden group-hover:block bg-black text-white text-sm rounded p-2 z-50 whitespace-normal min-w-[200px] max-w-[400px]">
                          {row[column]}
                        </div>
                      )}
                      
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {Object.keys(pendingChanges).length > 0 && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setPendingChanges({})}
            disabled={isSaving}
          >
            Cancel Changes
          </Button>
          <Button
            onClick={saveChanges}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              `Save Changes (${Object.keys(pendingChanges).length})`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;