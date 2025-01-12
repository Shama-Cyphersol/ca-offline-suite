import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Search, AlertCircle, ChevronRight, Users } from "lucide-react";

// Sample data array - in practice this would be dynamic
const data = [
  {
    type: "Home Loan / Balance Transfer",
    amount: 905000,
    rate: "0.45%",
    value: 4072.5,
  },
  {
    type: "Loan Against Property / Balance Transfer",
    amount: 763000,
    rate: "0.65%",
    value: 4959.5,
  },
  { type: "Business Loan", amount: 205000, rate: "1.00 %", value: 2050 },
  { type: "Term Plan", amount: "-", rate: "1 % -30 %", value: 4072.5 },
  { type: "General Insurance", amount: "-", rate: "upto 10 %", value: 4072.5 },
];

// Generate sample users (can be replaced with actual data)
const users = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  data: data,
}));

const note = [
  {
    title: "To Proceed Further:",
    content: `***In case your client is interested in any of the above products, you can contact our trusted vendor M/s BizPedia Tech Private Limited on 8828824242 and email id support@leadsathi.in. Kindly use the promo code "CYPHERSOLEARN" to avail the higher commission structure.

    Once the referrals are successfully closed, you will be eligible for payouts based on the above commission structure.

    The respective payments will be released on the 25th of the next month.`,
  },
  {
    title: "Disclaimer:",
    content: [
      "The above loan eligibility calculations apply to self-employed clients only.",
      "For salaried clients, the vendor will need more details to calculate the eligibility.",
      "The above eligibility is based on the analysis of the current uploaded bank statement. Kindly upload all bank statements to obtain more accurate eligibility.",
      "Final Approval will be dependent on complete thorough process and submission of relevant documents, CIBIL check, etc.",
      "Nothing contained in this eligibility should be deemed to create any right and/or interest whatsoever in favor of or against any party.",
    ],
  },
];

const UserEligibilityTable = ({ userData }) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-[#f8fafc] dark:bg-slate-800">
        <TableHead className="w-[300px]">Product</TableHead>
        <TableHead className="text-center">Amount</TableHead>
        <TableHead className="text-center">Commission %</TableHead>
        <TableHead className="text-right">Commission (in ₹)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {userData.map((item, index) => (
        <TableRow key={index} className="hover:bg-[#f8fafc] dark:hover:bg-slate-800/50">
          <TableCell className="font-medium">{item.type}</TableCell>
          <TableCell className="text-center">{item.amount}</TableCell>
          <TableCell className="text-center">{item.rate}</TableCell>
          <TableCell className="text-right font-semibold">₹{item.value.toLocaleString()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function Eligibility() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Opportunity to Earn
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Discover the products you're eligible for and the associated benefits
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2563eb]" />
              <span className="text-sm font-medium text-slate-600">
                {users.length} Users
              </span>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Dialog key={user.id}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[#e2e8f0]">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center justify-between text-[#1e293b]">
                      {user.name}
                      <ChevronRight className="w-5 h-5 text-[#2563eb]" />
                    </CardTitle>
                    <CardDescription>Click to view details</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{user.name} - Eligibility Details</DialogTitle>
                </DialogHeader>
                <UserEligibilityTable userData={user.data} />
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Notes Section - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {note.map((section, index) => (
            <Card key={index} className="border-[#e2e8f0]">
              <CardHeader className="bg-[#f8fafc] dark:bg-slate-800 border-b border-[#e2e8f0]">
                <CardTitle className="text-lg text-[#1e293b]">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-[#2563eb] mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {section.content}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}