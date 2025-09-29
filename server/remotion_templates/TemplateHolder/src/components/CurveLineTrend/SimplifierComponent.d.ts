import React from "react";
import { type DataPoint } from "./MainComponent";
export type SimpleGraphProps = {
    title: string;
    subtitle?: string;
    titleFontSize?: number;
    subtitleFontSize?: number;
    fontFamily?: string;
    data: DataPoint[];
    dataType?: "$" | "%" | "#" | "number";
    preset?: "dark" | "light" | "corporate" | "playful" | "midnight" | "slate" | "aurora" | "prestige" | "graphite" | "horizon" | "crimson" | "ruby" | "emerald" | "amber" | "moss" | "sunset";
    backgroundImage?: string;
    animationSpeed?: "slow" | "normal" | "fast";
    minimalMode?: boolean;
};
export declare const SimpleTrendGraph: React.FC<SimpleGraphProps>;
