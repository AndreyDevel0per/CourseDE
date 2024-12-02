/**
 *
 */
export class FilterManager {
  constructor({ containerSelector, onUpdate, filterCfg }) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    this.onUpdate = onUpdate;
    if (filterCfg) {
      this.applyFilters(filterCfg);
    }
    this.#bindFilterEvents();
  }

  #bindFilterEvents() {
    console.debug("события в рамках фильтра change input");

    this.#notifyChange("some data");
  }

  #notifyChange(changeData) {
    console.debug(
      "оповестить другие элементы что у нас произошли измения в фильтреб, changeData"
    );

    if (typeof this.onUpdate == "function") {
      this.onUpdate(changeData);
    }

    const event = new CustomEvent("fileter::changed", {
      detail: changeData,
    });

    this.container.dispatchEvent();
  }

  //обновление UI
  applyFilters(filtersCfg) {
    console.debug(
      "найти все элементы фильтра в рамках контейнера и проставить им значения из конфига"
    );

    this.#notifyChange("some change");
  }
}
