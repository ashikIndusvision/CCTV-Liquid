import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../Context/ThemeContext';
import { sidebarMenu } from '../../Config/Sidebar';

const Sidenav = () => {
const { themeStyles } = useTheme();

    const location = useLocation();



  return (
    <nav className={`fixed left-0 top-26 h-[calc(100vh-3rem)] w-[16%]  text-white p-4 ${themeStyles.tertiary}`}>
    <div className="space-y-4">
      {sidebarMenu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-semibold ${
            location.pathname === item.path
              ? ` text-white  ${themeStyles.secondary} `
              : `hover:text-[${themeStyles.secondary}] text-black`
          }`}
        >
          <span><item.icon/></span>
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  </nav>
  )
}

export default Sidenav