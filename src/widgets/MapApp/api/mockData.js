export const filterCfg = {
  inputs: {
    search: {
      value: null,
      isChecked: "null",
      isDisabled: "null",
    },
    bars: {
      value: null,
      isChecked: true,
      isDisabled: false,
    },
    restaurant: {
      value: null,
      isChecked: true,
      isDisabled: false,
    },
    club: {
      value: null,
      isChecked: true,
      isDisabled: false,
    },
    theatre: {
      value: null,
      isChecked: true,
      isDisabled: false,
    },
    cinema: {
      value: null,
      isChecked: true,
      isDisabled: false,
    },
  },
};

export const listMarksMockResponse = {
  marks: [
    { id: "1", type: "bars", cords: [55.134, 61.4291] },
    { id: "2", type: "restaurant", cords: [55.143, 61.4241] },
    { id: "3", type: "club", cords: [55.153, 61.4399] },
    { id: "4", type: "theatre", cords: [55.144, 61.4281] },
    { id: "5", type: "cinema", cords: [55.174, 61.4151] },
  ],
};

export const markDetail = [
  {
    id: "1",
    title: "Al Capone",
    type: "bars",
    address: {
      city: "Челябинск",
      house: "12a",
      street: "ул. Братьев Кашириных",
    },
    comment:
      "Хороший бар и караоке, по средам у них специальные акции с коктейлями",
    images: [
      "assets/marksDetail/bar.png",
      "assets/marksDetail/bar.png",
      "assets/marksDetail/bar.png",
      "assets/marksDetail/bar.png",
    ],
  },
  {
    id: "2",
    title: "Al Capone 2",
    type: "restaurant",
    address: {
      city: "Челябинск 2",
      house: "12a",
      street: "ул. Братьев Кашириных 2",
    },
    comment:
      "Хороший бар и караоке, по средам у них специальные акции с коктейлями 2",
    images: [
      "/images/image1.png",
      "/images/image2.png",
      "/images/image3.png",
      "/images/image4.png",
    ],
  },
  {
    id: "3",
    title: "Al Capone 2",
    type: "club",
    address: {
      city: "Челябинск 2",
      house: "12a",
      street: "ул. Братьев Кашириных 2",
    },
    comment:
      "Хороший бар и караоке, по средам у них специальные акции с коктейлями 2",
    images: [
      "/images/image1.png",
      "/images/image2.png",
      "/images/image3.png",
      "/images/image4.png",
    ],
  },
  {
    id: "4",
    title: "Al Capone 3",
    type: "theatre",
    address: {
      city: "Челябинск 2",
      house: "12a",
      street: "ул. Братьев Кашириных 2",
    },
    comment:
      "Хороший бар и караоке, по средам у них специальные акции с коктейлями 2",
    images: [
      "/images/image1.png",
      "/images/image2.png",
      "/images/image3.png",
      "/images/image4.png",
    ],
  },
  {
    id: "5",
    title: "Al Capone 4",
    type: "cinema",
    address: {
      city: "Челябинск 2",
      house: "12a",
      street: "ул. Братьев Кашириных 2",
    },
    comment:
      "Хороший бар и караоке, по средам у них специальные акции с коктейлями 2",
    images: [
      "/images/image1.png",
      "/images/image2.png",
      "/images/image3.png",
      "/images/image4.png",
    ],
  },
];
