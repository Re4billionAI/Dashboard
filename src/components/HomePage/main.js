
import { useState } from 'react';
import Home from './home';

const Main = () => {
  const [ specificPage, setSpecificPage] = useState(true);




  return (
    <>
      {specificPage ? <Home /> : <div>Loading...</div>}
    </>
  );
};

export default Main;