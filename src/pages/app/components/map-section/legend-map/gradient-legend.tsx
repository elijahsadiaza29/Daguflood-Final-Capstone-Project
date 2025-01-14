import React from 'react';
import './map-gradient.css';
interface GradientMapLegendProps {
    gradientColors: string[];
    labels: {
        text: string;
    }[];
}

const GradientMapLegend: React.FC<GradientMapLegendProps> = ({
    gradientColors,
    labels
}) => {
    const gradient = `linear-gradient(to right, ${gradientColors.join(', ')})`;

    return (
        <div className="gradient-map-legend vertical ">
            <div className="gradient-bar" style={{ background: gradient }}>
                <div className="labels">
                    {labels.map((label) => (
                        <div
                            className="label text-white font-medium"
                        >
                            {label.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GradientMapLegend;
