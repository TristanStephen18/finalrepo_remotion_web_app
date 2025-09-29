export declare const FONTS: {
    id: string;
    name: string;
    family: string;
    weight: number;
    category: string;
}[];
export declare const BACKGROUNDS: {
    id: string;
    name: string;
    type: string;
    backgroundColor: string;
    textColor: string;
    animation: string;
    mood: string;
    category: string;
}[];
export declare const AUDIO_FILES: {
    id: string;
    filename: string;
    name: string;
    mood: string;
    bestWith: string[];
}[];
export declare const PHRASES: {
    lines: string[];
    category: string;
    mood: string;
}[];
export declare const DEFAULT_SETTINGS: {
    typingSpeed: number;
    cursorBlinkSpeed: number;
    fontSize: number;
    holdDuration: number;
    fps: number;
    width: number;
    height: number;
    quality: {
        crf: number;
        audioBitrate: string;
        pixelFormat: string;
    };
};
