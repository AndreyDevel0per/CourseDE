import {
  BarIcon,
  CenterMapIcon,
  CinemaIcon,
  MusicIcon,
  RestIcon,
  TheatreIcon,
} from "#shared/ui/Icons/index.js";

export const classNames = {
  ballonContent: "yandexMap__ballonContent",
  ballonLayout: "yandexMap__ballonLayout",
  mark: "yandexMap__mark",
  centerMarker: "yandexMap__centerMarker",
  hint: "yandexMap__hint",
  hidden: "hidden",
};

export const iconShapeCfg = {
  type: "Circle",
  coordinates: [0, 0],
  radius: 40,
};

export const iconsPresets = {
  ["bars"]: BarIcon({ iconColor: "var(--colorRed)" }),
  ["cinema"]: CinemaIcon({ iconColor: "var(--colorGreenDark)" }),
  ["theatre"]: TheatreIcon({ iconColor: "var(--colorPurple)" }),
  ["restaurant"]: RestIcon({ iconColor: "var(--colorOrange)" }),
  ["club"]: MusicIcon({ iconColor: "var(--colorBlue)" }),
  centerMarker: CenterMapIcon({ iconColor: "var(--colorGray)" }),
};

export const mapCfg = {
  apiUrl: "https://api-maps.yandex.ru/2.1/?apikey",
  lang: "ru_RU",
  zoom: 10,
  center: [55.751574, 37.573856],
};

export const yandexMapCustomEventNames = {
  markClicked: "yandexMap::markClicked",
  markCreated: "mark::created",
};
