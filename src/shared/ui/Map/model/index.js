import { getExternalScript } from "#shared/lib/utils/getExternalScript";

/**
 *
 */
export class YandexMap {
  constructor({
    containerSelector,
    apiKey,
    center = [55.751574, 37.573856],
    zoom = 10,
    lang = "ru_RU",
    apiUrl = "https://api-maps.yandex.ru/2.1/?apikey",
  }) {
    this.containerSelector = containerSelector;
    this.apiKey = apiKey;
    this.center = center;
    this.zoom = zoom;
    this.lang = lang;
    this.apiUrl = apiUrl;
    this.instance = null;
  }

  createMap() {
    this.instance = new window.ymaps.Map(
      document.querySelector(this.containerSelector),
      {
        center: this.center,
        zoom: this.zoom,
      }
    );
    return this.instance;
  }

  async initMap() {
    try {
      if (window.ymaps) {
        return this.createMap();
      }
      //wait for external script to load
      await getExternalScript(
        `${this.apiUrl}=${this.apiKey}&lang=${this.lang}`
      );
      //wait for map to load
      await new Promise((resolve, reject) => {
        window.ymaps.ready(() => {
          try {
            resolve(this.createMap());
          } catch (e) {
            reject(e);
          }
        });
      });
      //return map if init successfully
      return this.instance;
    } catch (error) {
      console.error("Error occurred while loading API Yandex map:", error);
    }
  }
}
