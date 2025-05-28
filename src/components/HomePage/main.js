
import { useState } from 'react';
import Home from './home';
import { useSelector, useDispatch  } from 'react-redux';
import BrieData from '../BriefData/main';
import { toggleSpecificPage, setSpecificPage } from "../Redux/CounterSlice"

const Main = () => {
  const dispatch = useDispatch();
  const specificPage = useSelector(state => state.location.specificPage);


  const handlePageChange = (page) => {
    dispatch(toggleSpecificPage(page));
  
  }


  return (
    <>
      {specificPage==="specificPage" ? <Home  handlePageChange={handlePageChange} /> : <BrieData handlePageChange={handlePageChange}/>}    </>
  );
};

export default Main;