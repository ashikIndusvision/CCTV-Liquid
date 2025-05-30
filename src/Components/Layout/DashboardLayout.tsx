import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import MainContent from "../Common/Maincontent";
import Sidenav from "../Common/Sidenav";
import { useEffect, useState } from "react";
import axiosInstance from "../../API/Api";

const DashboardLayout = () => {

const [sectionsData , setSectionsData]= useState([])

// HIT SECTIONS AND OPTIONS API
useEffect(() => {
  const fetchData = async () => {
    try {
      const url = "/";
      const response = await axiosInstance.get(url);
      console.log(response);
      setSectionsData(response.data)
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
}, []);

  return (
    <>
      <Header />
      <div className="flex justify-between">
        <Sidenav sectionsData = {sectionsData} />
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </>
  );
};

export default DashboardLayout;
