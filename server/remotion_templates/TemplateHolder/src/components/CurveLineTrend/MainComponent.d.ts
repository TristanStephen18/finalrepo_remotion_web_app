import React from "react";
export type DataPoint = {
    label: string | number;
    value: number;
    isHighlight?: boolean;
};
export type TimelineConfig = {
    drawSeconds: number;
    rippleSeconds: number;
    sparkSeconds: number;
};
export type Theme = {
    bgGradient: string;
    gridColor: string;
    lineStops: [string, string, string, string];
    areaTop: string;
    areaBottom: string;
    dot: string;
    dotStroke: string;
    highlightDot: string;
    highlightStroke: string;
    labelText: string;
    axisText: string;
    progressBarTrack: string;
    progressBarFill: string;
    accent: string;
};
export type Flags = {
    showGrid: boolean;
    showArea: boolean;
    showXLabels: boolean;
    showYLabels: boolean;
    showTitle: boolean;
    showSubtitle: boolean;
    showCurrentCard: boolean;
    showProgressBar: boolean;
    showFloatingSymbols: boolean;
};
export type Axis = {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    yTicks: Array<{
        y: number;
        label: string;
    }>;
};
export type GraphProps = {
    title?: string;
    subtitle?: string;
    titleFontSize?: number;
    subtitleFontSize?: number;
    fontFamily?: string;
    dataType?: string;
    currency?: string;
    symbol?: string;
    data: DataPoint[];
    timeline: TimelineConfig;
    theme: Theme;
    flags: Flags;
    axis: Axis;
    revealWindow?: number;
    floatingCount?: number;
    floatingChar?: string;
    valueFormatter?: (value: number) => string;
};
export declare const defaultGraphProps: GraphProps;
export declare const TrendGraphRemotion: React.FC<GraphProps>;
