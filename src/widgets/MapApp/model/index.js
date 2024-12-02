import { API_ENDPOINTS } from "#shared/config/constants";
import { getDebouncedFn } from "#shared/lib/utils";
import { FilterManager } from "#shared/ui/Filter/model";
import { yandexMapCustomEventNames } from "#shared/ui/Map/config/constants";
import { YandexMap } from "#shared/ui/Map/model";

/**
 *
 */
export class MapApp {
  constructor(storeService, apiClient) {
    this.storeService = storeService;
    this.apiClient = apiClient;
    this.apiGeoUrl = "https://geocode-maps.yandex.ru/1.x/?apikey";
    this.apiKey = "fb0fc35c-8194-4428-82e5-fb1f701058f3";
    this.inputAddress = document.querySelector("#searchAddress");

    this.yandexMap = new YandexMap({
      containerSelector: "#map1",
      apiUrl: "https://api-maps.yandex.ru/2.1/?apikey",
      apiKey: this.apiKey,
      lang: "ru_RU",
      center: [56.5, 57.9],
      zoom: 10,
    });

    this.loadAndUpdateFilters();
    this.filterManager = new FilterManager({
      containerSelector: `[data-js-filter="1"]`,
      onUpdate: this.handleFilterChange,
    });
    this.yandexMap
      .initMap()
      .then(async () => {
        this.yandexMap.renderMarks(this.storeService.getMarkers()); //render marks from store
        const marks = await this.getMarks();
        this.storeService.updateStore("setMarkers", marks);
      })
      .catch((e) => console.error(e));

    this.#bindYandexMapEvents();
    this.subscribeForStoreService();
    this.#bindEvents();
  }

  async handleMarkerClick(e) {
    const {
      detail: { id, mark },
    } = e;

    try {
      const res = await this.apiClient.get(API_ENDPOINTS.marks.detail, {
        id: id,
      });
      const layout = this.yandexMap.getLayoutContentForBallon(res.data);
      this.yandexMap.updateBallonContent(id, mark, layout);
    } catch (e) {
      console.error(e);
    }
  }

  handleMarkersChangedInStore() {
    console.debug("markers changed", this.storeService.getMarkers());
    this.yandexMap.renderMarks(this.storeService.getMarkers());
  }

  handleFiltersChangedInStore() {
    console.debug("filters changed", this.storeService.getFilters());
  }

  //запрос для центрирования карты
  handleCenterMapByAddress(address) {
    console.debug(address);
    fetch(
      `${this.apiGeoUrl}=${this.apiKey}&geocode=${encodeURIComponent(address)}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const coords =
          data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.Point?.pos?.split(
            " "
          );
        if (coords) {
          const lat = parseFloat(coords[1]);
          const lon = parseFloat(coords[0]);
          this.yandexMap.centerMapByCords([lat, lon]);
        }
      })
      .catch((e) => console.error(e));
  }

  subscribeForStoreService() {
    this.markerSubscription = this.storeService.subscribeToMarkers(() => {
      this.handleMarkersChangedInStore();
    });
    this.filterSubscription = this.storeService.subscribeToFilters(() => {
      this.handleFiltersChangedInStore();
    });
  }

  unsubscribeFromStoreService() {
    this.markerSubscription?.();
    this.subscribeOnStoreChange?.();
  }

  handleFilterChange(changeData) {
    console.debug(
      "обращаться к стору и обновлять его данные активгых фильтров"
    );
  }

  loadAndUpdateFilters() {
    (async () => {
      try {
        const filters = await this.getFiltersCfg();
        this.storeService.updateStore("setFilters", filters);
        this.filterManager.applyFilters(filters);
      } catch (error) {
        console.error("Ошибка при получении конфигурации фильтров:", error);
      }
    })();
  }

  // в MapApp написать метод для получения информации по меткам с иcпользованием ApiClient  через msw и установке полученных меток в сторе.
  async getMarks() {
    return this.apiClient
      .get(API_ENDPOINTS.marks.list)
      .then((res) => res?.data?.marks)
      .catch((error) => {
        console.error("Error fetching marks:", error);
        throw error;
      });
  }

  async getFiltersCfg() {
    return this.apiClient
      .get(API_ENDPOINTS.config.list)
      .then((res) => res?.data);
  }

  //слушаем событие клика по метке
  #bindYandexMapEvents() {
    this.yandexMap?.containerMap?.addEventListener(
      yandexMapCustomEventNames.markClicked,
      (e) => {
        this.handleMarkerClick(e);
      }
    );
  }

  #bindEvents() {
    const debouncedHandleMapByAddress = getDebouncedFn(
      this.handleCenterMapByAddress,
      1000
    ).bind(this);
    this.inputAddress &&
      this.inputAddress.addEventListener("input", (e) => {
        debouncedHandleMapByAddress(e.target.value);
      });
  }
}
