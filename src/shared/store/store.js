import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

/**
 * Функция для создания Store с уникальным именем
 * @param {string} storageName - Имя хранилища
 * @return {Function} - Функция, возвращающая Store
 */
export const createStore = (storageName) => {
  return create(
    subscribeWithSelector(
      persist(
        (set) => ({
          markers: [],
          activeFilters: {},
          setMarkers: (markers) => set({ markers }),
          addMarker: (marker) => {
            set((state) => {
              // Проверка, есть ли уже маркер с таким ID
              const exists = state.markers.some((m) => m?.id === marker.id);
              if (exists) {
                console.warn(`Marker with ID ${marker.id} already exists.`);
                return state; // Не изменяем состояние, если маркер с таким ID уже существует
              }
              return {
                markers: [...state.markers, marker], // Добавляем новый маркер
              };
            });
          },
          //добавить в стор метод для добавления списка меток
          addMarkers: (newMarkers) => {
            set((state) => {
              const uniqueMarkers = newMarkers.filter(
                (newMarker) =>
                  !state.markers.some((m) => m?.id === newMarker.id)
              );
              return {
                markers: [...state.markers, ...uniqueMarkers],
              };
            });
          },
          removeMarker: (markerId) =>
            set((state) => ({
              markers: state.markers.filter((marker) => marker.id !== markerId),
            })),
          //добавить в стор метод для удаления списка меток
          removeMarkers: (markerIds) =>
            set((state) => ({
              markers: state.markers.filter(
                (marker) => !markerIds.includes(marker.id)
              ),
            })),
          setFilters: (filters) => set({ activeFilters: filters }),
          //добавить в стор метод для очистки фильтров.
          clearFilters: () => set({ activeFilters: {} }),
        }),
        {
          name: storageName, // Используем переданное имя хранилища
          getStorage: () => localStorage,
        }
      )
    )
  );
};
