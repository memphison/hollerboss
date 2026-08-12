/**
 * data/venues.ts
 *
 * Venue records with real coordinates, so the Route Sheet can calculate
 * actual distance from a fan's zip code instead of a guess.
 *
 * Add a venue once, reuse its `slug` across as many shows as play there.
 * Coordinates here are the venue's approximate map center — accurate
 * enough for "how far away is this" (haversine), not for driving directions.
 */

export type Venue = {
  slug: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
};

export const venues: Venue[] = [
  {
    slug: "the-wiltern",
    name: "The Wiltern",
    city: "Los Angeles",
    state: "CA",
    lat: 34.0619,
    lng: -118.309,
  },
  {
    slug: "santa-barbara-bowl",
    name: "Santa Barbara Bowl",
    city: "Santa Barbara",
    state: "CA",
    lat: 34.4381,
    lng: -119.7062,
  },
  {
    slug: "grand-targhee-resort",
    name: "Grand Targhee Resort",
    city: "Alta",
    state: "WY",
    lat: 43.7876,
    lng: -110.9585,
  },
  {
    slug: "dillon-amphitheater",
    name: "Dillon Amphitheater",
    city: "Dillon",
    state: "CO",
    lat: 39.6297,
    lng: -106.0447,
  },
  {
    slug: "red-rocks-amphitheatre",
    name: "Red Rocks Amphitheatre",
    city: "Morrison",
    state: "CO",
    lat: 39.6654,
    lng: -105.2057,
  },
  {
    slug: "the-momentary",
    name: "The Momentary",
    city: "Bentonville",
    state: "AR",
    lat: 36.3559,
    lng: -94.2088,
  },
  {
    slug: "avondale-brewing",
    name: "Avondale Brewing Co.",
    city: "Birmingham",
    state: "AL",
    lat: 33.5445,
    lng: -86.742,
  },
  {
    slug: "wv-state-fair",
    name: "State Fair of West Virginia",
    city: "Lewisburg",
    state: "WV",
    lat: 37.7929,
    lng: -80.4487,
  },
  {
    slug: "landmark-credit-union-live",
    name: "Landmark Credit Union Live",
    city: "Milwaukee",
    state: "WI",
    lat: 43.0349,
    lng: -87.9145,
  },
  {
    slug: "mn-state-fair",
    name: "Minnesota State Fair",
    city: "Falcon Heights",
    state: "MN",
    lat: 44.9821,
    lng: -93.1708,
  },
];
