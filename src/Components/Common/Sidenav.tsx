import { useTheme } from "../../Context/ThemeContext";
import { MenuProps, Spin } from "antd";
import { Menu } from "antd";
import { MonitorCog, LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";
import { useCameraContext } from "../../Context/SectionactiveContext";

interface Section {
  id: string;
  name: string;
  sections: {
    id: string;
    name: string;
  }[];
}

interface SidenavProps {
  sectionsData: Section[];
  loading: boolean
}

const Sidenav = ({ sectionsData , loading }: SidenavProps) => {
  const { themeStyles } = useTheme();
  const { setCameraActive } = useCameraContext();

  type MenuItem = Required<MenuProps>["items"][number];

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  // Local storage keys
  const STORAGE_KEYS = {
    selectedKey: 'sidenav_selected_key',
    openKeys: 'sidenav_open_keys',
    cameraActive: 'sidenav_camera_active'
  };

  // Load state from localStorage
  const loadStateFromStorage = () => {
    try {
      const storedSelectedKey = localStorage.getItem(STORAGE_KEYS.selectedKey);
      const storedOpenKeys = localStorage.getItem(STORAGE_KEYS.openKeys);
      const storedCameraActive = localStorage.getItem(STORAGE_KEYS.cameraActive);

      return {
        selectedKey: storedSelectedKey || "",
        openKeys: storedOpenKeys ? JSON.parse(storedOpenKeys) : [],
        cameraActive: storedCameraActive ? JSON.parse(storedCameraActive) : null
      };
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return { selectedKey: "", openKeys: [], cameraActive: null };
    }
  };

  // Save state to localStorage
  const saveStateToStorage = (key: string, openKeysArray: string[], cameraActiveData: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.selectedKey, key);
      localStorage.setItem(STORAGE_KEYS.openKeys, JSON.stringify(openKeysArray));
      localStorage.setItem(STORAGE_KEYS.cameraActive, JSON.stringify(cameraActiveData));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    const latestClosedKey = openKeys.find((key) => !keys.includes(key));

    if (latestOpenKey) {
      const topLevelKeys = items.map((item) => item?.key).filter(Boolean);
      const isTopLevel = topLevelKeys.includes(latestOpenKey);

      if (isTopLevel) {
        const newOpenKeys = [latestOpenKey];
        setOpenKeys(newOpenKeys);

        const firstSectionKey = items.find(
          (item): item is Required<MenuItem> & { children: MenuItem[] } =>
            item?.key === latestOpenKey && "children" in item && !!item.children
        )?.children?.[0]?.key;

        if (firstSectionKey) {
          const newSelectedKey = String(firstSectionKey);
          setSelectedKey(newSelectedKey);
          
          const id = (firstSectionKey as string)?.split("-")?.pop();
          const name = (firstSectionKey as string)?.split("-")?.shift();
          const cameraActiveData = {
            id: id ?? "",
            activeSections: name ?? "",
          };
          
          setCameraActive(cameraActiveData);
          
          // Save to localStorage
          saveStateToStorage(newSelectedKey, newOpenKeys, cameraActiveData);
        }
      } else {
        const newOpenKeys = [...openKeys, latestOpenKey];
        setOpenKeys(newOpenKeys);
        
        // Update localStorage with new open keys
        try {
          localStorage.setItem(STORAGE_KEYS.openKeys, JSON.stringify(newOpenKeys));
        } catch (error) {
          console.error('Error updating openKeys in localStorage:', error);
        }
      }
    } else if (latestClosedKey) {
      setOpenKeys(keys);
      
      try {
        localStorage.setItem(STORAGE_KEYS.openKeys, JSON.stringify(keys));
      } catch (error) {
        console.error('Error updating openKeys in localStorage:', error);
      }
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const newSelectedKey = String(key);
    setSelectedKey(newSelectedKey);
    
    const id = (key as string)?.split("-")?.pop();
    const name = (key as string)?.split("-")?.shift();
    const cameraActiveData = {
      id: id ?? "",
      activeSections: name ?? "",
    };
    
    setCameraActive(cameraActiveData);
    
    // Save to localStorage before reload
    saveStateToStorage(newSelectedKey, openKeys, cameraActiveData);   
      window.location.reload();
  };

  useEffect(() => {
    if (sectionsData && Array.isArray(sectionsData)) {
      const transformedItems: MenuItem[] = sectionsData.map((line) => ({
        key: `line-${line.id}`,
        label: line.name,
        icon: <LayoutTemplate />,
        children: line.sections.map((section) => ({
          key: `${section.name}-${line.id}-${section.id}`,
          label: section.name,
          icon: <MonitorCog />,
        })),
      }));

      setItems(transformedItems);

      // Load state from localStorage
      const savedState = loadStateFromStorage();

      // Check if saved state is valid with current data
      const isValidSavedState = savedState.selectedKey && 
        transformedItems.some(item => 
          item && "children" in item && item.children?.some(child => child?.key === savedState.selectedKey)
        );

      if (isValidSavedState && savedState.cameraActive) {
        // Restore from localStorage
        setSelectedKey(savedState.selectedKey);
        setOpenKeys(savedState.openKeys);
        setCameraActive(savedState.cameraActive);
      } else {
        // Default to first item if no valid saved state
        const firstOpenKey = transformedItems[0]?.key;
        const firstSectionKey =
          transformedItems[0] &&
          "children" in transformedItems[0] &&
          Array.isArray(transformedItems[0].children)
            ? transformedItems[0].children[0]?.key
            : undefined;

        if (firstOpenKey && firstSectionKey) {
          const id = (firstSectionKey as string)?.split("-")?.pop();
          const name = (firstSectionKey as string)?.split("-")?.shift();
          const cameraActiveData = {
            id: id ?? "",
            activeSections: name ?? "",
          };
          
          setCameraActive(cameraActiveData);
          setOpenKeys([String(firstOpenKey)]);
          setSelectedKey(String(firstSectionKey));
          
          // Save initial state to localStorage
          saveStateToStorage(String(firstSectionKey), [String(firstOpenKey)], cameraActiveData);
        }
      }
    }
  }, [sectionsData]);

  // Cleanup localStorage on component unmount (optional)
  useEffect(() => {
    return () => {
      // Optionally clear localStorage on unmount
      // localStorage.removeItem(STORAGE_KEYS.selectedKey);
      // localStorage.removeItem(STORAGE_KEYS.openKeys);
      // localStorage.removeItem(STORAGE_KEYS.cameraActive);
    };
  }, []);

  if(loading){
   return <div className={` flex justify-center items-center fixed left-0 top-20 transition-all duration-300 h-[calc(100vh-3rem)] w-[16%]
     text-white p-3 overflow-hidden ${themeStyles.tertiary}`}><Spin/></div>
  }

  if(!sectionsData || sectionsData.length === 0){
    return <div className={` flex justify-center items-center fixed left-0 top-20 transition-all duration-300 h-[calc(100vh-3rem)] w-[16%]
      text-black font-bold p-3 overflow-hidden ${themeStyles.tertiary}`}>No data</div>
  }

  console.log(sectionsData,"sectionsdata")

  return (
    <nav
      className={`fixed left-0 top-20 transition-all duration-300 h-[calc(100vh-3rem)] w-[16%]
     text-white p-3 overflow-hidden ${themeStyles.tertiary}`}
    >
      <Menu
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
        style={{
          backgroundColor: "transparent",
          color: "white",
          borderRight: "none",
        }}
        className="custom-menu"
      />
    </nav>
  );
};
export default Sidenav;
