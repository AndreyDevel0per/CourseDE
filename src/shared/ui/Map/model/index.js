import Swiper from "swiper";
import { Pagination } from "swiper/modules";
import {
  iconsPresets,
  classNames as defaultClassNames,
  yandexMapCustomEventNames,
  iconShapeCfg as defaultIconShapeCfg,
} from "../config/constants.js";
import { checkMapInstance } from "../config/lib/checkMapInstance.js";
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
    this.apiKey = apiKey;
    this.center = center;
    this.zoom = zoom;
    this.lang = lang;
    this.apiUrl = apiUrl;
    this.instance = null;
    this.iconsPresets = iconsPresets;
    this.classNames = classNames ?? defaultClassNames;
    this.currentBalloon = null;
    this.currentMarkerIdOpen = null;
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
      document.querySelector(this.containerSelector),
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
      }
    );

    placemark.events.add("click", (event) => {
      if (onClick && typeof onClick === "function") onClick(id, event);
    });

    placemark.events.add("balloonopen", () => {
      // Если на карте уже открыт балун, закрываем его
      if (this.currentBalloon) {
        this.currentBalloon.balloon.close();
      }
      // Обновляем ссылку на текущий открытый балун
      this.currentBalloon = placemark;
      this.currentMarkerIdOpen = id;
    });

    placemark.events.add("balloonclose", () => {
      this.currentBalloon = null;
      this.currentMarkerIdOpen = null;
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

    document.dispatchEvent(customEvent);
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
  getLayoutContentForBallon(info) {
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
    //TODO накинуть стили
    return `<div class="swiper">
              <div class="swiper-wrapper">
                ${slides}
              </div>
              <div class="swiper-pagination"></div>
            </div>
            <h3 class="yandexMap__header">${title}</h3>
            <div>${this.iconsPresets[type]}</div>
            <p>${city},${street}, ${house}</p>
            `;
  }

  //рендерим метки
  @checkMapInstance
  renderMarks(marks) {
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

  //закрыть балун по клику на карту
  handleCloseCurrentBallon() {
    if (this.currentBalloon) {
      this.currentBalloon.balloon.close();
    }
    this.currentBalloon = null;
    this.currentMarkerIdOpen = null;
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

  createCenterMarker() {
    const mark = document.createElement("div");
    mark.innerHTML;
    return `
    <div class="yandexMap__centerMarker">center</div>
    `;
  }

  //добавляем слушатель на клик по карте для закрытия баллуна
  #bindEvents() {
    this.instance.events.add("click", () => {
      this.handleCloseCurrentBallon(); //TODO: а надо ли? надо подумать
    });
  }
}
