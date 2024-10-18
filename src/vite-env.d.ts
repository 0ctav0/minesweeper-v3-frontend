/// <reference types="vite/client" />

declare var Telegram: undefined | null | {
    WebApp: {
        onEvent: (eventType: "popupClosed", callback: (...any) => void) => void;
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
        onEvent: (eventType: "popupClosed", callback: (...any) => void) => void;
    }
}