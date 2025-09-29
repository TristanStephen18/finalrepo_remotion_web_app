import React from "react";
interface TranscriptSpeaker {
    id?: string;
    name?: string;
}
interface TranscriptSegment {
    text?: string;
    start_time?: number;
    end_time?: number;
    speaker?: TranscriptSpeaker;
}
export interface TranscriptJson {
    language_code?: string;
    segments?: TranscriptSegment[];
}
export type ChatVideoProps = {
    chatPath: string;
    bgVideo: string;
    chatAudio: string;
    musicAudio: string;
    musicBase: number;
    musicWhileTalking: number;
    duckAttackMs: number;
    duckReleaseMs: number;
    timeShiftSec: number;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    chatTheme: "default" | "discord" | "messenger" | "whatsapp";
    avatars: {
        left?: string;
        right?: string;
    };
};
export declare const ChatVideo3: React.FC<ChatVideoProps>;
export {};
