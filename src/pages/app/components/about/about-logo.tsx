import Logo from '../../../../assets/logo.svg';

const About: React.FC = () => {
    return (
        <div
            id="About"
            className="absolute top-2 left-1 p-2 px-3 bg-[#ffffff] dark:bg-[#202730] rounded-lg border border-white/10 hidden sm:block"
        >
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                {/* Logo Section */}
                <div id="logo" className="flex items-center justify-center">
                    <img src={Logo} alt="Logo" className="w-8 h-8" />
                </div>

                {/* Text Section */}
                <div id="text" className="flex flex-col justify-center">
                    <div className="font-bold text-md text-blue-600 dark:text-[#ffffff] leading-none">
                        DAGU
                    </div>
                    <div className="text-gray-400 font-bold text-sm text-center leading-none">
                        FLOOD
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
