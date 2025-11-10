
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Settings from './pages/Settings';
import Layout from './pages/Layout';

function App() {
  return (
    <AppProvider>
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-expense" element={<AddExpense />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </HashRouter>
    </AppProvider>
  );
}

export default App;
