import { useState } from "react";
import type { BargraphData } from "../../components/remotion_compositions/BarGraphTemplate";

export function barGraphConfigs () {
    const [templateName, setTemplateName] = useState(
        "🎬 Bar Graph Analytics Template"
      );
    
      const [title, setTitle] = useState("Your title");
      const [subtitle, setSubtitle] = useState("Your subtitle");
      const [titleFontSize, setTitleFontSize] = useState(80);
      const [subtitleFontSize, setSubtitleFontSize] = useState(50);
      const [titleFontColor, setTitleFontColor] = useState("white");
      const [subtitleFontColor, setSubtitleFontColor] = useState("white");
      const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
      const [accent, setAccent] = useState("#3B82F6");
    
      // data
      const [data, setData] = useState<BargraphData[]>([
        { name: "Data1", value: 124500 },
        { name: "Data2", value: 110200 },
        { name: "Data3", value: 87300 },
        { name: "Data4", value: 76500 },
        { name: "Data5", value: 54200 },
        { name: "Data6", value: 49800 },
      ]);
    
      // bargraph config
      const [barHeight, setBarHeight] = useState(100);
      const [barGap, setBarGap] = useState(36);
      const [barLabelFontSize, setBarLabelFontSize] = useState(36);
      const [barValueFontSize, setBarValueFontSize] = useState(36);
    
      const [activeSection, setActiveSection] = useState<
        "title" | "graph" | "data" | "background"
      >("title");
    
      const [duration, setDuration] = useState(8);

      return {
        templateName, setTemplateName,
        title, setTitle,
        subtitle, setSubtitle,
        titleFontSize, setTitleFontSize,
        subtitleFontSize, setSubtitleFontSize,
        titleFontColor, setTitleFontColor,
        subtitleFontColor, setSubtitleFontColor,
        fontFamily, setFontFamily,
        accent, setAccent,
        data, setData,
        barHeight, setBarHeight,
        barGap, setBarGap,
        barLabelFontSize, setBarLabelFontSize,
        barValueFontSize, setBarValueFontSize,
        activeSection, setActiveSection,
        duration, setDuration
      }
}