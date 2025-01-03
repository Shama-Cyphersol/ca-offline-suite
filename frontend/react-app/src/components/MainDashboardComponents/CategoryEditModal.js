import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
import CategoryEditTable from "../MainDashboardComponents/CategoryEditTable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const CategoryEditModal = ({ open, onOpenChange }) => {
  // Sample data - replace with your actual data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2024-01-01",
      transaction: "Purchase",
      debit: 500,
      credit: 0,
      balance: 1500,
      category: "Shopping",
      entity: "Bank Charges"
    },
    {
      id: 2,
      date: "2024-01-02",
      transaction: "Salary",
      debit: 0,
      credit: 3000,
      balance: 4500,
      category: "Income",
      entity: "Debtor List"
    },
  ]);

  // Sample entity options
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

  // const handleEntityChange = (transactionId, newEntity) => {
  //   setTransactions(prevTransactions =>
  //     prevTransactions.map(transaction =>
  //       transaction.id === transactionId
  //         ? { ...transaction, entity: newEntity }
  //         : transaction
  //     )
  //   );
  // };

  const transactionData = [
    {
      date: "2024-01-01",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-01",
      description:
        "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-05",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-03",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    }, {
      date: "2024-01-01",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-01",
      description:
        "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-05",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-03",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    }, {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    }, {
      date: "2024-01-01",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-01",
      description:
        "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-05",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-03",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    }, {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    }, {
      date: "2024-01-01",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-01",
      description:
        "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-05",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-03",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
  
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Transactions</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto p-0">
          {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.transaction}</TableCell>
                  <TableCell className="text-right">
                    {transaction.debit > 0 ? `$${transaction.debit}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.credit > 0 ? `$${transaction.credit}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">${transaction.balance}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={transaction.entity}
                      onValueChange={(value) => handleEntityChange(transaction.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{transaction.entity}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {entityOptions.map((entity) => (
                          <SelectItem key={entity} value={entity}>
                            {entity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
          <CategoryEditTable data={transactionData} categoryOptions={categoryOptions}/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;