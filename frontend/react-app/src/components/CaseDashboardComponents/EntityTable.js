import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Input } from "../ui/input"
import { useState } from 'react'
import { cn } from "../../lib/utils"
import { Search, X} from 'lucide-react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination"
import DataTable from '../IndividualDashboardComponents/TableData'
import { Button, buttonVariants } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const EntityTable = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedEntity, setSelectedEntity] = useState(null)
    const itemsPerPage = 10

    const entityData = [
        { entity: "John Smith", frequency: 10 },
        { entity: "Emma Johnson", frequency: 30 },
        { entity: "Michael Brown", frequency: 5 },
        { entity: "Sarah Davis", frequency: 20 },
        { entity: "David Wilson", frequency: 100 },
        { entity: "Lisa Anderson", frequency: 110 },
        { entity: "James Taylor", frequency: 120 },
        { entity: "Jennifer Martin", frequency: 130 },
        { entity: "Robert Thompson", frequency: 140 },
        { entity: "Maria Garcia", frequency: 150 },
        { entity: "William Lee", frequency: 160 },
        { entity: "Jessica White", frequency: 170 },
        { entity: "Christopher King", frequency: 180 },
        { entity: "Elizabeth Moore", frequency: 190 },
        { entity: "Daniel Martinez", frequency: 200 },
        { entity: "Michelle Clark", frequency: 210 },
        { entity: "Thomas Rodriguez", frequency: 220 },
    ]

    const entityTransactions = {
        "David Wilson": [
            { date: "2021-01-01", description: "upi-abc123432@okaxis", debit: 0, credit: 2000, category: "Upi-cr" },
            { date: "2021-04-01", description: "upi-abc123432@okaxis", debit: 2000, credit: 0, category: "Upi-dr" },
            { date: "2021-03-01", description: "upi-abc123432@okaxis", debit: 0, credit: 200, category: "Upi-cr" },
            { date: "2021-02-01", description: "upi-abc123432@okaxis", debit: 0, credit: 1500, category: "Upi-cr" },
        ]
    }

    const filteredEntities = entityData.filter(entities =>
        entities.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entities.entity.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredEntities.length / itemsPerPage)
    const currentReports = filteredEntities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            pageNumbers.push(1)      
            if (currentPage > 2) {
                pageNumbers.push('ellipsis')
            }
            if (currentPage !== 1 && currentPage !== totalPages) {
                pageNumbers.push(currentPage)
            }
            if (currentPage < totalPages - 1) {
                pageNumbers.push('ellipsis')
            }
            pageNumbers.push(totalPages)
        }
        
        return pageNumbers
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleEntityClick = (entity) => {
        setSelectedEntity(entity)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Entity Distribution Table</CardTitle>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search reports..."
                                className="pl-10 w-[400px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table className="pt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Entity</TableHead>
                                <TableHead className="text-center">Frequency</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.map((entities) => (
                                <TableRow key={entities.entity}>
                                    <TableCell 
                                        className="text-center hover:font-semibold cursor-pointer"
                                        onClick={() => handleEntityClick(entities.entity)}
                                    >
                                        {entities.entity}
                                    </TableCell>
                                    <TableCell className="text-center">{entities.frequency}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {totalPages > 1 && (
                        <div className="mt-6">
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
                                            {pageNumber === 'ellipsis' ? (
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
                                                currentPage === totalPages && "pointer-events-none opacity-50"
                                            )}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

                {/* Replace the Card code with this Dialog implementation */}
            <Dialog open={!!selectedEntity} onOpenChange={(isOpen) => !isOpen && setSelectedEntity(null)}>
            {selectedEntity && entityTransactions[selectedEntity] && (
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>Transactions for {selectedEntity}</span>
                    </DialogTitle>
                </DialogHeader>
                <DataTable data={entityTransactions[selectedEntity]} />
                </DialogContent>
            )}
            </Dialog>
        </div>
    )
}

export default EntityTable