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
  const [minTransactions, setMinTransactions] = useState(0);
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

    // Calculate entity statistics
    transactions.forEach((tx) => {
      // ... (previous transaction processing code remains the same)
      const fromStats = entityMap.get(tx.from) || { 
        transactions: 0, 
        totalCredit: 0,
        totalDebit: 0,
        totalAmount: 0 
      };
      if (tx.type === 'credit') {
        fromStats.totalCredit += tx.amount;
      } else {
        fromStats.totalDebit += tx.amount;
      }
      fromStats.transactions += 1;
      fromStats.totalAmount += tx.amount;
      entityMap.set(tx.from, fromStats);

      const toStats = entityMap.get(tx.to) || { 
        transactions: 0, 
        totalCredit: 0,
        totalDebit: 0,
        totalAmount: 0 
      };
      if (tx.type === 'credit') {
        toStats.totalCredit += tx.amount;
      } else {
        toStats.totalDebit += tx.amount;
      }
      toStats.transactions += 1;
      toStats.totalAmount += tx.amount;
      entityMap.set(tx.to, toStats);

      const edgeId = `${tx.from}-${tx.to}`;
      const edgeStats = edgeMap.get(edgeId) || { 
        creditAmount: 0, 
        debitAmount: 0,
        transactions: 0 
      };
      if (tx.type === 'credit') {
        edgeStats.creditAmount += tx.amount;
      } else {
        edgeStats.debitAmount += tx.amount;
      }
      edgeStats.transactions += 1;
      edgeMap.set(edgeId, edgeStats);
    });

    // Create nodes with dynamic sizing
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
        backgroundColor: stats.totalAmount > 100000 ? '#ffd700' : '#60a5fa',
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

    // Create edges (edge creation code remains the same)
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
          },
          sourceHandle: 'right',
          targetHandle: 'left',
          data: { type: 'credit' }
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
          },
          sourceHandle: 'left',
          targetHandle: 'right',
          data: { type: 'debit' }
        });
      }
    });

    return { nodes, edges };
  }, [nodeSize, transactions, responsiveNodeSize]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update node sizes dynamically when slider changes
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

  // Filter nodes and edges based on minimum transactions and amount
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

  // Transaction Table Component (remains the same)
  const TransactionTable = ({ transactions, nodeId }) => {
    const relevantTransactions = transactions.filter(
      tx => tx.from === nodeId || tx.to === nodeId
    );

    return (
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Network Graph</h1>
          <div className="flex gap-4 items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>Person</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span>Common Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 bg-green-600"></div>
              <span>Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 bg-red-600"></div>
              <span>Debit</span>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">From</th>
              <th className="p-2 text-left">To</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left hidden md:table-cell">Date</th>
              <th className="p-2 text-left hidden lg:table-cell">Reference</th>
            </tr>
          </thead>
          <tbody>
            {relevantTransactions.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Badge variant={tx.type === 'credit' ? 'success' : 'destructive'}>
                    {tx.type.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-2">{tx.from}</td>
                <td className="p-2">{tx.to}</td>
                <td className="p-2">₹{tx.amount.toLocaleString()}</td>
                <td className="p-2 hidden md:table-cell">{tx.date}</td>
                <td className="p-2 hidden lg:table-cell">{tx.reference}</td>
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
              max={1000}
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