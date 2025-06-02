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
    streams: {
      "1": "/api/video_feed/1/",
      "2": "/api/video_feed/2/",
      "3": "/api/video_feed/5/",
      "4": "/api/video_feed/1/",
      "5": "/api/video_feed/2/",
      "6": "/api/video_feed/5/",
      "8": "/api/video_feed/1/",
      "7": "/api/video_feed/2/",
      "9": "/api/video_feed/5/",
    },
  };

  const [data, setData] = useState<{
    streams: { [key: string]: string };
  } | null>(null);

  let url = `multi_stream/${cameraActive?.id}`;
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      // setData(dummydataMultilstreams);
      console.log("ERROR FETCHING REPORT DATA", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    //     const filteredData = CamData.filter((item: any) => item.id === id);

    // setData(filteredData[0]?.camera_ids)
  }, [cameraActive?.id]); // Re-fetch when `id` changes

  const onChange = (checked: boolean) => {
    setAutoScroll(checked);
  };

  useEffect(() => {
    if (!autoScroll || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;

    const smoothScroll = () => {
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        setTimeout(() => {
          scrollContainer.scrollTo({ left: 0, behavior: "instant" }); // Instantly reset
        }, 500); // Delay before reset
      } else {
        scrollContainer.scrollBy({ left: 2, behavior: "smooth" }); // Smooth scroll step
      }
    };

    const scrollInterval = setInterval(smoothScroll, 1); // Control speed

    return () => clearInterval(scrollInterval);
  }, [autoScroll]);

  return (
    <div className="relative ">
      {/* Scrollable Image Cards */}
      <div
  ref={scrollContainerRef}
  className="grid grid-rows-2 grid-flow-col auto-cols-max gap-6 overflow-x-auto py-4 scrollbar-hide justify-center items-center"
>
  {data ? (
    Object.values(data.streams).map((item, index) => (
      <div
        key={index}
        className="relative w-96 h-60 cursor-pointer shadow-lg"
        onClick={() => setPreviewImage(`http://localhost:8000${item}`)}
      >
        {loading && (
          <div className="absolute top-[45%] left-[45%] flex items-center justify-center rounded-md">
            <Spin size="large" />
          </div>
        )}
        <img
          src={`http://localhost:8000${item}`}
          alt="Camera Feed"
          className="w-full h-full object-cover rounded-md"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>
    ))
  ) : (
    <div className="bg-white h-[50vh] w-full rounded-sm flex items-center justify-center items-center font-bold text-2xl">
      <Spin size="large" />
    </div>
  )}
</div>



      {previewImage && (
        <div className="fixed inset-0 bg-[#000000d1] flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full cursor-pointer"
              onClick={() => setPreviewImage(null)}
            >
              ✖
            </button>
            <div className="w-[60vw] h-[80vh]">
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
