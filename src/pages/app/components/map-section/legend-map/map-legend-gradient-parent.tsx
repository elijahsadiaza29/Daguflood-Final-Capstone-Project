import React from 'react';
import GradientMapLegend from './gradient-legend';
import './map-gradient.css';

const Maplegend: React.FC = () => {
    const gradientColors = ['#5391f5', '#fafa2d', '#ff6600', '#ff0000',];
    const labels = [
        { text: 'Normal' },
        { text: 'Warning' },
        { text: 'Alert' },
        { text: 'Critical' },

    ];
    return (

        <div className="absolute z-50 bottom-2 mx-0 sm:mx-3 w-full sm:w-auto sm:top-auto top-[-20px] h-0 sm:h-auto">
            <h1 className="hazard-level text-white text-center mb-[-10px] sm:font-bold sm:text-xs text-xs hidden sm:block">
                HAZARD LEVEL
            </h1>
            <GradientMapLegend
                gradientColors={gradientColors}
                labels={labels}
            />

        </div>
    );
};

export default Maplegend;
