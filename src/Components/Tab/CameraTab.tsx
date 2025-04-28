import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import CameraFeedCard from "./CameraFeedCard";
import axiosInstance from "../../API/Api";
import {RedoOutlined } from '@ant-design/icons';

interface CameraProps{
  id: string | number;
  activeCamera : string | number;
  handleCamera : (cameraId : string | number) => void;
}
const CameraTab : React.FC<CameraProps>=({ id,activeCamera, handleCamera}) => {
  
  
  const { themeStyles } = useTheme();
  
  
  const [activeTab, setActiveTab] = useState<string | number>(0);
  const [data, setData] = useState<{ id: string | number; name: string }[]>([]);
  const [autoSwitch, setAutoSwitch] = useState<boolean>(false); // State to control auto-switching
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Store interval ID


 
  
  const handleClickTabChange =(item:any)=>{    
    // handleCamera(id)
    //   setActiveTab(item?.id)
      localStorage.setItem("activeSectionId" , JSON.stringify(id))
      localStorage.setItem("activeTab" , item?.id)
      window.location.reload()
    
    }

    const activeId = localStorage.getItem("activeTab")
    const activeSectionId = localStorage.getItem("activeSectionId")
    useEffect(()=>{

if(activeId && activeSectionId ){
  handleCamera(activeSectionId )
  setActiveTab(JSON.parse(activeId))   
}
},[])
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`sections/?serac_id=${id}`);
        // const response = await axiosInstance.get(`sections/?serac_id=${1}`);
        if (response?.data?.results?.length) {
          setData(response.data.results);
          console.table(response.data.results)

          // setActiveTab(response.data.results[0]?.id);
        }
      } catch (error) {
        console.error("ERROR FETCHING REPORT DATA", error);
      }
    };
  useEffect(() => {

    fetchData();
  }, []); // Ensure it fetches when `id` changes

  useEffect(() => {
    // Handle auto-switching tabs if enabled
    if (autoSwitch && data.length > 0) {
      const newIntervalId = setInterval(() => {
        setActiveTab((prevTab) => {
          const currentIndex = data.findIndex((item) => item.id === prevTab);
          const nextIndex = (currentIndex + 1) % data.length; 
          return data[nextIndex].id;
        });
      }, 30000); // Change tab every 3 seconds (adjustable)

      setIntervalId(newIntervalId);

      // Clean up the interval on component unmount or when autoSwitch is disabled
      return () => clearInterval(newIntervalId);
    } else if (intervalId) {
      clearInterval(intervalId); // Clear interval when autoSwitch is turned off
    }
  }, [autoSwitch, data]); // Re-run when `autoSwitch` or `data` changes


  


  return (
    <div className="px-4 mt-2">
      {/* Tabs Section */}

      <div className="flex justify-end">
        <button
          className={`${!autoSwitch ? `bg-[${themeStyles.secondaryColor}]` : "bg-red-600"} text-white px-4 py-2 rounded-md `}
          onClick={() => setAutoSwitch((prev) => !prev)}
        >
          {autoSwitch ? "Stop Auto Switch " : "Start Auto Switch"}
          </button>
      </div> 
      <div className="mt-4 text-center">
      </div>
      <div className="flex w-full items-center justify-start px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {data?.map((item) =>
          item?.id ? (
            <div
              key={item.id}
              className={`flex items-center h-14 rounded-t-sm ${
                (activeTab || activeId) === item.id ? themeStyles.tertiary : ""
              }`}
            >
              <span
                onClick={()=>handleClickTabChange(item)}
                className={`w-48 py-2 px-8 rounded-md cursor-pointer mx-2 transition-all duration-200 text-center 
                overflow-hidden whitespace-nowrap text-ellipsis font-semibold 
                ${(activeTab || activeId) === item.id ? "bg-blue-500 text-white" : "bg-[#43996a] text-white"}`}
                title={item.name}
              >
                {item.name}
              </span>
              
            </div>
          ) : null
        )}
                      <span
                onClick={()=>window.location.reload()}
                className={`py-2 px-8 rounded-md cursor-pointer mx-2 transition-all duration-200 text-center 
                overflow-hidden whitespace-nowrap text-ellipsis font-semibold 
              bg-blue-500 text-white`}
                // title={item.name}
              >
                <RedoOutlined />
              </span>
      </div>

      {/* Content Section */}
      <div className={`p-4 h-full ${themeStyles.tertiary}`}>

        {activeTab !== 0 && activeCamera == id? <>
        <CameraFeedCard key={activeTab} id={activeTab} CamData={data} />
        </>:<>
        <div className="flex justify-center align-center text-xl font-semibold">Please click on any section to view camera</div>
        </>}
      </div>

   
    </div>
  );
};


export default CameraTab;


