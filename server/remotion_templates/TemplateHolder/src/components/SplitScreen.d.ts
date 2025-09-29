import React from "react";
export type SplitScreenProps = {
    topVideoUrl: string;
    bottomVideoUrl: string;
    topHeightPercent?: number;
    bottomHeightPercent?: number;
    topOpacity?: number;
    bottomOpacity?: number;
    topVolume?: number;
    bottomVolume?: number;
    swap?: boolean;
    transitionDuration?: number;
    slideOffsetPercent?: number;
};
export declare const SplitScreen: React.FC<SplitScreenProps>;
