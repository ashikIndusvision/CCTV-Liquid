import { Outlet } from "react-router-dom";
import Header from '../Common/Header';
import MainContent from '../Common/Maincontent';

const DashboardLayout = () => {
  return (
    <>
      <Header />
        <MainContent  >
          <Outlet />
        </MainContent>
    </>
  )
}

export default DashboardLayout