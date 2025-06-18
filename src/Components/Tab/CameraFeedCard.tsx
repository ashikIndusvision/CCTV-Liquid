import { useEffect, useRef, useState } from "react";

import axiosInstance from "../../API/Api";
import { Spin, Switch } from "antd";
import { Loader, Loader2 } from "lucide-react";
import { useCameraContext } from "../../Context/SectionactiveContext";

const CameraFeedCard = () => {
  const { cameraActive } = useCameraContext();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dummydataMultilstreams = {
    message: "Camera feeds updated",
    streams: [
      {
        camera_name: "FujiSeal Front View",
        "4": "/api/video_feed/4/",
      },
      {
        camera_name: "FujiSeal Outfeed Conv",
        "5": "/api/video_feed/5/",
      },
      {
        camera_name: "FujiSeal Front View",
        "4": "/api/video_feed/4/",
      },
      {
        camera_name: "FujiSeal Front View",
        "4": "/api/video_feed/4/",
      },
      {
        camera_name: "FujiSeal Front View",
        "4": "/api/video_feed/4/",
      },
      {
        camera_name: "FujiSeal Front View",
        "4": "/api/video_feed/4/",
      },

   
    ],
  };

  const [data, setData] = useState<{
    streams: {
      camera_name: string;
      [key: string]: any;
    }[];
  } | null>(null);

  const url = `multi_stream/${cameraActive?.id}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.log("ERROR FETCHING REPORT DATA", error);
      setData(dummydataMultilstreams);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cameraActive?.id]);

  // Create duplicated streams for infinite scroll effect
  const getDuplicatedStreams = () => {
    if (!data?.streams) return [];
    // Duplicate the streams to ensure smooth infinite scroll
    return [...data.streams];
  };

  useEffect(() => {
    if (!autoScroll || !scrollContainerRef.current || !data?.streams.length) return;
  
    const scrollContainer = scrollContainerRef.current;
    let animationId: number;
    let direction = 1; // 1 = scroll right, -1 = scroll left
    const scrollSpeed = 1; // pixels per frame
  
    const smoothScroll = () => {
      if (!autoScroll) return;
  
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  
      scrollContainer.scrollLeft += direction * scrollSpeed;
  
      // Reverse direction if we hit the edges
      if (scrollContainer.scrollLeft >= maxScrollLeft) {
        direction = -1; // scroll left
      } else if (scrollContainer.scrollLeft <= 0) {
        direction = 1; // scroll right
      }
  
      animationId = requestAnimationFrame(smoothScroll);
    };
  
    animationId = requestAnimationFrame(smoothScroll);
  
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [autoScroll, data?.streams]);
  

  const duplicatedStreams = getDuplicatedStreams();

  return (
    <div className="relative">
      {/* Scroll Controls */}
      <div className="flex justify-end items-center mb-4 mt-1">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`px-3 py-1 rounded transition cursor-pointer ${
            autoScroll 
              ? "bg-green-500 text-white hover:bg-green-600" 
              : "bg-red-800 text-white hover:bg-red-400"
          }`}
        >
          Auto Scroll: {autoScroll ? "ON" : "OFF"}
        </button>
      </div>

      {/* Scrollable Container with Two Rows */}
      <div
        ref={scrollContainerRef}
        className="grid grid-rows-2 grid-flow-col auto-cols-max gap-6 overflow-x-auto py-4"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {data ? (
          duplicatedStreams.map((item, index) => {
            const streamKey = Object.keys(item).find(
              (key) => key !== "camera_name"
            );
            const streamUrl = item[streamKey!];

            return (
              <div
                key={`${index}-${streamKey}`}
                className="relative w-96 h-60 cursor-pointer shadow-lg rounded-md overflow-hidden"
                onClick={() =>
                  setPreviewImage(`http://localhost:8000${streamUrl}`)
                }
              >
                <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                  {item.camera_name}
                </span>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Spin size="large" />
                  </div>
                )}
                <img
                  src={`http://localhost:8000${streamUrl}`}
                  alt={`Camera Feed - ${item.camera_name}`}
                  className="w-full h-full object-cover"
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              </div>
            );
          })
        ) : (
          <div className="bg-white h-[50vh] w-full rounded-sm flex items-center justify-center font-bold text-2xl">
            <Spin size="large" />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-[#00000d7a] bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full cursor-pointer hover:bg-gray-200 transition z-10"
              onClick={() => setPreviewImage(null)}
            >
              ✖
            </button>
            <div className="w-[90vw] h-[90vh] max-w-6xl">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CameraFeedCard;
