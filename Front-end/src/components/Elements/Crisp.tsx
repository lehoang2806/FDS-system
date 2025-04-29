import { useEffect } from 'react';

const CrispChat = () => {
    useEffect(() => {
        window.$crisp = []; // Phải đặt TRƯỚC khi load script
        window.CRISP_WEBSITE_ID = '318f2cb4-43da-4337-a75e-3f2abfc6e101'; // Website ID của bạn

        const script = document.createElement('script');
        script.src = 'https://client.crisp.chat/l.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return null;
};

export default CrispChat;
