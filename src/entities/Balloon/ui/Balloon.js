/**
 * Компонент баллуна
 * @return {string}
 */
export const Balloon = ({
  id,
  info,
  iconsPresets,
  UpdateFeatureSlot,
  DeleteFeatureSlot,
}) => {
  const {
    type,
    title,
    comment,
    address: { house, street },
  } = info;
  const slides = info.images
    .map(
      (image, index) =>
        `<div class="swiper-slide"><img src="${image}" alt="${info.title} - Slide ${index + 1}"></div>`
    )
    .join("");

  return ` <div class="balloon">
            <div class="swiper">
              <div class="swiper-wrapper">
                ${slides}
              </div>
              <div class="swiper-pagination"></div>
            </div>
            <div class="balloon__text">
              <h3 class="balloon__header">${title}</h3>
              <div class="balloon__type">
                <div>${iconsPresets[type]}</div>
                <div>${type}</div>
              </div>
              <p class="balloon__address">${street}, ${house}</p>
              <div class="balloon__comment">${comment}</div>
            </div>
            <div class="balloon__buttons">
              ${UpdateFeatureSlot({ markInfo: info })}
              ${DeleteFeatureSlot({ markId: id })}
            </div>
          </div>
          
          `;
};
