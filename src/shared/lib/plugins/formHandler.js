import { ModalManager } from "./modalManager.js";

/**
 * Класс для отправки данных с формы
 */
export class FormHandler {
  static instance;

  attrs = {
    form: "data-js-form",
  };

  constructor(apiClient) {
    if (FormHandler.instance) return FormHandler.instance;
    this.apiClient = apiClient;
    this.#bindEvents();
    FormHandler.instance = this;
  }

  static getInstance(apiClient) {
    if (!FormHandler.instance) {
      FormHandler.instance = new FormHandler(apiClient);
    }
    return FormHandler.instance;
  }

  #handleSubmit(e) {
    const { target, submitter } = e;
    if (!target.hasAttribute(`${this.attrs.form}`)) return;
    if (target.tagName.toLowerCase() !== "form") return;

    const cfg = JSON.parse(target.getAttribute(this.attrs.form));
    const {
      url,
      method = "POST",
      showModalAfterSuccess,
      preventDefault = true,
      redirectUrlAfterSuccess,
      delayBeforeRedirect,
    } = cfg;

    // Создание FormData
    const formData = new FormData(target);

    // Преобразование FormData в объект для ApiClient
    const formObject = Object.fromEntries(formData.entries());

    if (preventDefault) {
      e.preventDefault();
    }

    submitter.disabled = true;

    const apiMethod = method.toUpperCase() === "GET" ? "get" : "post";

    // Использование ApiClient
    this.apiClient[apiMethod](url, formObject)
      .then((res) => {
        if (showModalAfterSuccess) {
          ModalManager.getInstance().closeAll();
          ModalManager.getInstance().open(showModalAfterSuccess, {
            type: "inline",
          });
        }

        if (redirectUrlAfterSuccess) {
          if (delayBeforeRedirect) {
            setTimeout(() => {
              location.href = redirectUrlAfterSuccess;
            }, delayBeforeRedirect);
          } else {
            location.href = redirectUrlAfterSuccess;
          }
        }
      })
      .catch((err) => {
        console.error("Ошибка отправки формы:", err);
      })
      .finally(() => {
        submitter.disabled = false;
      });
  }

  #bindEvents() {
    document.addEventListener(
      "submit",
      (e) => {
        this.#handleSubmit(e);
      },
      true
    );
  }
}
