import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import MainContent from "../Common/Maincontent";
import Sidenav from "../Common/Sidenav";
import { useEffect, useState } from "react";
import axiosInstance from "../../API/Api";
import response from "../../../dummy-data/sectionata.js";

const DashboardLayout = () => {
  const [sectionsData, setSectionsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // HIT SECTIONS AND OPTIONS API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = "seracs/";
        const response = await axiosInstance.get(url);
        setSectionsData(response.data);
      } catch (error) {
        console.log(error);
        // setSectionsData(response?.results);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <>
      <Header />
      
      <div className="flex justify-between">
        <Sidenav sectionsData={sectionsData} loading={loading}  />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </>
  );
};

export default DashboardLayout;
