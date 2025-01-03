import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BackendTester = () => {
  const [endpoint, setEndpoint] = useState('/api/hello');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const [backendPort, setBackendPort] = useState(7500);
  const [backendStatus, setBackendStatus] = useState('connecting');

  useEffect(() => {
    if (window.electron) {
      // Listen for backend status updates
      window.electron.onBackendStatus((status) => {
        if (status.status === 'success') {
          setBackendPort(status.port);
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      });

      // Get initial port
      window.electron.getBackendPort().then(port => {
        setBackendPort(port);
      });
    }
  }, []);

  const testEndpoint = async () => {
    setLoading(true);
    try {
      console.log(`Testing endpoint: http://localhost:${backendPort}${endpoint}`);
      const res = await fetch(`http://localhost:${backendPort}${endpoint}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setBackendStatus('connected');
    } catch (error) {
      console.error('Test failed:', error);
      setResponse(`Error: ${error.message}`);
      setBackendStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Backend Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="Enter endpoint"
            />
            <Button onClick={testEndpoint} disabled={loading}>
              {loading ? 'Testing...' : 'Test'}
            </Button>
          </div>
          {backendStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Backend Error!</strong>
              <span className="block sm:inline"> Failed to connect to backend server.</span>
            </div>
          )}
          {backendStatus === 'connecting' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
              Connecting to backend...
            </div>
          )}
          <pre className="bg-gray-100 p-4 rounded-md">
            {response || 'Response will appear here'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendTester;