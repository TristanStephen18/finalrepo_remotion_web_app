export const bargraphdatasetformat = `
[
    {
        "title": "Example Title",
        "subtitle": "Example Subtitle",
        "data": [
            { "name": "Category 1", "value": 100 },
            { "name": "Category 2", "value": 200 }
        ]
    }
]`;

export const curverlinetrenddatasetformat = `
[
    {
        "title": "Example Title",
        "subtitle": "Example Subtitle",
        "dataType": "$",
        "data": [
            { "label": 0001, "value": 100 },
            { "label": 0002, "value": 200 }
        ]
    }
] 
`;

export const kpiflipdatasetformat = `
[
    {
        "title": "Example KPI Flip Title",
        "subtitle": "Example Subtitle",
        "cardsData": [
            {
                "front": {
                    "label": "Revenue",
                    "value": "12000",
                    "color": "#1976d2"
                },
                "back": {
                    "label": "Growth",
                    "value": "15%",
                    "color": "#43a047"
                }
            },
            {
                "front": {
                    "label": "Profit",
                    "value": "3500",
                    "color": "#d32f2f"
                },
                "back": {
                    "label": "Margin",
                    "value": "29%",
                    "color": "#fbc02d"
                }
            }
        ],
        "cardLabelFontSize": 30,
        "valueFontSize": 46,
        "cardLabelColor": "#333333",
        "cardColorBack": "#e3f2fd",
        "cardColorFront": "#fffde7",
        "cardBorderColor": "#1976d2"
    }
]
`;

export const factcardsDatasetFormat = `
    [
    {
        "intro": {
            "title": "Interesting Science Facts",
            "subtitle": "Discover something new!"
        },
        "outro": {
            "title": "Keep Exploring",
            "subtitle": "There's always more to learn."
        },
        "facts": [
            {
                "title": "Bananas are berries",
                "description": "Botanically, bananas are classified as berries, while strawberries are not."
            },
            {
                "title": "Octopus has three hearts",
                "description": "An octopus has three hearts and blue blood."
            },
            {
                "title": "Honey never spoils",
                "description": "Archaeologists have found edible honey in ancient Egyptian tombs."
            }
        ]
    }
]
`;

export const texttypingdatasetformat = `
[
    {
    lines: ["Dream big, start small", "but start today"],
    category: "wisdom",
    mood: "iconic",
  }
]
`;
