import { Button } from "#shared/ui/Button";
import { CustomSelect } from "#shared/ui/CustomSelect/index";
import {
  CinemaIcon,
  RestIcon,
  MusicIcon,
  TheatreIcon,
  BarIcon,
  SaveIcon,
} from "#shared/ui/Icons/index";

/**
 * Контент модалки обновления метки
 * @return
 */
export const getUpdateMarkModalContent = ({
  markInfo,
  url,
  method = "post",
  iconColor = "var(--colorBlack)",
}) => {
  return `<div class="updateModalContent" >
  <form class="updateModalContent__container" data-js-form=${JSON.stringify({ url, method, showModalAfterSuccess: "#modalSuccess" })}>
    <h3 class="updateModalContent__header">Редактировать метку</h3>
    <div class="updateModalContent__address">${markInfo.address.street} ${markInfo.address.house}</div>
    <div>
      <div class="updateModalContent__type">
        <h4>Тип метки</h4>
        <div class="updateModalContent__select">
        ${CustomSelect({
          extraAttrs: [
            {
              name: "data-js-update-mark-info-select-type",
              value: markInfo.id,
            },
            {
              name: "name",
              value: "typeMark",
            },
          ],
          cfg: {
            preset: "default",
            itemSelectText: "",
            searchEnabled: false,
            choices: [
              {
                value: "Бар",
                label: "Бар",
                selected: markInfo.type === "bars",
                customProperties: {
                  icon: BarIcon({ iconColor: "var(--colorRed)" }),
                },
              },
              {
                value: "Ресторан",
                label: "Ресторан",
                selected: markInfo.type === "restaurant",
                customProperties: {
                  icon: RestIcon({ iconColor: "var(--colorOrange)" }),
                },
              },
              {
                value: "Ночной клуб",
                label: "Ночной клуб",
                selected: markInfo.type === "trk",
                customProperties: {
                  icon: MusicIcon({ iconColor: "var(--colorBlue)" }),
                },
              },
              {
                value: "Театр",
                label: "Театр",
                selected: markInfo.type === "theatre",
                customProperties: {
                  icon: TheatreIcon({ iconColor: "var(--colorPurple)" }),
                },
              },
              {
                value: "Кино",
                label: "Кино",
                selected: markInfo.type === "cinema",
                customProperties: {
                  icon: CinemaIcon({ iconColor: "var(--colorGreenDark)" }),
                },
              },
            ],
          },
        })}
        </div>
      </div>
      <div class="updateModalContent__comment">
        <h4>Комментарий пользователя</h4>
        <textarea type="comment" name="comment">${markInfo.comment}</textarea>
      </div>
      <div class="updateModalContent__button">
      ${Button({
        text: "Сохранить",
        iconSlot: SaveIcon(),
        extraAttrs: [
          {
            name: "type",
            value: "submit",
          },
        ],
      })}
      </div>
    </div>
  </form>
  </div>`;
};
