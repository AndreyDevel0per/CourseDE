import { getGeneratedAttrs } from "#shared/lib/utils";

/**
 * Компонент карты
 * @return {String}
 */
export const Map = ({ extraClasses = [], extraAttrs = [] } = {}) => {
  return `<div id="map1" class="yandexMap ${extraClasses?.join(" ")}" ${getGeneratedAttrs(extraAttrs)}></div>`;
};
