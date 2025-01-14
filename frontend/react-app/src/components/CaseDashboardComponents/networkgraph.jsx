import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const NetworkGraphComponent = ({ transactions = [] }) => {
  const [nodeSize, setNodeSize] = useState(80);
  const [minTransactions, setMinTransactions] = useState(15);
  const [minAmount, setMinAmount] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate responsive node size based on screen width
  const responsiveNodeSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return nodeSize * 0.6;
      if (width < 1024) return nodeSize * 0.8;
      return nodeSize;
    }
    return nodeSize;
  }, [nodeSize]);

  // Process transactions to create nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const entityMap = new Map();
    const edgeMap = new Map();

    // Process each transaction
    transactions.forEach((tx) => {
      // Skip opening balance entries
      if (tx.Category === 'Opening Balance') return;

      // Extract the main entity from the Description
      const descriptionParts = tx.Description.toLowerCase().split('-');
      const mainEntity = descriptionParts[0] === 'upi' ? descriptionParts[1] : descriptionParts[0];
      
      // Use 'SELF' as the source for all transactions
      const source = 'SELF';
      const target = mainEntity;

      // Update entity statistics
      const sourceStats = entityMap.get(source) || {
        transactions: 0,
        totalCredit: 0,
        totalDebit: 0,
        totalAmount: 0
      };
      const targetStats = entityMap.get(target) || {
        transactions: 0,
        totalCredit: 0,
        totalDebit: 0,
        totalAmount: 0
      };

      if (tx.Credit) {
        sourceStats.totalCredit += tx.Credit;
        targetStats.totalCredit += tx.Credit;
      }
      if (tx.Debit) {
        sourceStats.totalDebit += tx.Debit;
        targetStats.totalDebit += tx.Debit;
      }

      sourceStats.transactions += 1;
      targetStats.transactions += 1;
      sourceStats.totalAmount += tx.Debit || tx.Credit || 0;
      targetStats.totalAmount += tx.Debit || tx.Credit || 0;

      entityMap.set(source, sourceStats);
      entityMap.set(target, targetStats);

      // Update edge statistics
      const edgeId = `${source}-${target}`;
      const edgeStats = edgeMap.get(edgeId) || {
        creditAmount: 0,
        debitAmount: 0,
        transactions: 0
      };

      if (tx.Credit) {
        edgeStats.creditAmount += tx.Credit;
      }
      if (tx.Debit) {
        edgeStats.debitAmount += tx.Debit;
      }
      edgeStats.transactions += 1;
      edgeMap.set(edgeId, edgeStats);
    });

    // Create nodes
    const nodes = Array.from(entityMap.entries()).map(([id, stats], index) => ({
      id,
      data: {
        label: id,
        ...stats,
        displayName: id.length > 15 ? `${id.substring(0, 12)}...` : id
      },
      position: { x: Math.random() * 900, y: Math.random() * 600 },
      style: {
        width: responsiveNodeSize,
        height: responsiveNodeSize,
        borderRadius: '50%',
        backgroundColor: id === 'SELF' ? '#ffd700' : '#60a5fa',
        border: '2px solid #1a365d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: `${Math.max(10, responsiveNodeSize * 0.15)}px`,
        fontWeight: 'bold',
        color: '#1a365d',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      },
    }));

    // Create edges
    const edges = [];
    edgeMap.forEach((stats, id) => {
      const [source, target] = id.split('-');
      
      if (stats.creditAmount > 0) {
        edges.push({
          id: `${id}-credit`,
          source,
          target,
          label: (
            <div className="bg-white p-1 rounded shadow-sm text-xs md:text-sm">
              <div className="text-green-600">₹{stats.creditAmount.toLocaleString()}</div>
            </div>
          ),
          type: 'default',
          animated: true,
          style: { 
            stroke: '#22c55e',
            strokeWidth: Math.log(stats.transactions + 1) * 1.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#22c55e'
          }
        });
      }

      if (stats.debitAmount > 0) {
        edges.push({
          id: `${id}-debit`,
          source,
          target,
          label: (
            <div className="bg-white p-1 rounded shadow-sm text-xs md:text-sm">
              <div className="text-red-600">₹{stats.debitAmount.toLocaleString()}</div>
            </div>
          ),
          type: 'default',
          animated: true,
          style: { 
            stroke: '#ef4444',
            strokeWidth: Math.log(stats.transactions + 1) * 1.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#ef4444'
          }
        });
      }
    });

    return { nodes, edges };
  }, [nodeSize, transactions, responsiveNodeSize]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update node sizes dynamically
  const updateNodeSizes = useCallback((newSize) => {
    setNodeSize(newSize);
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          width: newSize,
          height: newSize,
          fontSize: `${Math.max(10, newSize * 0.15)}px`,
          transition: 'all 0.3s ease'
        },
      }))
    );
  }, [setNodes]);

  // Filter nodes and edges
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => 
      node.data.transactions >= minTransactions && 
      node.data.totalAmount >= minAmount
    );
  }, [nodes, minTransactions, minAmount]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    return edges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
  }, [edges, filteredNodes]);

  // Handle node click
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setIsDialogOpen(true);
  }, []);

  // Transaction Table Component
  const TransactionTable = ({ transactions, nodeId }) => {
    const relevantTransactions = transactions.filter(tx => {
      const descriptionParts = tx.Description.toLowerCase().split('-');
      const mainEntity = descriptionParts[0] === 'upi' ? descriptionParts[1] : descriptionParts[0];
      return nodeId === 'SELF' || mainEntity === nodeId;
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {relevantTransactions.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{tx['Value Date']}</td>
                <td className="p-2">{tx.Description}</td>
                <td className="p-2">
                  <Badge variant={tx.Credit ? 'success' : 'destructive'}>
                    {tx.Credit ? 'CREDIT' : 'DEBIT'}
                  </Badge>
                </td>
                <td className="p-2">₹{(tx.Credit || tx.Debit).toLocaleString()}</td>
                <td className="p-2">₹{tx.Balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4 w-full">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Node Size</label>
            <Slider
              value={[nodeSize]}
              onValueChange={([value]) => updateNodeSizes(value)}
              min={50}
              max={150}
              step={10}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{nodeSize}</span>
          </div>
          <div>
            <label className="text-sm font-medium">Min Transactions</label>
            <Slider
              value={[minTransactions]}
              onValueChange={([value]) => setMinTransactions(value)}
              min={0}
              max={50}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{minTransactions}</span>
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
      </Card>

      <div className="flex max-w-full lg:h-[65vh] border rounded-lg bg-white">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Controls className="bg-white" />
          <Background color="#e5e7eb" gap={16} />
        </ReactFlow>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedNode && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>Transactions for {selectedNode.id}</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Total Credit: ₹{selectedNode.data.totalCredit.toLocaleString()}
                  </Badge>
                  <Badge variant="outline">
                    Total Debit: ₹{selectedNode.data.totalDebit.toLocaleString()}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <TransactionTable 
              transactions={transactions} 
              nodeId={selectedNode.id} 
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default NetworkGraphComponent;