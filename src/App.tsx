import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ThemeProvider } from "./Context/ThemeContext";
import { CameraProvider } from "./Context/SectionactiveContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <CameraProvider>
          <RouterProvider router={router} />
        </CameraProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
