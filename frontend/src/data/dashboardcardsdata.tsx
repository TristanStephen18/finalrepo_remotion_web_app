export const templates = [
  "Quote Spotlight",
  "Typing Animation",
  "Fact Cards",
  "Bar Graph Analytics",
  "Split Screen",
];

export const templateCategories = {
  Text: [
    {
      name: "Quote Spotlight",
      description: "Highlight quotes with beautiful transitions.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4",
    },
    {
      name: "Typing Animation",
      description: "Simulates live typing animations for text intros.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/TypingAnimation_jlvcyk.mp4"
    },
  ],
  Analytics: [
    {
      name: "Bar Graph Analytics",
      description: "Visualize data with animated bar graphs.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4",
    },
    {
      name: "Kpi Flip Cards",
      description: "Show KPIs with flipping card animations.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KpiFlipCards_yla74f.mp4",
    },
    {
      name: "Curve Line Trend",
      description: "Visualize time series data using animated trend line graphs.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794251/CurveLineTrend_ymo1il.mp4",
    }
  ],
  Layout: [
    {
      name: "Split Screen",
      description: "Compare visuals side by side with smooth transitions.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760964357/splitscreenVideo-1760963733064_dkczll.mp4"
    },
    {
      name: "Fact Cards",
      description: "Show multiple facts in card-style animations.",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794239/FactCards_rgtdfm.mp4",
    },
    {
      name: "Ken Burns Carousel",
      description: "Display images in a ken burns carousel type animation",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KenBurnsCarousel_jpnilj.mp4"
    },
  ],
  Voiceovers: [
    {
      name: "Fake Text Conversation",
      description: "Create fake text conversation using ai voice overs",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4"
    },
    {
      name: "Reddit Post Narration",
      description: "Convert reddit posts into entertaining ai voice over narration using only posts links",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794245/RedditPostNarration_x9rs2u.mp4",
    },
    {
      name: "Ai Story Narration",
      description: "Make your story into an ai narration video or have the ai create a story to narrate for you",
      url: "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/AiStoryNarration_h7bq5x.mp4"
    },
  ]
};


export function templateUrlFinder (template: string){
  switch(template){
    case "Ai Story Narration":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/AiStoryNarration_h7bq5x.mp4";
    case "Reddit Post Narration":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794245/RedditPostNarration_x9rs2u.mp4";
    case "Fake Text Conversation":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4";
    case "Ken Burns Carousel":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KenBurnsCarousel_jpnilj.mp4";
      case "Fact Cards":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794239/FactCards_rgtdfm.mp4";
      case "Split Screen":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760964357/splitscreenVideo-1760963733064_dkczll.mp4";
      case "Curve Line Trend":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794251/CurveLineTrend_ymo1il.mp4";
      case "Kpi Flip Cards":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KpiFlipCards_yla74f.mp4";
      case "Bar Graph Analytics":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4";
      case "Typing Animation":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/TypingAnimation_jlvcyk.mp4";
    default:
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4";
  }
}
