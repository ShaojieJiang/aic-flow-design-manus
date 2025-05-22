import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkflowList from './components/workflow/WorkflowList';
import WorkflowEditor from './components/workflow/WorkflowEditor';
import ExecutionDetail from './components/execution/ExecutionDetail';
import AIWorkflowSuggestion from './components/ai/AIWorkflowSuggestion';
import AINodeTester from './components/ai/AINodeTester';
import Dashboard from './components/dashboard/Dashboard';

// Auth guard component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workflows" element={<WorkflowList />} />
          <Route path="workflows/new" element={<WorkflowEditor isNew={true} />} />
          <Route path="workflows/:id" element={<WorkflowList />} />
          <Route path="workflows/:id/edit" element={<WorkflowEditor />} />
          <Route path="executions/:id" element={<ExecutionDetail />} />
          <Route path="ai/suggestions" element={<AIWorkflowSuggestion />} />
          <Route path="ai/tester" element={<AINodeTester />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
