import React from 'react';
import QRCode from "react-qr-code";

const PWAInstallQR: React.FC = () => {

    return (
        <div>
            <QRCode
                value="https://dagufloodv2.web.app/pwa-install"
                size={150}
                level={"L"}
            />
        </div>
    );
};

export default PWAInstallQR;