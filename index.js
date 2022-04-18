/** @type {{[x: string]: (props: {[x: string]: any;}) => HTMLElement}} */
const registeredComponents = {};
const registeredStates = [];

// TODO: On state update event
// TODO: Props in not DOM components

/** @type {import("./index")} */
const blck = {
  register(name, content) {
    if (name in registeredComponents) return;
    registeredComponents[name] = content;
  },
  render(component, container) {
    console.log(registeredComponents);
    container.replaceChildren(component);
  },
  useState(value) {
    registeredStates.push(value);
    const uid = registeredStates.length - 1;

    return {
      s(value) {
        registeredStates[uid] = value(registeredStates[uid]);
      },
      g: () => registeredStates[uid],
      identification: `blckstateuid:${uid}`,
    };
  },
  html(content, ...values) {
    /** @type {Array<{ type: string; fn: () => void; up: () => void }>} */
    const functions = [];
    /** @type {HTMLElement} */
    let thisElement = null;

    // Processing template
    const aContent = [...content];
    const aValues = [...values];
    let rawContent = "";
    aContent.map((value, idx) => {
      let aValue = aValues[idx];
      if (typeof aValue === "object") {
        if (aValue?.identification) {
          const vSplited = `${aValue.identification}`.split(":");
          vSplited[0] === "blckstateuid" &&
            (aValue = registeredStates[Number(vSplited[1])]);
        } else {
          Object.keys(aValue).map(v => {
            functions.push({
              type: v,
              fn: aValue[v],
              up: () => thisElement.replaceWith(blck.html(content, ...values)),
            });
            aValue = `data-blck-functions="${functions.length - 1}"`;
          });
        }
      } else if (typeof aValue === "function") {
        aValue = aValue();
        if (Array.isArray(aValue).valueOf()) {
          const oldAValue = [...aValue];
          aValue = "";
          oldAValue.map(v => (aValue += v));
        }
      }
      rawContent += value + aValue;
    });

    // Transforming processed template into element
    const element = document.createElement("div");
    element.innerHTML = rawContent;

    // Events
    const elsEv = element.querySelectorAll("[data-blck-functions]");
    elsEv.forEach(value => {
      const attrv = Number(value.getAttribute("data-blck-functions"));
      value.removeAttribute("data-blck-functions");
      value.addEventListener(functions[attrv].type, () => {
        functions[attrv].fn();
        functions[attrv].up();
      });
    });

    // Cycling through each element in search of a component
    Object.keys(registeredComponents).map(v => {
      if (element.querySelector(v)) {
        const allComponents = element.querySelectorAll(v);
        for (const key in allComponents) {
          if (Object.hasOwnProperty.call(allComponents, key)) {
            const el = allComponents[key];
            const replaceComponent = document.createElement("div");
            replaceComponent.append(registeredComponents[v]());

            el.replaceWith(replaceComponent.children[0]);
          }
        }
      }
    });

    thisElement = element.children[0];
    return thisElement;
  },
  on: events => events,
};

export default blck;
export const render = blck.render;
export const useState = blck.useState;
export const html = blck.html;
export const register = blck.register;
export const on = blck.on;
