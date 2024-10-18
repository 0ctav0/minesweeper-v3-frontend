/// <reference types="vite/client" />

declare var Telegram: undefined | null | {
    WebApp: {
        onEvent: (eventType: "popup_closed", callback: (...any) => void) => void;
        SecondaryButton: {
            onClick: (...any) => void;
        }
        MainButton: {
            onClick: (...any) => void;
        }
        BackButton: {
            onClick: (...any) => void;
        }
    }
    WebView: {
        onEvent: (eventType: "popup_closed", callback: (...any) => void) => void;
    }
}