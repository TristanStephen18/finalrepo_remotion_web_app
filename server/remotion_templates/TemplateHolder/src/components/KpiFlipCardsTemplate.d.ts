import React from "react";
/** === Types === */
export type CardFace = {
    label: string;
    value: string;
    color: string;
};
export type CardData = {
    front: CardFace;
    back: CardFace;
};
export type KpiFlipCardsProps = {
    backgroundImage?: string;
    title?: string;
    titleFontSize?: number;
    titleFontColor?: string;
    titleFontFamily?: string;
    subtitle?: string;
    subtitleFontSize?: number;
    subtitleFontColor?: string;
    subtitleFontFamily?: string;
    cardsData: CardData[];
    cardWidth?: number;
    cardHeight?: number;
    cardBorderRadius?: number;
    cardBorderColor?: string;
    cardLabelColor?: string;
    cardLabelFontSize?: number;
    cardContentFontFamily?: string;
    cardGrid?: {
        rows: number;
        cols: number;
    };
    delayStart?: number;
    delayStep?: number;
    cardColorFront?: string;
    cardColorBack: string;
    valueFontSize?: number;
};
declare const KpiFlipCards: React.FC<KpiFlipCardsProps>;
export default KpiFlipCards;
