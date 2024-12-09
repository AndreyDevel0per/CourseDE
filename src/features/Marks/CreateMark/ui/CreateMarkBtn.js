import { Button } from "#shared/ui/Button";
import { RouteIcon } from "#shared/ui/Icons";

/**
 * Кнопка добавления метки
 */
export const CreateMarkBtn = () =>
  Button({
    text: "Добавить метку",
    iconSlot: RouteIcon(),
    extraAttrs: [],
  });
