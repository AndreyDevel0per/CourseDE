import { Button } from "#shared/ui/Button";
import { RouteIcon } from "#shared/ui/Icons";

/**
 * Кнопка добавления метки
 */
export const CreateMarkBtn = ({ markInfo = "", text = "Добавить метку" }) => {
  return Button({
    markInfo,
    text,
    iconSlot: RouteIcon(),
    extraAttrs: [
      {
        name: "data-js-create-mark-info",
        value: markInfo,
      },
    ],
  });
};
