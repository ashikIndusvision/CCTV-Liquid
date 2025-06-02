import { useContext, useEffect, useState } from "react";

import PageTitle from "../Common/UI/PageTitle";
import CameraTab from "../Tab/CameraTab";
import axiosInstance from "../../API/Api";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import CameraFeedCard from "../Tab/CameraFeedCard";
import { useCameraContext } from "../../Context/SectionactiveContext";



const Dashboard = () => {

const { cameraActive} = useCameraContext()
  // if(data){
  //   return <div className="">NO data</div>
  // }
  return (
    <div className=" w-full">
      <div className="w-full bg-[#e6eafa] h-16 flex justify-start items-center px-4 gap-10">
        {
          cameraActive?.activeSections && (
            <span className="px-8 py-2 border-1 rounded-md font-bold">{cameraActive?.activeSections}</span>
          )
        }
        {/* <ArrowBigRight /> */}
        {/* <span className="px-8 py-2 border-1 rounded-md font-bold">
          Bottom Line
        </span> */}
      </div>
      <CameraFeedCard   />
    </div>
  );
};

export default Dashboard;
