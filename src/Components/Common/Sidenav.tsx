import { useTheme } from "../../Context/ThemeContext";
import {
  VideoCameraFilled,
} from "@ant-design/icons";
import {  MenuProps } from "antd";
import { Menu } from "antd";
import { MonitorCog } from "lucide-react";
import { useState } from "react";

interface SidenavProps {
  sectionsData: string[]; 
}

const Sidenav = ({ sectionsData }: SidenavProps) => {
  const { themeStyles } = useTheme();

  type MenuItem = Required<MenuProps>["items"][number];

  const [selectedKey, setSelectedKey] = useState("5");
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Serac 1",
      icon: <MonitorCog />,
      children: [
        { key: "5", label: "Option 5", icon: <VideoCameraFilled /> },
        { key: "6", label: "Option 6", icon: <VideoCameraFilled /> },
        { key: "7", label: "Option 7", icon: <VideoCameraFilled /> },
        { key: "8", label: "Option 8", icon: <VideoCameraFilled /> },
      ],
    },
    {
      key: "sub2",
      label: "Serac 2",
      icon: <MonitorCog />,
      children: [
        { key: "9", label: "Option 9", icon: <VideoCameraFilled /> },
        { key: "10", label: "Option 10", icon: <VideoCameraFilled /> },
        { key: "11", label: "Option 11", icon: <VideoCameraFilled /> },
        { key: "12", label: "Option 12", icon: <VideoCameraFilled /> },
      ],
    },
    {
      key: "sub3",
      label: "Serac 3",
      icon: <MonitorCog />,
      children: [
        { key: "13", label: "Option 13", icon: <VideoCameraFilled /> },
        { key: "14", label: "Option 14", icon: <VideoCameraFilled /> },
        { key: "15", label: "Option 15", icon: <VideoCameraFilled /> },
        { key: "16", label: "Option 16", icon: <VideoCameraFilled /> },
      ],
    },
  ];
  
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));

    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      const firstChildKey = items.find(
        (item): item is Required<MenuItem> & { children: MenuItem[] } =>
          item?.key === latestOpenKey && "children" in item && !!item.children
      )?.children?.[0]?.key;

      if (firstChildKey) {
        setSelectedKey(String(firstChildKey));
      }
    } else {
      setOpenKeys([]);
    }
  };

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
        onClick={({ key }) => {
          setSelectedKey(String(key));
        }}
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
