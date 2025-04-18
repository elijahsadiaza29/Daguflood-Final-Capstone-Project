// mapConfig.ts

import { LatLng } from "./types";

export const mapDefaultCenter: LatLng = {
  lat: 16.0437695481807,
  lng: 120.33361182786703,
};
// export const darkMapStyle = [
//   {
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#1d2c4d",
//       },
//     ],
//   },
//   {
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#8ec3b9",
//       },
//     ],
//   },
//   {
//     elementType: "labels.text.stroke",
//     stylers: [
//       {
//         color: "#1a3646",
//       },
//     ],
//   },
//   {
//     featureType: "administrative",
//     elementType: "geometry",
//     stylers: [
//       {
//         visibility: "off",
//       },
//     ],
//   },
//   {
//     featureType: "administrative.country",
//     elementType: "geometry.stroke",
//     stylers: [
//       {
//         color: "#4b6878",
//       },
//     ],
//   },
//   {
//     featureType: "administrative.land_parcel",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#64779e",
//       },
//     ],
//   },
//   {
//     featureType: "administrative.province",
//     elementType: "geometry.stroke",
//     stylers: [
//       {
//         color: "#4b6878",
//       },
//     ],
//   },
//   {
//     featureType: "landscape.man_made",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#1a2636",
//       },
//     ],
//   },
//   {
//     featureType: "landscape.man_made",
//     elementType: "geometry.stroke",
//     stylers: [
//       {
//         color: "#334e87",
//       },
//     ],
//   },
//   {
//     featureType: "landscape.natural",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#023e58",
//       },
//     ],
//   },
//   {
//     featureType: "landscape.natural",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#1a2636",
//       },
//     ],
//   },
//   {
//     featureType: "poi",
//     stylers: [
//       {
//         visibility: "off",
//       },
//     ],
//   },
//   {
//     featureType: "poi",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#283d6a",
//       },
//     ],
//   },
//   {
//     featureType: "poi",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#6f9ba5",
//       },
//     ],
//   },
//   {
//     featureType: "poi",
//     elementType: "labels.text.stroke",
//     stylers: [
//       {
//         color: "#1d2c4d",
//       },
//     ],
//   },
//   {
//     featureType: "poi.park",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#023e58",
//       },
//     ],
//   },
//   {
//     featureType: "poi.park",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#3C7680",
//       },
//     ],
//   },
//   {
//     featureType: "road",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#304a7d",
//       },
//     ],
//   },
//   {
//     featureType: "road",
//     elementType: "labels.icon",
//     stylers: [
//       {
//         visibility: "off",
//       },
//     ],
//   },
//   {
//     featureType: "road",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#98a5be",
//       },
//     ],
//   },
//   {
//     featureType: "road",
//     elementType: "labels.text.stroke",
//     stylers: [
//       {
//         color: "#1d2c4d",
//       },
//     ],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#2c6675",
//       },
//     ],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#4d6a8c",
//       },
//     ],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry.stroke",
//     stylers: [
//       {
//         color: "#255763",
//       },
//     ],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#b0d5ce",
//       },
//     ],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "labels.text.stroke",
//     stylers: [
//       {
//         color: "#023e58",
//       },
//     ],
//   },
//   {
//     featureType: "transit",
//     stylers: [
//       {
//         visibility: "off",
//       },
//     ],
//   },
//   {
//     featureType: "transit",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#98a5be",
//       },
//     ],
//   },
//   {
//     featureType: "transit",
//     elementType: "labels.text.stroke",
//     stylers: [
//       {
//         color: "#1d2c4d",
//       },
//     ],
//   },
//   {
//     featureType: "transit.line",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#283d6a",
//       },
//     ],
//   },
//   {
//     featureType: "transit.station",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#3a4762",
//       },
//     ],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry",
//     stylers: [
//       {
//         color: "#0e1626",
//       },
//     ],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry.fill",
//     stylers: [
//       {
//         color: "#07080d",
//       },
//     ],
//   },
//   {
//     featureType: "water",
//     elementType: "labels.text.fill",
//     stylers: [
//       {
//         color: "#4e6d70",
//       },
//     ],
//   },
// ];

export const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a2636"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#151c24"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#15191e"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#15191e"
      }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#1f2b37"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2b37"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#4d6b8c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#4d6b8c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4d6b8c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#1f2b37"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2b37"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#2a3545"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#000000"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#1d242a"
      }
    ]
  }
];

export const lightMapStyle = [
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

export const LocationBounds = {
  north: 16.075,
  south: 16.022,
  west: 120.292,
  east: 120.365,
};
