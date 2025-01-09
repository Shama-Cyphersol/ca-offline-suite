import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

const NameManager = ({ caseId, initialGroups = [], onRefreshDashboard }) => {
  const [searchText, setSearchText] = useState("");
  const [unselectedGroups, setUnselectedGroups] = useState(initialGroups);
  const [mergedGroups, setMergedGroups] = useState([]);
  const [selectedNames, setSelectedNames] = useState({});

  const filteredGroups = searchText
    ? unselectedGroups.filter(group =>
        group.some(name =>
          name.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : unselectedGroups;

  const handleCheckboxChange = (groupIndex, name) => {
    setSelectedNames(prev => ({
      ...prev,
      [`${groupIndex}-${name}`]: !prev[`${groupIndex}-${name}`]
    }));
  };

  const handleMergeSelected = () => {
    const selectedGroupsToMerge = unselectedGroups
      .map((group, groupIndex) =>
        group.filter(name => selectedNames[`${groupIndex}-${name}`])
      )
      .filter(group => group.length > 0);

    if (selectedGroupsToMerge.length === 0) return;

    setMergedGroups(prev => [...prev, ...selectedGroupsToMerge]);
    setUnselectedGroups(prev => 
      prev.filter((group) => 
        !selectedGroupsToMerge.some(selectedGroup => 
          selectedGroup.every(name => group.includes(name))
        )
      )
    );
    setSelectedNames({});
  };

  const handleDemerge = (index) => {
    setUnselectedGroups(prev => [...prev, mergedGroups[index]]);
    setMergedGroups(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectAll = () => {
    const newSelectedNames = {};
    unselectedGroups.forEach((group, groupIndex) => {
      group.forEach(name => {
        newSelectedNames[`${groupIndex}-${name}`] = true;
      });
    });
    setSelectedNames(newSelectedNames);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Name Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Case ID: {caseId}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {unselectedGroups.length} Groups
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="similar-names" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="similar-names">Similar Names</TabsTrigger>
              <TabsTrigger value="merged-history">Merged History</TabsTrigger>
            </TabsList>

            <TabsContent value="similar-names">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search names..."
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                  >
                    Select All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.map((group, groupIndex) => (
                    <Card key={groupIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader className="py-3 px-4 bg-secondary/10">
                        <CardTitle className="text-sm font-medium">
                          Group {groupIndex + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {group.map((name) => (
                            <label
                              key={name}
                              className="flex items-center space-x-2 hover:bg-secondary/10 p-1 rounded cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedNames[`${groupIndex}-${name}`] || false}
                                onCheckedChange={() => handleCheckboxChange(groupIndex, name)}
                              />
                              <span className="text-sm">{name}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handleMergeSelected}
                    className="w-full max-w-xs"
                  >
                    Merge Selected Names
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="merged-history">
              <div className="space-y-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Merged Names</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mergedGroups.map((group, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {group.map(name => (
                                <Badge key={name} variant="secondary">{name}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDemerge(index)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              Demerge
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <div className="flex justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full max-w-xs">
                        Finalize Groups
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Finalization</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will finalize all merged groups and cannot be undone. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onRefreshDashboard?.("SimilarNameGroups")}
                        >
                          Finalize
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NameManager;