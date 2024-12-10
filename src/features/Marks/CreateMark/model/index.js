import { getCreateMarkModalContent } from "../ui/getCreateMarkModalContent.js";
import { API_ENDPOINTS } from "#shared/config/constants.js";
import { ModalManager } from "#shared/lib/plugins/modalManager";
import { ChoiceSelectModel } from "#shared/ui/CustomSelect/model/index.js";

/**
 *
 */
export class CreateMarkModel {
  attrs = {
    createMark: "data-js-create-mark-info",
    selectTypeMark: "data-js-create-mark-info-select-type",
  };

  constructor(storeService) {
    this.storeService = storeService;
    this.#bindEvents();
  }

  #handleClick(e) {
    const parent = e.target.closest(`[${this.attrs.createMark}]`);
    if (!parent) return;
    //надо будет прикрутить geoCoder к инпуту модалки чтобы по введенному адресу получать координаты и через методы карты создавать метку
    try {
      ModalManager.getInstance().open(
        getCreateMarkModalContent({
          url: `${API_ENDPOINTS.marks.create}`,
        }),
        {
          on: {
            reveal: () => {
              ChoiceSelectModel.createChoiceSelect(
                document.querySelector(`[${this.attrs.selectTypeMark}=""]`)
              );
            },
          },
          closeButton: false,
        }
      );
    } catch (error) {
      console.error("Ошибка при открытии модалки создания метки:", error);
    }
  }

  #handleSubmit() {}

  #bindEvents() {
    document.addEventListener("click", (e) => {
      this.#handleClick(e);
    });
  }
}
