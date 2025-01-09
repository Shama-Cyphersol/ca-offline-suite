import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const BLUE_COLOR = "#3498db";
const TEXT_COLOR = "#1e293b";

const NameManager = ({ caseId, initialGroups = [], onRefreshDashboard }) => {
        const [activeTab, setActiveTab] = useState("similar-names");
        const [searchText, setSearchText] = useState("");
        const [unselectedGroups, setUnselectedGroups] = useState(initialGroups);
        const [mergedGroups, setMergedGroups] = useState([]);
        const [selectedNames, setSelectedNames] = useState({});
      
        const handleSearch = (e) => {
          setSearchText(e.target.value);
        };
      
        const filteredGroups = searchText
          ? unselectedGroups.filter(group =>
              group.some(name =>
                name.toLowerCase().startsWith(searchText.toLowerCase())
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
          const selectedGroupsToMerge = unselectedGroups.map((group, groupIndex) =>
            group.filter(name => selectedNames[`${groupIndex}-${name}`])
          ).filter(group => group.length > 0);
      
          if (selectedGroupsToMerge.length === 0) {
            return;
          }
      
          const newMergedGroups = [...mergedGroups];
          const newUnselectedGroups = [...unselectedGroups];
      
          selectedGroupsToMerge.forEach(selectedGroup => {
            newMergedGroups.push(selectedGroup);
            const groupIndex = newUnselectedGroups.findIndex(group =>
              selectedGroup.every(name => group.includes(name))
            );
            if (groupIndex !== -1) {
              newUnselectedGroups.splice(groupIndex, 1);
            }
          });
      
          setMergedGroups(newMergedGroups);
          setUnselectedGroups(newUnselectedGroups);
          setSelectedNames({});
        };
      
        const handleDemerge = (index) => {
          const groupToDemerge = mergedGroups[index];
          setUnselectedGroups([...unselectedGroups, groupToDemerge]);
          setMergedGroups(mergedGroups.filter((_, i) => i !== index));
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
          <div className="w-full max-w-7xl mx-auto p-6 min-h-screen">
            <Card>
              <CardHeader>
                <CardTitle>Similar Names Merger for Case Id - {caseId}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="similar-names" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="similar-names">Similar Names</TabsTrigger>
                    <TabsTrigger value="merged-history">Merged History</TabsTrigger>
                  </TabsList>
      
                  <TabsContent value="similar-names">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold">Select names to merge</h2>
                        <span className="text-sm text-muted-foreground">
                          Total groups: {unselectedGroups.length}
                        </span>
                        <Input
                          placeholder="Search names..."
                          value={searchText}
                          onChange={handleSearch}
                          className="max-w-xs"
                        />
                        <Button 
                          onClick={handleSelectAll}
                          variant="outline"
                          className="ml-auto"
                        >
                          Select All
                        </Button>
                      </div>
      
                      <div className="grid grid-cols-2 gap-4">
                        {filteredGroups.map((group, groupIndex) => (
                          <Card key={groupIndex}>
                            <CardHeader>
                              <CardTitle className="text-sm">Similar Names Group {groupIndex + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {group.map((name) => (
                                  <div key={name} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${groupIndex}-${name}`}
                                      checked={selectedNames[`${groupIndex}-${name}`] || false}
                                      onCheckedChange={() => handleCheckboxChange(groupIndex, name)}
                                    />
                                    <label 
                                      htmlFor={`${groupIndex}-${name}`}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
      
                      <div className="flex justify-center mt-4">
                        <Button onClick={handleMergeSelected}>
                          Merge Selected Names
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
      
                  <TabsContent value="merged-history">
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-24">Sr. No.</TableHead>
                            <TableHead>Original Names</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mergedGroups.map((group, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{group.join(', ')}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
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
      
                      <div className="flex justify-center mt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button>
                              Finalize these Groups
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will finalize all merged groups. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => {
                                  onRefreshDashboard?.("SimilarNameGroups");
                                }}
                              >
                                Continue
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