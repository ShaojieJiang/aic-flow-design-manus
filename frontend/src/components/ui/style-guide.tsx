import React from 'react';

// Color palette from wireframes
export const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#9b59b6',
  background: '#f5f7fa',
  text: '#2c3e50',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  // Node type colors
  trigger: '#3498db',
  function: '#2ecc71',
  ai: '#9b59b6',
  action: '#e74c3c',
};

// Common styles
export const styles = {
  // Layout
  container: 'container mx-auto px-4 py-8',
  header: 'bg-white shadow-sm p-4 border-b',
  sidebar: 'w-64 h-full bg-white border-r border-gray-200',
  content: 'flex-1 h-full',
  
  // Typography
  heading: {
    h1: 'text-2xl font-bold text-gray-900',
    h2: 'text-lg font-semibold text-gray-900',
    h3: 'text-base font-medium text-gray-900',
  },
  
  // Buttons
  button: {
    primary: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
    secondary: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500',
    danger: 'px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500',
  },
  
  // Forms
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  select: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  textarea: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  
  // Cards
  card: 'bg-white shadow rounded-lg p-6',
  
  // Tables
  table: {
    container: 'bg-white shadow overflow-hidden sm:rounded-md',
    header: 'bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    row: 'px-4 py-4 sm:px-6',
  },
  
  // Node styles
  node: {
    container: 'p-2 border-l-4 bg-white rounded shadow-sm cursor-grab hover:shadow',
    trigger: 'border-blue-500',
    function: 'border-green-500',
    ai: 'border-purple-500',
    action: 'border-red-500',
  },
  
  // Status badges
  badge: {
    success: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    warning: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    error: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    inactive: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
  },
  
  // Alerts
  alert: {
    error: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded',
    success: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded',
  },
};

// React Flow specific styles
export const flowStyles = {
  node: {
    trigger: {
      background: colors.trigger,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
    },
    function: {
      background: colors.function,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
    },
    ai: {
      background: colors.ai,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
    },
    action: {
      background: colors.action,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  edge: {
    animated: true,
    style: { stroke: colors.primary },
  },
};

export default styles; 