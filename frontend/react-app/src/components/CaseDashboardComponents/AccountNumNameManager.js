import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../ui/pagination"
  

  const AccountNumNameManager = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

  const [reports, setReports] = useState([
    {
      id: 1,
      fileName: "/path/to/documents/john_doe_statement.pdf",
      accNumber: "ACC123456",
      name: "John Doe",
    },
    {
      id: 2,
      fileName: "/path/to/documents/jane_smith_statement.pdf",
      accNumber: "ACC789012",
      name: "Jane Smith",
    },
    {
      id: 3,
      fileName: "/path/to/documents/bob_wilson_statement.pdf",
      accNumber: "ACC345678",
      name: "Bob Wilson",
    },
    {
      id: 4,
      fileName: "/path/to/documents/alice_johnson_statement.pdf",
      accNumber: "ACC901234",
      name: "Alice Johnson",
    },
    {
      id: 5,
      fileName: "/path/to/documents/charlie_brown_statement.pdf",
      accNumber: "ACC567890",
      name: "Charlie Brown",
    },
    {
      id: 6,
      fileName: "/path/to/documents/diana_clark_statement.pdf",
      accNumber: "ACC234567",
      name: "Diana Clark",
    },
    {
      id: 7,
      fileName: "/path/to/documents/evan_white_statement.pdf",
      accNumber: "ACC890123",
      name: "Evan White",
    },
    {
      id: 8,
      fileName: "/path/to/documents/fiona_green_statement.pdf",
      accNumber: "ACC456789",
      name: "Fiona Green",
    },
    {
      id: 9,
      fileName: "/path/to/documents/george_taylor_statement.pdf",
      accNumber: "ACC012345",
      name: "George Taylor",
    },
    {
      id: 10,
      fileName: "/path/to/documents/helen_adams_statement.pdf",
      accNumber: "ACC678901",
      name: "Helen Adams",
    },
    {
      id: 11,
      fileName: "/path/to/documents/ian_brown_statement.pdf",
      accNumber: "ACC234567",
      name: "Ian Brown",
    },
    {
      id: 12,
      fileName: "/path/to/documents/jack_smith_statement.pdf",
      accNumber: "ACC890123",
      name: "Jack Smith",
    },
  ]);

  const handleNameChange = (id, newName) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, name: newName } : report
      )
    );
  };

  const handleAccNumberChange = (id, newAccNumber) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, accNumber: newAccNumber } : report
      )
    );
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.accNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Get current page reports
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving changes:", reports);
  };

  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Account Number & Name Manager</CardTitle>
              <CardDescription>
                A list of recent reports from all projects
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-10 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>File Location</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <div
                      className="truncate max-w-full"
                      title={report.fileName}
                    >
                      {report.fileName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={report.name}
                      onChange={(e) =>
                        handleNameChange(report.id, e.target.value)
                      }
                      className="max-w-[200px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={report.accNumber}
                      onChange={(e) =>
                        handleAccNumberChange(report.id, e.target.value)
                      }
                      className="max-w-[200px]"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                      "cursor-pointer",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                      "cursor-pointer",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

                    <AlertDialog>
                        <div className="flex justify-center">
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="default" 
                                    className="mt-12"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </Button>
                            </AlertDialogTrigger>
                        </div>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to save these changes?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSaveChanges}>Save</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountNumNameManager;
