import React from 'react';
export interface PhraseProps {
    lines: string[];
    category: string;
    mood: string;
}
interface TypingAnimationProps {
    phraseData?: PhraseProps;
    fontIndex?: number;
    backgroundIndex?: number;
    audioIndex?: number;
    typingSpeed?: number;
    cursorBlinkSpeed?: number;
    fontSize?: number;
    customTextColor?: string;
    customBackgroundColor?: string;
    customPhrase?: string;
    customPhraseLines?: string[];
}
export declare const NewTypingAnimation: React.FC<TypingAnimationProps>;
export {};
