export const TemplateNavigator = (template: string) => {
    const leading = "/template";
    switch (template) {
      case "Typing Animation":
        return leading + "/newtexttyping";
      case "Quote Spotlight":
        return leading + "/quotetemplate";
      case "Fact Cards":
        return leading + "/factcards";
      case "Bar Graph Analytics":
        return leading + "/bargraph";
      case "Split Screen":
        return leading + "/splitscreen";
      case "Kpi Flip Cards":
        return leading + "/kpiflipcards";
      case "Ken Burns Carousel":
        return leading + "/kenburnscarousel";
      case "Fake Text Conversation":
        return leading + "/faketextconversation";
      case "Reddit Post Narration":
        return leading + "/redditvideo";
      case "Ai Story Narration":
        return leading + "/storytelling";
      case "Curve Line Trend":
        return leading + "/curvelinetrend";
      default:
        return "/";
    }
  };