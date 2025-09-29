import React from "react";
export type BarGraphProps = {
    data: {
        name: string;
        value: number | string;
    }[];
    title: string;
    subtitle?: string;
    accent: string;
    backgroundImage: string;
    titleFontColor: string;
    currency?: string;
    titleFontSize?: number;
    subtitleFontSize?: number;
    subtitleColor?: string;
    barHeight?: number;
    barGap?: number;
    barLabelFontSize?: number;
    barValueFontSize?: number;
    fontFamily: string;
};
export declare const BarGraph: React.FC<BarGraphProps>;
