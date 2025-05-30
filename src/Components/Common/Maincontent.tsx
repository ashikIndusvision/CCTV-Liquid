import { ReactNode } from 'react';

const MainContent = ({children}: {children: ReactNode}) => {
  return (
    <div className="relative top-22 left-[15%] px-5   justify-center flex w-[85%] ">
    {children}
  </div>
  )
}

export default MainContent