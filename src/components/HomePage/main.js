


import StatusCard from "./statusCard";
import EnergyConsumption from "./EnergyConsumptions";

import ParameterRepresentation from "./parameter";

const Home = () => {
   
  return (
  

     <div className="w-full h    flex flex-col md:px-6 gap-0 pb-[100px] md:pb-0">

  <StatusCard/>
  <EnergyConsumption/>
  <ParameterRepresentation/>
</div>
  
  )
};

export default Home;
