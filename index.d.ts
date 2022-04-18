declare const Blck = {
  /**
   * Registers a new component. You will need to import the component to use it
   * in another component
   */
  register(
    name: string,
    content: (props: { [x: string]: any }) => HTMLElement
  ): void;,

  /**
   * Renders the component on the screen
   *
   * @param componentTag Pass the tag of element without process with
   * `blck.html()` function
   *
   * This encapsulate all the app in a `<div id="blck-root" />` tag
   *
   * Ex.:
   * ```javascript
   *  import { html, register, render } from "blck";
   *
   *  register("App", () => html`<h1>Hello World!</h1>`);
   *
   *  render("<App></App>", document.querySelector("#root"));
   * ```
   */
  render(componentTag: string, container: HTMLElement): void;,

  /** State Hook */
  useState<T>(value: T): {
    s(value: (value: T) => T): void;
    /**
     * This function doesn't update every time the state changes, so use the
     * inside of a callback to always be updated
     */
    g(): T;
    /** Unique identification */
    readonly identification: string;
  };,

  /** Process the html string */
  html(content: string, ...values: any): HTMLElement;,
  on(events: HTMLElementEventMap): HTMLElementEventMap;,
};

export default Blck;
export const register = Blck.register;
export const render = Blck.render;
export const useState = Blck.useState;
export const html = Blck.html;
export const on = Blck.on;
