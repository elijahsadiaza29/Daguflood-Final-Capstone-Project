import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TideLevelDaily from "./tide-chart-daily-prediction";
import WaterLevel from "./water-level-chart";

export function ChartContainer() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Add useEffect to handle initial state based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      // Set isOpen to true if screen width is >= 640px (sm breakpoint)
      setIsOpen(window.innerWidth >= 640);
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={ref}
      className={`
        graph-stats-cont fixed h-full right-0 z-49 transition-transform duration-500 ease-in-out
        sm:top-0 top-20
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <button
        onClick={toggleDiv}
        className="flex gap-2 w-fit bg-background rounded-t-xl absolute p-2 pb-8 z-50 px-8 my-24 transform -rotate-90 translate-x-[-50%] card-zoom-in group hover:text-muted-foreground transition-colors ease-in-out duration-200"
      >
        {isOpen ? (
          <ArrowLeft className="transform -rotate-90" />
        ) : (
          <ArrowRight className="transform -rotate-90" />
        )}
      </button>
      <div className="relative flex flex-col gap-[6rem]">
        <div className="grid grid-rows-2 gap-2 p-4 mt-7 sm:mt-0">
          <WaterLevel/>
          <TideLevelDaily />
        </div>
      </div>
    </div>
  );
}