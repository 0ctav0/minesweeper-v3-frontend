/// <reference types="vite/client" />

declare var Telegram: undefined | null | {
    WebView: {
        onEvent: (eventType: "popupClosed", callback: () => void) => void;
    }
}