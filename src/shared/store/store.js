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
              // Проверка, если маркер с таким ID уже существует, обновляем его
              const updatedMarkers = state.markers.map((m) =>
                m.id === marker.id ? { ...m, ...marker } : m
              );
              // Если маркер не найден, добавляем новый
              if (updatedMarkers.every((m) => m.id !== marker.id)) {
                updatedMarkers.push(marker);
              }
              return { markers: updatedMarkers };
            });
          },
          //добавить в стор метод для добавления списка меток
          addMarkers: (newMarkers) => {
            set((state) => {
              // Для каждого маркера в списке проверяем, существует ли уже маркер с таким id
              const updatedMarkers = [...state.markers];
              newMarkers.forEach((marker) => {
                // Если маркер с таким id уже существует, обновляем его
                const markerIndex = updatedMarkers.findIndex(
                  (m) => m.id === marker.id
                );
                if (markerIndex !== -1) {
                  updatedMarkers[markerIndex] = {
                    ...updatedMarkers[markerIndex],
                    ...marker,
                  };
                } else {
                  // Если маркера нет, добавляем новый
                  updatedMarkers.push(marker);
                }
              });

              return { markers: updatedMarkers };
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
