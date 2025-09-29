type MyRedditVideoProps = {
    voiceoverPath: string;
    duration: number;
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    sentenceBgColor: string;
    backgroundOverlayColor: string;
    backgroundMusicPath?: string;
    backgroundVideo: string;
    musicVolume?: number;
};
export declare const MyRedditVideo: React.FC<MyRedditVideoProps>;
export {};
