/**
 * The encyclopedia roster.
 *
 * To add an artist: copy a block, fill it in, done - the grid picks it up.
 * `slug` is reserved for future per-artist pages (/artists/tyler-childers).
 *
 * Photos: do not paste in press or label photos. Use commissioned illustration
 * or properly licensed images only. Until then the cards run type-only.
 */

export type Artist = {
  slug: string;
  name: string;
  tag: string;
  home: string;
  blurb: string;
  startHere: string;
  links?: { label: string; href: string }[];
};

export const artists: Artist[] = [
  {
    slug: "tyler-childers",
    name: "Tyler Childers",
    tag: "Singer-Songwriter",
    home: "Lawrence County, KY",
    blurb:
      "Storytelling built on old-time bones — church, coal, love, and hell all in the same verse.",
    startHere: "“Feathered Indians”",
  },
  {
    slug: "sturgill-simpson",
    name: "Sturgill Simpson",
    tag: "Outlaw / Roots",
    home: "Jackson, KY",
    blurb:
      "Bluegrass upbringing filtered through psychedelic outlaw country — never makes the same record twice.",
    startHere: "“Turtles All the Way Down”",
  },
  {
    slug: "sierra-ferrell",
    name: "Sierra Ferrell",
    tag: "Roots / Americana",
    home: "Charleston, WV",
    blurb:
      "Old-time country, Western swing, and vintage pop filtered through a voice that swings from a whisper to a full-throated belt.",
    startHere: "“The Garden”",
  },
  {
    slug: "charles-wesley-godwin",
    name: "Charles Wesley Godwin",
    tag: "Country / Rock",
    home: "Morgantown, WV",
    blurb:
      "West Virginia coal-country songs with a full-band roar — mountains as main character, not backdrop.",
    startHere: "“Coal Country”",
  },
  {
    slug: "chris-stapleton",
    name: "Chris Stapleton",
    tag: "Country / Soul",
    home: "Johnson County, KY",
    blurb:
      "A Nashville songwriter's pen with a soul singer's voice — the bridge between the holler and the mainstream.",
    startHere: "“Tennessee Whiskey”",
  },
  {
    slug: "billy-strings",
    name: "Billy Strings",
    tag: "Bluegrass",
    home: "Touring flatpicker",
    blurb:
      "Traditional bluegrass picking pushed into jam-band territory — reverent to the form, restless with it.",
    startHere: "“Dust in a Baggie”",
  },
];
