// Property photos mapping
const getImagePath = (path) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

export const propertyPhotos = {
  cover: getImagePath('images/terrace.jpg'),
  pool: getImagePath('images/pool.jpg'),
  bedroom: getImagePath('images/bedroom.jpg'),
  kitchen: getImagePath('images/kitchen.jpg'),
  bathroom: getImagePath('images/bathroom.jpg'),
  terrace: getImagePath('images/terrace.jpg'),
};

// House photos gallery (Pool photo removed from house pictures as requested)
export const housePhotos = [
  getImagePath('images/terrace.jpg'),
  getImagePath('images/bedroom.jpg'),
  getImagePath('images/kitchen.jpg'),
  getImagePath('images/bathroom.jpg')
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
    image: getImagePath('images/terrace.jpg'),
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
    image: getImagePath('images/bedroom.jpg'),
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
    image: getImagePath('images/kitchen.jpg'),
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
    image: getImagePath('images/bathroom.jpg'),
    photos: housePhotos
  }
];
