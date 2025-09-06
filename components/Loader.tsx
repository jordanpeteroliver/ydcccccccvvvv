import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
};
