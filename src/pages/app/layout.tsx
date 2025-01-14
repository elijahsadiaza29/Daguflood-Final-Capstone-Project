import React from "react";
import {
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
// import './layoutstyle.css'

const AppLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-screen max-w-full h-screen w-full"
        >
            {/* SideBar */}
            {/* <ResizablePanel defaultSize={0} minSize={0} maxSize={4} className="hidden xl:flex">
                <div className="h-full p-2 text-white mx-auto">
                    <Sidebar />
                </div>
            </ResizablePanel> */}
            {/* Expand SibeBar */}
            {/* <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger>
                        <ResizableHandle
                            withHandle
                            className="bg-gray-600 cursor-col-resize hidden md:flex"
                            style={{ border: 'none', outline: 'none' }}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className='h-8 border-none bg-slate-950 text-white'
                        side="right"
                        align="center"
                        sideOffset={10}
                    >
                        <p className='text-sm'>Expand Sidebar</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> */}
            <ResizablePanel>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup >
    );
};

export default AppLayout;