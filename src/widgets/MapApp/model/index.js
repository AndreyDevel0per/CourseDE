import { StoreService } from "#shared/lib/services/StoreService";

/**
 *
 */
export class MapApp {
  constructor(storageName, apiClient, API_ENDPOINTS) {
    this.storeService = new StoreService(storageName);
    this.apiClient = apiClient;
    this.API_ENDPOINTS = API_ENDPOINTS;
    this.subscribeForStoreService();

    console.debug(
      "Тут будем реализовывать логику нашего виджета, вот готовый стор сервис ->",
      this.storeService
    );

    setTimeout(() => {
      this.storeService.updateStore("addMarkers", [
        { id: "9", value: "Marker 1" },
        { id: "8", value: "Marker 2" },
        { id: "7", value: "Marker 3" },
      ]);
      //заносим полученные метки в store
      this.getMarks().then((marks) => {
        this.storeService.updateStore("addMarkers", marks);
      });
      this.storeService.updateStore("removeMarkers", ["90", "91"]);
    }, 3000);
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
