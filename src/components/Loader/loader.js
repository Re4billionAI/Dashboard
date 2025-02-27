// Spinner.js
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className="flex justify-center items-end  pt-36  ">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );
};

export default Spinner;
