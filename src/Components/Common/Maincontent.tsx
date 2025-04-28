import { ReactNode } from 'react';

const MainContent = ({children}: {children: ReactNode}) => {
  return (
    <div className="relative top-32 left-0 px-5   justify-center flex  ">
    {children}
  </div>
  )
}

export default MainContent