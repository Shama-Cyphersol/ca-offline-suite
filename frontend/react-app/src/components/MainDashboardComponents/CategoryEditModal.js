import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CategoryEditTable from "../MainDashboardComponents/CategoryEditTable"


const CategoryEditModal = ({ open, onOpenChange }) => {
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
      <DialogContent className="max-w-6xl h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Transactions</DialogTitle>
        </DialogHeader>
          <div className="overflow-auto flex-1">
            <CategoryEditTable data={transactionData} categoryOptions={categoryOptions}/>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;