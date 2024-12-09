import { Button } from "#shared/ui/Button";
import { MyRoutesIcon } from "#shared/ui/Icons";

/**
 * Кнопка получения маршрутов
 * @return
 */
export const GetRoutesBtn = () =>
  Button({
    text: "Мои маршруты",
    iconSlot: MyRoutesIcon(),
    extraAttrs: [],
  });
