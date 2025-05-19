import React from 'react';

export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-lg text-gray-700">Loading solar monitoring data...</p>
        </div>
      </div>
    );
  }