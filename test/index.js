import { html, on, register, render, useState } from "../index.js";

register("Like", () => {
  const likes = useState(0);

  return html`
    <div>
      <h1>Likes - ${likes}</h1>
      <button ${on({ click: () => likes.s(v => v + 1) })}>Like</button>
    </div>
  `;
});

register("App", () => {
  return html` <Like ${on({ click: () => window.alert("test") })}></Like> `;
});

render(html`<App></App>`, document.querySelector("#root"));
