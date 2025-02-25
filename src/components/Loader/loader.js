// Spinner.js
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center  h-screen position-absolute ">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );
};

export default Spinner;
