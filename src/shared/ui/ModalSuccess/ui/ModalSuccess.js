import { CheckIcon } from "#shared/ui/Icons";

/**
 * Компонент модалки
 * @return {String}
 */
export const ModalSuccess = ({
  extraClasses = [],
  extraAttrs = [],
  successText = "Успешно!",
  unsuccessText = "Не успешно!",
} = {}) => {
  return `<div style="display: none">
            <div class="modalSuccess" id="modalSuccess">
              ${CheckIcon({ iconColor: "var(--colorGreenLight)" })}
              <p>${successText}</p>
            </div>
            <div id="modalError">
              <p>${unsuccessText}</p>
            </div>
          </div>`;
};
