

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PWAInstaller: React.FC = () => {
    console.log('PWAInstaller rendered');
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('PWAInstaller mounted');
        console.log('Current URL:', window.location.href);
        console.log('Current pathname:', location.pathname);

        // Log any URL parameters for debugging
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL Parameters:', Object.fromEntries(urlParams));

        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('Install prompt event captured');
            e.preventDefault();
            setInstallPrompt(e as any);
            setShowInstructions(true); // Show installation instructions if the prompt is available
        };

        // Listen for the 'beforeinstallprompt' event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        console.log('Listener added for beforeinstallprompt event');

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [installPrompt, location]);

    useEffect(() => {
        // Alert when the install prompt is available
        if (installPrompt) {
            window.alert('PWA installation prompt available');
        }
    }, [installPrompt]);

    const triggerInstall = async () => {
        console.log('Attempting to trigger install');
        if (!installPrompt) {
            console.log('No install prompt available');
            return;
        }

        try {
            const result = await installPrompt.prompt();
            const choiceResult = await result.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('PWA Installation Accepted');
            } else {
                console.log('PWA Installation Dismissed');
            }
        } catch (error) {
            console.error('PWA Installation Error:', error);
        }

        navigate('/');
    };

    return (
        <div>
            <h1>Installing PWA...</h1>
            {showInstructions && (
                <div>
                    <h2>Install on Desktop</h2>
                    <p>
                        If you see the install prompt, click "Add to Home Screen" or click the "Install" button in the address bar to install this app.
                    </p>
                    <button onClick={triggerInstall}>Install App (Desktop)</button>

                </div>
            )}
            {!showInstructions && (
                <p>Please wait or follow the installation prompt to add the app to your device.</p>
            )}
        </div>
    );
};

export default PWAInstaller;

