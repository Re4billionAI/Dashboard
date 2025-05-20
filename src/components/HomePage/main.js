
import { useState } from 'react';
import Home from './home';
import BrieData from '../BriefData/main';

const Main = () => {
  const [ specificPage, setSpecificPage] = useState(true);

  const handlePageChange = () => {
    setSpecificPage(!specificPage);
  
  }


  return (
    <>
      {specificPage ? <Home /> : <BrieData handlePageChange={handlePageChange}/>}
    </>
  );
};

export default Main;