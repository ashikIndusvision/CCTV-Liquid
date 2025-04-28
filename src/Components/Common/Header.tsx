
import { useTheme } from '../../Context/ThemeContext';

import content from '../../Config/Content';
import { LogOut } from 'lucide-react';



const Header = () => {
const { themeStyles } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0  border-b shadow-sm z-10 ${themeStyles.primary} ${themeStyles.text}`}>
    <div className="flex h-full ">
      <div className=" font-semibold text-4xl  w-[16%] justify-center  flex border-r-2   ">
        <img src={content.headerContent.headerIndusVisionLogo} width="50%" height="50%" alt="Error Loading Image" className='object-contain' />
      </div>
      <div className="flex items-center  justify-start py-2  w-[84%]">
       {/* <ThemeToggle/> */}
        {/* <button className="p-2">
          <span className="sr-only">User menu</span>
          👤
        </button> */}
<div className="flex justify-center items-center gap-1">
    <span className={   `${themeStyles.tertiary} flex justify-center items-center w-[30%]  rounded-sm`}>
        <img src={content.headerContent.ClientLogo} alt="Not an image" width="40%" height="auto" className='object-contain'  />
    </span>
        <span className='font-bold text-2xl'>{content.headerContent.ClientText}</span>
</div>
      </div>
      <div className="flex items-center px-4">
      {/* <button className='bg-[#43996a] h-8 w-20 rounded-sm font-ssemibold'>Logout</button> */}
      <span className='bg-[#43996a] p-2 cursor-pointer rounded-sm font-ssemibold'>
      <LogOut />
      </span>
      </div>
    </div>
  </header>
  )
}

export default Header