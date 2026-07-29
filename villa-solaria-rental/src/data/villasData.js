// Property photos mapping
// HOW TO ADD / CHANGE PHOTOS:
// 1. Place your image files in: public/images/
// 2. Add or update the file paths below (e.g. '/images/my_photo.jpg')
export const propertyPhotos = {
  cover: '/images/terrace.jpg',
  pool: '/images/pool.jpg',
  bedroom: '/images/bedroom.jpg',
  kitchen: '/images/kitchen.jpg',
  bathroom: '/images/bathroom.jpg',
  terrace: '/images/terrace.jpg',
};

// House photos gallery (Pool photo removed from house pictures as requested)
export const housePhotos = [
  '/images/terrace.jpg',
  '/images/bedroom.jpg',
  '/images/kitchen.jpg',
  '/images/bathroom.jpg'
];

export const resortInfo = {
  name: "Dar Ramzi",
  subtitle: "Summer Villa Sanctuary",
  tagline: "4 Private Luxury Houses · 1 Grand Shared Swimming Pool · Midday-to-Midday Stays",
  ownerEmail: "saidi.anas0806@gmail.com",
  poolSpecs: {
    size: "15m x 8m",
    depth: "Shallow to deep gradient",
    heating: "Summer-warmed outdoor pool",
    lighting: "Blue mosaic tile & natural light",
    amenities: ["Lounge Chairs", "Umbrella Shade", "Poolside Seating", "Open Sky Views"]
  },
  checkInRule: "12:00 PM (Midday)",
  checkOutRule: "12:00 PM (Midday)",
  currency: "DT",
  pricePerNight: 300
};

export const villasData = [
  {
    id: "house-1",
    name: "House 1",
    tag: "Terrace & Poolside",
    pricePerNight: 300,
    bedrooms: 2,
    livingRooms: 1,
    kitchens: 1,
    bathrooms: 1,
    sqm: 110,
    maxGuests: 5,
    bedConfiguration: "2 Bedrooms, Living Room, Kitchen, Bathroom",
    description: "Private summer house featuring 2 comfortable bedrooms, living room, full kitchen, bathroom, terrace, and pool access.",
    features: [
      "2 Deluxe Air-Conditioned Bedrooms",
      "Spacious Living Room",
      "Fully Equipped Kitchen",
      "Clean Modern Bathroom with Washing Machine",
      "Private Terrace",
      "Direct Shared Resort Pool Access"
    ],
    accentColor: "#E07A5F",
    image: '/images/terrace.jpg',
    photos: housePhotos
  },
  {
    id: "house-2",
    name: "House 2",
    tag: "Garden & Sunshine",
    pricePerNight: 300,
    bedrooms: 2,
    livingRooms: 1,
    kitchens: 1,
    bathrooms: 1,
    sqm: 110,
    maxGuests: 5,
    bedConfiguration: "2 Bedrooms, Living Room, Kitchen, Bathroom",
    description: "Private summer house featuring 2 comfortable bedrooms, living room, full kitchen, bathroom, terrace, and pool access.",
    features: [
      "2 Deluxe Air-Conditioned Bedrooms",
      "Spacious Living Room",
      "Fully Equipped Kitchen",
      "Clean Modern Bathroom with Washing Machine",
      "Private Terrace",
      "Direct Shared Resort Pool Access"
    ],
    accentColor: "#F4A261",
    image: '/images/bedroom.jpg',
    photos: housePhotos
  },
  {
    id: "house-3",
    name: "House 3",
    tag: "Poolside Breeze",
    pricePerNight: 300,
    bedrooms: 2,
    livingRooms: 1,
    kitchens: 1,
    bathrooms: 1,
    sqm: 110,
    maxGuests: 5,
    bedConfiguration: "2 Bedrooms, Living Room, Kitchen, Bathroom",
    description: "Private summer house featuring 2 comfortable bedrooms, living room, full kitchen, bathroom, terrace, and pool access.",
    features: [
      "2 Deluxe Air-Conditioned Bedrooms",
      "Spacious Living Room",
      "Fully Equipped Kitchen",
      "Clean Modern Bathroom with Washing Machine",
      "Private Terrace",
      "Direct Shared Resort Pool Access"
    ],
    accentColor: "#00B4D8",
    image: '/images/kitchen.jpg',
    photos: housePhotos
  },
  {
    id: "house-4",
    name: "House 4",
    tag: "Summer Oasis",
    pricePerNight: 300,
    bedrooms: 2,
    livingRooms: 1,
    kitchens: 1,
    bathrooms: 1,
    sqm: 110,
    maxGuests: 5,
    bedConfiguration: "2 Bedrooms, Living Room, Kitchen, Bathroom",
    description: "Private summer house featuring 2 comfortable bedrooms, living room, full kitchen, bathroom, terrace, and pool access.",
    features: [
      "2 Deluxe Air-Conditioned Bedrooms",
      "Spacious Living Room",
      "Fully Equipped Kitchen",
      "Clean Modern Bathroom with Washing Machine",
      "Private Terrace",
      "Direct Shared Resort Pool Access"
    ],
    accentColor: "#2D3142",
    image: '/images/bathroom.jpg',
    photos: housePhotos
  }
];
