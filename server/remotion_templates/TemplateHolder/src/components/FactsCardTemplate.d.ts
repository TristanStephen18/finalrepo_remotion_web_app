import React from "react";
type Slide = {
    title: string;
    subtitle?: string;
    description?: string;
};
type FactsCardVideoProps = {
    intro: Slide;
    outro: Slide;
    facts: Slide[];
    backgroundImage: string;
    fontSizeTitle: number;
    fontSizeSubtitle: number;
    fontFamilyTitle: string;
    fontFamilySubtitle: string;
    fontColorTitle: string;
    fontColorSubtitle: string;
};
export declare const FactsCardVideo: React.FC<FactsCardVideoProps>;
export {};
