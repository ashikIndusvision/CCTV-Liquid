import React, { createContext, useContext, useState, ReactNode } from "react";

type cameraActive = {
    id: string;
    activeSections:string 
   
}
interface CameraContextType {
  cameraActive: cameraActive | undefined;
  setCameraActive: (value: cameraActive) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [cameraActive, setCameraActive] = useState<cameraActive | undefined>();

  return (
    <CameraContext.Provider value={{ cameraActive, setCameraActive }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCameraContext must be used within CameraProvider");
  }
  return context;
};
