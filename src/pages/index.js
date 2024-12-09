import { CreateMarkBtn } from "#features/Marks/CreateMark";
import { PlaceSwitchGroup } from "#features/PlaceSwitchGroup";
import { CreateRouteBtn } from "#features/Routes/CreateRoute";
import { GetRoutesBtn } from "#features/Routes/GetRoutes";
import { Map } from "#shared/ui/Map/ui/Map";

/**
 * Страница приложения
 * @return {string}
 */
const IndexPage = () => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home Page</title>
    </head>
    <body>
      <header>
      </header>
      <main>
        ${PlaceSwitchGroup()}
        <div class="isFlex">
          ${Map()}
          <div class="isFlexColoumn ml28">
            ${CreateMarkBtn()}
            ${CreateRouteBtn()}
            ${GetRoutesBtn()}
          </div>
        </div>
      </main>
      <div style="display: none">
        <div id="modalSuccess">
            <p>Успешно!</p>
        </div>
        <div id="modalError">
          <p>Не успешно!</p>
        </div>
      </div>
    </body>
  </html>
`;

export default IndexPage;
