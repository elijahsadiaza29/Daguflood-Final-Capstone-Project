import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    IconShare2,
    IconX,
} from "@tabler/icons-react";
import { useState } from "react";

interface ShareControlProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAll: () => void;
    shareUrl?: string;
    shareTitle?: string;
}

const ShareControl = ({
    isOpen,
    onOpenChange,
    onCloseAll,
    shareUrl = "https://dagufloodv2.web.app/",
    shareTitle = "Check out this amazing website!"
}: ShareControlProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 500);
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
            });
    };

    const shareOnPlatform = (platform: string) => {
        let shareLink = '';

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'threads':
                shareLink = `https://threads.net/intent/post?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'telegram':
                shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this link: ${shareUrl}`)}`;
                break;
        }

        // If browser supports Web Share API, use it first
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                url: shareUrl
            }).catch(console.error);
        } else {
            // Fallback to opening share link in new window
            window.open(shareLink, '_blank');
        }
    };

    return (
        <div className="absolute z-50 top-[26rem] right-2 hidden sm:block">
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <Popover
                        open={isOpen}
                        onOpenChange={(open) => {
                            if (open) {
                                onCloseAll();
                            }
                            onOpenChange(open);
                        }}
                    >
                        <TooltipTrigger>
                            <PopoverTrigger>
                                <Button
                                    variant="opaque"
                                    className="text-foreground sm:rounded-full rounded-full w-11 h-11"
                                    size="icon"
                                >
                                    {isOpen ? (
                                        <IconX className="text-white w-6 h-6 sm:w-5 sm:h-5" />
                                    ) : (
                                        <IconShare2 stroke={2.5} className="text-white w-6 h-6" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <PopoverContent
                            className="relative gap-2 sm:left-auto left-[-0.22222rem] sm:w-[28rem] w-screen sm:h-auto h-[100vh] sm:rounded-xl rounded-none flex flex-col"
                            side="left"
                            sideOffset={4}
                            align="start"
                        >
                            <div className="grid gap-4">
                                <div id="label" className="flex gap-2 items-center">
                                    <IconShare2 stroke={2.5} className="text-white w-6 h-6" />
                                    <Label className="text-white text-lg">
                                        Share
                                    </Label>
                                    <div className="ml-auto block sm:hidden">
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            className="hover:bg-transparent text-right"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            <IconX className="w-5 h-5 sm:w-5 sm:h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Link Copy Section */}
                            <div id="content" className="grid grid-cols-[1fr_auto] border border-white/10 rounded-xl p-1 items-center mb-4">
                                <Input
                                    className="font-md border-none shadow-none focus-visible:ring-0"
                                    value={shareUrl}
                                    readOnly
                                />
                                <Button
                                    className={`hover:text-white rounded-full mx-1 px-6 hover:ease-in-out duration-300 hover:bg-blue-500 ${isCopied ? "bg-blue-500 text-white" : ""}`}
                                    variant={"secondary"}
                                    size={"sm"}
                                    onClick={handleCopyLink}
                                >
                                    {isCopied ? "Copied!" : "Copy link"}
                                </Button>
                            </div>

                            {/* Social Media Sharing Buttons */}
                            <div className="text-white flex gap-2 items-center flex-wrap w-auto sm:w-96  mx-auto">
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                    className="text-base border-none bg-red-500 rounded-full w-fit px-4 hover:bg-red-500 hover:text-white"
                                    onClick={() => shareOnPlatform('email')}
                                >
                                    <span>Email</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                    className="text-base border-none bg-blue-600 rounded-full w-fit px-4 hover:bg-blue-600  hover:text-white "
                                    onClick={() => shareOnPlatform('facebook')}
                                >
                                    <span>Facebook</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                    className="text-base border-none bg-black rounded-full w-fit px-4 hover:bg-black  hover:text-white"
                                    onClick={() => shareOnPlatform('threads')}
                                >
                                    <span>Threads</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                    className="text-base border-none bg-blue-500 rounded-full w-fit px-4 hover:bg-blue-500  hover:text-white"
                                    onClick={() => shareOnPlatform('telegram')}
                                >
                                    <span>Telegram</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                    className="text-base border-none bg-green-500 rounded-full w-fit px-4 hover:bg-green-500  hover:text-white"
                                    onClick={() => shareOnPlatform('whatsapp')}
                                >
                                    <span>WhatsApp</span>
                                </Button>

                            </div>
                        </PopoverContent>
                    </Popover>
                    <TooltipContent side="left">
                        <p>Share</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default ShareControl;