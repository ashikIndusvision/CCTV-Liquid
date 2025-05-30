import { useEffect, useState } from 'react';

import PageTitle from '../Common/UI/PageTitle';
import CameraTab from '../Tab/CameraTab';
import axiosInstance from '../../API/Api';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import CameraFeedCard from '../Tab/CameraFeedCard';




interface Item {
  id: number;
  name: string;
}

const Dashboard = () => {

  const [data , setData] = useState<Item[]>([])
  
  useEffect(()=>{
    let url = "seracs/"
    const fecthData =  async() =>{
      try {
        const response = await axiosInstance.get(url);
        if(response){
          console.table(response.data)
          setData(response.data.results)
        }
      } catch (error) {
        console.log("ERROR FETCHING REPORT DATA",error)
      }
    }
    fecthData()
  },[])

  const [activeCamera, setActiveCamera] = useState<string | number>(0);
  console.log(activeCamera)

  const handleCamera=(cameraId:string | number)=>{
    setActiveCamera(cameraId)
  }
  // if(data){
  //   return <div className="">NO data</div>
  // }
  return (
    <div className=" w-full">
      <div className="w-full bg-[#e6eafa] h-16 flex justify-start items-center px-4 gap-10">
        <span className='px-8 py-2 border-1 rounded-md font-bold'>Serac 1</span>
        <ArrowBigRight/>
        <span className='px-8 py-2 border-1 rounded-md font-bold'>Bottom Line</span>
      </div>
 
      <CameraFeedCard id={activeCamera} CamData={data} />
      
      {
        data?.map((item)=>{
<PageTitle title={item?.name || "Camera"} />
          return(
            <>    
        {/* <CameraTab id={item.id} activeCamera={activeCamera} handleCamera={handleCamera}/>  */}
            </>
          )
        })
      }

    </div>  )
}

export default Dashboard