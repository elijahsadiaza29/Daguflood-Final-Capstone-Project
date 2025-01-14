import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HelpIcon from '@mui/icons-material/Help';



const HelpButton = () => {
    const navigate = useNavigate();
    return (
        <div className="absolute bottom-[21.5rem] right-2 z-50 mb-3 sm:mb-2 hidden sm:block">
            <Button
                className="text-foreground sm:rounded-full rounded-full w-11 h-11"
                size="icon"
                variant="opaque"
                onClick={() => navigate("/help-center")} 
            >
                <HelpIcon/>
            </Button>
        </div>
    );
}
export default HelpButton;