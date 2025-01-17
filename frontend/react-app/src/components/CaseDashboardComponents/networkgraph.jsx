import React, { useState, useMemo, useEffect,useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import networkGrpahData from "../../data/network_graph_dummy.json";

import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';

const NetworkGraph = ({ data = networkGrpahData }) => {
  // Calculate max transactions and default min transactions
  const { maxTransactions, defaultMinTransactions } = useMemo(() => {
    const entityCounts = {};
    data.forEach(transaction => {
      const entity = transaction.Entity;
      entityCounts[entity] = (entityCounts[entity] || 0) + 1;
    });
    const max = Math.max(...Object.values(entityCounts));
    return {
      maxTransactions: max,
      defaultMinTransactions: Math.ceil((2/3) * max)
    };
  }, [data]);

  // Initialize state with computed default values
  const [nodeSize, setNodeSize] = useState(50);
  const [minTransactions, setMinTransactions] = useState(defaultMinTransactions);
  const [minAmount, setMinAmount] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const colorPalette = {
    Person: '#F1C40F',
    Entity: '#3498DB',
    CommonEntity: '#2ECC71'
  };

  // Process data to create network graph
  const processGraphData = useCallback(() => {
    const nodes = [];
    const edges = new Map();
    const entityStats = new Map();
    const entityConnections = new Map();

    // Process transactions to build entity statistics and connections
    data.forEach(transaction => {
      const source = transaction.Name;
      const target = transaction.Entity;
      const amount = transaction.Debit || transaction.Credit || 0;
      
      // Skip if amount is below minimum
      if (amount < minAmount) return;
      
      if (!entityConnections.has(target)) {
        entityConnections.set(target, new Set());
      }
      entityConnections.get(target).add(source);
      
      const sourceStats = entityStats.get(source) || {
        totalDebit: 0,
        totalCredit: 0,
        transactions: 0,
        type: 'Person'
      };

      if (sourceStats.type === 'Entity') {
        sourceStats.type = 'Person';
      }
      const targetStats = entityStats.get(target) || {
        totalDebit: 0,
        totalCredit: 0,
        transactions: 0,
        type: 'Entity'
      };

      if (transaction.Debit) {
        sourceStats.totalDebit += transaction.Debit;
        targetStats.totalDebit += transaction.Debit;
      }
      if (transaction.Credit) {
        sourceStats.totalCredit += transaction.Credit;
        targetStats.totalCredit += transaction.Credit;
      }

      sourceStats.transactions += 1;
      targetStats.transactions += 1;

      entityStats.set(source, sourceStats);
      entityStats.set(target, targetStats);

      const edgeKey = `${source}-${target}`;
      const edgeStats = edges.get(edgeKey) || {
        debit: 0,
        credit: 0,
        transactions: 0
      };

      if (transaction.Debit) {
        edgeStats.debit += transaction.Debit;
      }
      if (transaction.Credit) {
        edgeStats.credit += transaction.Credit;
      }
      edgeStats.transactions += 1;
      edges.set(edgeKey, edgeStats);
    });

    // Create nodes array with proper filtering
    const processedNodes = [];
    entityStats.forEach((stats, id) => {
      if (stats.transactions >= minTransactions) {
        const isCommonEntity = entityConnections.get(id)?.size >= 2;
        const nodeColor = stats.type === 'Person' 
          ? colorPalette.Person 
          : (isCommonEntity ? colorPalette.CommonEntity : colorPalette.Entity);

        processedNodes.push({
          id,
          data: { 
            label: id,
            ...stats
          },
          position: { 
            x: Math.random() * 800, 
            y: Math.random() * 600 
          },
          style: {
            width: `${nodeSize}px`,
            height: `${nodeSize}px`,
            backgroundColor: nodeColor,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid #2C3E50',
            color: '#2C3E50',
            fontSize: `${Math.max(12, nodeSize * 0.25)}px`,
            fontWeight: 'bold'
          }
        });
      }
    });

    // Create edges array
    const processedEdges = [];
    edges.forEach((stats, key) => {
      const [source, target] = key.split('-');
      
      // Only create edges if both nodes exist after filtering
      if (processedNodes.some(n => n.id === source) && processedNodes.some(n => n.id === target)) {
        if (stats.debit > 0) {
          processedEdges.push({
            id: `${key}-debit`,
            source,
            target,
            type: 'default',
            animated: true,
            style: { stroke: '#E74C3C', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#E74C3C'
            },
            label: `₹${stats.debit.toLocaleString()}`,
            labelStyle: { fill: '#E74C3C', fontSize: 12 },
            sourceHandle: 'right',
            targetHandle: 'left',
            data: { curvature: 0.5 }
          });
        }
        
        if (stats.credit > 0) {
          processedEdges.push({
            id: `${key}-credit`,
            source,
            target,
            type: 'default',
            animated: true,
            style: { stroke: '#2ECC71', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#2ECC71'
            },
            label: `₹${stats.credit.toLocaleString()}`,
            labelStyle: { fill: '#2ECC71', fontSize: 12 },
            sourceHandle: 'right',
            targetHandle: 'left',
            data: { curvature: 0.5 }
          });
        }
      }
    });

    return { nodes: processedNodes, edges: processedEdges };
  }, [data, minTransactions, nodeSize, minAmount, colorPalette]);

  // Initialize nodes and edges states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update graph when filters change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = processGraphData();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [minTransactions, nodeSize, minAmount, ]);

  // Node click handler
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
    setIsDialogOpen(true);
  };

  // Filter transactions for selected node
  const nodeTransactions = useMemo(() => {
    if (!selectedNode) return [];
    return data.filter(tx => 
      tx.Name === selectedNode.id || tx.Entity === selectedNode.id
    );
  }, [selectedNode, data]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Node Size</label>
              <Slider
                value={[nodeSize]}
                onValueChange={([value]) => setNodeSize(value)}
                min={20}
                max={200}
                step={10}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Transactions ({minTransactions})</label>
              <Slider
                value={[minTransactions]}
                onValueChange={([value]) => setMinTransactions(value)}
                min={1}
                max={maxTransactions}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Amount</label>
              <Input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                placeholder="Enter minimum amount"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-[600px] border rounded-lg bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Transactions for {selectedNode?.id}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {nodeTransactions.map((tx, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{new Date(tx['Value Date']).toLocaleDateString()}</td>
                    <td className="p-2">{tx.Description}</td>
                    <td className="p-2">
                      <Badge variant={tx.Credit ? "success" : "destructive"}>
                        {tx.Credit ? "CREDIT" : "DEBIT"}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      ₹{(tx.Credit || tx.Debit).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkGraph;