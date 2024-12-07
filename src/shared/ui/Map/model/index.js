import Swiper from "swiper";
import { Pagination } from "swiper/modules";
import {
  iconsPresets,
  classNames as defaultClassNames,
  yandexMapCustomEventNames,
  iconShapeCfg as defaultIconShapeCfg,
} from "../config/constants.js";
import { checkMapInstance } from "../config/lib/checkMapInstance.js";
import { DeleteMarkBtn } from "#features/Marks/DeleteMark/index.js";
import { UpdateMarkBtn } from "#features/Marks/UpdateMark/index.js";
import { getExternalScript } from "#shared/lib/utils/getExternalScript";
import { Spinner } from "#shared/ui/Spinner/index.js";

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
    classNames,
    iconShapeCfg,
  }) {
    this.containerSelector = containerSelector;
    this.containerMap = document.querySelector(this.containerSelector);
    this.apiKey = apiKey;
    this.center = center;
    this.zoom = zoom;
    this.lang = lang;
    this.apiUrl = apiUrl;
    this.instance = null;
    this.centerMarker = null;
    this.hint = null;
    this.iconsPresets = iconsPresets;
    this.classNames = classNames ?? defaultClassNames;
    this.iconShapeCfg = iconShapeCfg ?? defaultIconShapeCfg;
    this.attrs = {
      ballon: "data-js-ballon",
    };
  }

  //внешняя обертка баллуна
  @checkMapInstance
  getBallonLayout() {
    const ballonLayout = window.ymaps.templateLayoutFactory.createClass(
      `<div class="${this.classNames.ballonLayout}">$[[options.contentLayout observeSize]]</div>`,
      {
        build: function () {
          ballonLayout.superclass.build.call(this);
        },
        clear: function () {
          ballonLayout.superclass.clear.call(this);
        },
      }
    );
    return ballonLayout;
  }

  //внутренний контент баллуна
  @checkMapInstance
  getBallonContent({ id, children }) {
    const linkToCreateSwiperFn = this.createSwiper;
    const ballonContent = window.ymaps.templateLayoutFactory.createClass(
      `<div class="${this.classNames.ballonContent}" ${this.attrs.ballon}=${id}> 
            ${children}
        </div>`,
      {
        build: function () {
          ballonContent.superclass.build.call(this);
          linkToCreateSwiperFn(id);
        },
        clear: function () {
          ballonContent.superclass.clear.call(this);
        },
      }
    );
    return ballonContent;
  }

  createSwiper(id) {
    try {
      const ballonContainer = document.querySelector(
        `[data-js-ballon="${id}"]`
      );

      const swiperEl = ballonContainer.querySelector(".swiper");
      const swiperPagination =
        ballonContainer.querySelector(".swiper-pagination");

      if (swiperEl && swiperPagination) {
        new Swiper(swiperEl, {
          slidesPerView: 1,
          direction: "horizontal",
          modules: [Pagination],
          pagination: {
            el: swiperPagination,
            clickable: true,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  //верстка метки
  @checkMapInstance
  getMarkerLayout(typeMarker) {
    const customLayout = window.ymaps.templateLayoutFactory.createClass(
      `<div class="${this.classNames.mark}">
         ${this.iconsPresets[typeMarker] ? this.iconsPresets[typeMarker] : typeMarker}
       </div>`
    );

    return customLayout;
  }

  //создаем карту
  #createMap() {
    this.instance = new window.ymaps.Map(
      this.containerMap,
      {
        center: this.center,
        zoom: this.zoom,
        type: "yandex#map",
        controls: [],
      },
      {
        suppressMapOpenBlock: true,
      }
    );
    this.showHint();
    setTimeout(() => {
      this.hideHint();
      this.createCenterMarker();
    }, 5000);
    this.#bindEvents();
    return this.instance;
  }

  //инициализируем карту
  async initMap() {
    try {
      if (window.ymaps) {
        return this.#createMap();
      }
      //wait for external script to load
      await getExternalScript(
        `${this.apiUrl}=${this.apiKey}&lang=${this.lang}`
      );
      //wait for map to load
      await new Promise((resolve, reject) => {
        window.ymaps.ready(() => {
          try {
            resolve(this.#createMap());
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

  //для декоратора
  isExistMapInstance() {
    if (!this.instance) {
      console.warn("Карта не инициализированна");
      return false;
    }
    return true;
  }

  //создаем метку для рендера
  @checkMapInstance
  addMark({ id, cords, type: typeMarker, onClick } = {}) {
    const placemark = new window.ymaps.Placemark(
      cords,
      { id },
      {
        balloonLayout: this.getBallonLayout(), //внешняя разметка баллуна метки
        //внутренняя разметка баллуна метки
        balloonContentLayout: this.getBallonContent({
          id,
          children: Spinner(),
        }),
        hasBalloon: true,
        iconLayout: this.getMarkerLayout(typeMarker), //разметка метки
        iconShape: this.iconShapeCfg,
        hideIconOnBalloonOpen: false,
      }
    );

    placemark.events.add("click", (event) => {
      if (this.instance.balloon.isOpen()) {
        return;
      }
      if (onClick && typeof onClick === "function") onClick(id, event);
    });

    this.instance.geoObjects.add(placemark);
  }

  handleMarkerClick(id, e) {
    const targetPlacemark = e.get("target");

    const customEvent = new CustomEvent(yandexMapCustomEventNames.markClicked, {
      detail: {
        id,
        mark: targetPlacemark,
      },
    });

    this.containerMap.dispatchEvent(customEvent);
  }

  //изменение баллуна при клике
  updateBallonContent(id, mark, info) {
    mark.options.set(
      "balloonContentLayout",
      this.getBallonContent({
        id,
        children: `${info}`,
      })
    );
  }

  //измененная верстка при клике
  getLayoutContentForBallon(id, info) {
    const {
      type,
      title,
      address: { city, house, street },
    } = info;
    const slides = info.images
      .map(
        (image, index) =>
          `<div class="swiper-slide"><img src="${image}" alt="${info.title} - Slide ${index + 1}"></div>`
      )
      .join("");
    //TODO накинуть стили и вынести в отдельный entities/ballon
    return `<div class="swiper">
              <div class="swiper-wrapper">
                ${slides}
              </div>
              <div class="swiper-pagination"></div>
            </div>
            <h3 class="yandexMap__header">${title}</h3>
            <div>${this.iconsPresets[type]}</div>
            <p>${city},${street}, ${house}</p>
            ${UpdateMarkBtn({ markInfo: info })}
            ${DeleteMarkBtn({ markId: id })}
            `;
  }

  //рендерим метки
  @checkMapInstance
  renderMarks(marks) {
    this.clearMap();
    marks.forEach((mark) => {
      this.addMark({
        id: mark.id,
        cords: mark.cords,
        type: mark.type,
        onClick: (id, e) => {
          this.handleMarkerClick(id, e);
        },
      });
    });
  }

  clearMap() {
    this.instance.geoObjects.removeAll();
  }

  //центрируем карту по координатам
  @checkMapInstance
  centerMapByCords(cords, zoom = 15) {
    try {
      this.instance.setCenter(cords, zoom);
    } catch (e) {
      console.error(e);
    }
  }

  //центральная метка на карте
  @checkMapInstance
  createCenterMarker() {
    try {
      const centerMarker = document.createElement("div");
      centerMarker.className = this.classNames["centerMarker"];
      centerMarker.innerHTML = this.iconsPresets["centerMarker"];
      this.containerMap.appendChild(centerMarker);
      this.centerMarker = centerMarker;
    } catch (e) {
      console.error("Ошибка при добавлении центральной метки:", e);
    }
  }

  showHint() {
    try {
      const hint = document.createElement("div");
      hint.className = this.classNames["hint"];
      hint.innerHTML = `
      ${this.iconsPresets["centerMarker"]}
      <div class="yandexMap__text">
        <h3>Адрес можно выбрать на карте</h3>
        <span>Перетаскивайте метку или кликайте по карте</span>
      </div>
      `;
      this.containerMap.appendChild(hint);
      this.hint = hint;
    } catch (e) {
      console.error("Ошибка при создании подсказки", e);
    }
  }

  hideHint() {
    this.hint.className = this.classNames["visuallyHidden"];
    this.hint = null;
  }

  //добавляем слушатель на клик по карте для закрытия баллуна
  #bindEvents() {
    this.instance.events.add("click", (e) => {
      this.instance.balloon.close();
    });
  }
}
