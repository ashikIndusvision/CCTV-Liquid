import { useEffect, useState } from 'react';

import PageTitle from '../Common/UI/PageTitle';
import CameraTab from '../Tab/CameraTab';
import axiosInstance from '../../API/Api';




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
console.table(data)

  const [activeCamera, setActiveCamera] = useState<string | number>(0);
  console.log(activeCamera)

  const handleCamera=(cameraId:string | number)=>{
    setActiveCamera(cameraId)
  }
  return (
    <div className="space-y-10 w-full">
      
      {
        data?.map((item)=>{
          return(
            <>    
<PageTitle title={item?.name} />
<CameraTab id={item.id} activeCamera={activeCamera} handleCamera={handleCamera}/> 
            </>
          )
        })
      }

    </div>  )
}

export default Dashboard