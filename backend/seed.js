// seed.js — inserts sample properties so the homepage has data to show.
// Run once from the backend folder:   node seed.js
import "dotenv/config";
import mongoose from "mongoose";
import { Property } from "./src/Models/propertyModel.js";

// Reusable amenity objects. "name" must match the enum in propertyModel.js
// exactly (note the schema's own typo: "Waching Machine").
const amenity = (name, icon) => ({ name, icon });

const ALL_AMENITIES = [
  amenity("Wifi", "wifi"),
  amenity("Kitchen", "kitchen"),
  amenity("Ac", "air"),
  amenity("Waching Machine", "local_laundry_service"),
  amenity("Tv", "tv"),
  amenity("Pool", "pool"),
  amenity("Free Parking", "garage_home"),
];

// Free, no-auth-required placeholder images (Picsum). Each property gets
// 6 distinct images since the schema requires images.length >= 6.
const imagesFor = (seed) =>
  Array.from({ length: 6 }, (_, i) => ({
    public_id: `${seed}-${i}`,
    url: `https://picsum.photos/seed/${seed}-${i}/900/600`,
  }));

const properties = [
  {
    propertyName: "Carnival Beach Residences",
    description:
      "A breezy beachfront home with wraparound decks, an infinity pool, and sunset views over the water.",
    propertyType: "House",
    roomType: "Entire Home",
    maximumGuest: 6,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[5], ALL_AMENITIES[6]],
    images: imagesFor("carnival-beach"),
    price: 4500,
    address: { area: "Candolim Beach Road", city: "Goa", state: "Goa", pincode: 403515 },
  },
  {
    propertyName: "Opod's Coffee Estate Retreat",
    description:
      "Wake up to misty coffee plantations and forest trails right outside your door at this quiet estate cottage.",
    propertyType: "Guest House",
    roomType: "Entire Home",
    maximumGuest: 4,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[3]],
    images: imagesFor("coffee-estate"),
    price: 2800,
    address: { area: "Pollibetta", city: "Coorg", state: "Karnataka", pincode: 571215 },
  },
  {
    propertyName: "Spring House Orchard Cottage",
    description:
      "A cosy wooden cottage tucked into an apple orchard, with mountain views and crisp Himalayan air.",
    propertyType: "House",
    roomType: "Entire Home",
    maximumGuest: 5,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[2]],
    images: imagesFor("spring-orchard"),
    price: 2000,
    address: { area: "Old Manali", city: "Manali", state: "Himachal Pradesh", pincode: 175131 },
  },
  {
    propertyName: "Olive Coastal Inn",
    description:
      "A palm-lined boutique inn steps from the beach, with a poolside lounge perfect for golden-hour evenings.",
    propertyType: "Hotel",
    roomType: "Room",
    maximumGuest: 3,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[2], ALL_AMENITIES[5], ALL_AMENITIES[6]],
    images: imagesFor("olive-coastal"),
    price: 5200,
    address: { area: "Baga", city: "Goa", state: "Goa", pincode: 403516 },
  },
  {
    propertyName: "Lakeview Pine Chalet",
    description:
      "A timber chalet on the edge of a pine forest, with a private deck overlooking the lake below.",
    propertyType: "House",
    roomType: "Entire Home",
    maximumGuest: 7,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[1], ALL_AMENITIES[3], ALL_AMENITIES[4]],
    images: imagesFor("lakeview-pine"),
    price: 3600,
    address: { area: "Naukuchiatal", city: "Nainital", state: "Uttarakhand", pincode: 263136 },
  },
  {
    propertyName: "Desert Dune Camp Villa",
    description:
      "A luxury tented villa on the edge of the dunes, with private plunge pools and starlit evenings.",
    propertyType: "Flat",
    roomType: "Entire Home",
    maximumGuest: 4,
    amenities: [ALL_AMENITIES[0], ALL_AMENITIES[2], ALL_AMENITIES[5]],
    images: imagesFor("desert-dune"),
    price: 6100,
    address: { area: "Sam Dunes", city: "Jaisalmer", state: "Rajasthan", pincode: 345001 },
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // pre("save") hooks (slug + city lowercasing) only run on .save(),
    // not on insertMany, so we create + save each doc individually.
    for (const data of properties) {
      const doc = new Property(data);
      await doc.save();
      console.log(`Inserted: ${doc.propertyName}`);
    }

    console.log(`\nDone — inserted ${properties.length} properties.`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
