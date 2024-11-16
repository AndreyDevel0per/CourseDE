import { YandexMap } from "#shared/ui/Map/model";

/**
 *
 */
export class MapApp {
  constructor(storeService, apiClient, API_ENDPOINTS) {
    this.storeService = storeService;
    this.apiClient = apiClient;

    this.yandexMap = new YandexMap({
      containerSelector: "#map1",
      apiUrl: "https://api-maps.yandex.ru/2.1/?apikey",
      apiKey: "fb0fc35c-8194-4428-82e5-fb1f701058f3",
      lang: "ru_RU",
      center: [55.751574, 37.573856],
      zoom: 10,
    });

    setTimeout(() => {
      this.yandexMap
        .initMap()
        .then(() => {
          console.debug("Карта проинициализированна", this.yandexMap.instance);
        })
        .catch((e) => console.error(e));
    }, 5000);

    this.API_ENDPOINTS = API_ENDPOINTS;
    this.subscribeForStoreService();
  }

  handleMarkersChanged() {
    console.debug("markers changed", this.storeService.getMarkers());
  }

  handleFiltersChanged() {
    console.debug("markers changed", this.storeService.getFilters());
  }

  subscribeForStoreService() {
    this.markerSubscription = this.storeService.subscribeToMarkers(() => {
      this.handleMarkersChanged();
    });
    this.filterSubscription = this.storeService.subscribeToFilters(() => {
      this.handleFiltersChanged();
    });
  }

  unsubscribeFromStoreService() {
    this.markerSubscription?.();
    this.subscribeOnStoreChange?.();
  }

  // в MapApp написать метод для получения информации по меткам с иcпользованием ApiClient  через msw и установке полученных меток в сторе.
  getMarks() {
    return this.apiClient
      .get(this.API_ENDPOINTS.marks.list)
      .then((res) => res?.data?.marks)
      .catch((error) => {
        console.error("Error fetching marks:", error);
        throw error;
      });
  }
}
