import { Button } from "#shared/ui/Button";
import { NewRouteIcon } from "#shared/ui/Icons";

/**
 * Кнопка создания маршрута
 * @return
 */
export const CreateRouteBtn = () =>
  Button({
    text: "Построить маршрут",
    iconSlot: NewRouteIcon(),
    extraAttrs: [],
  });
