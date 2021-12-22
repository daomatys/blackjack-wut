import renderElement from '/src/assets/js-misc/render-element.js';


(function() {
  const indicatorMarkup = `
    <img class="indicator__img" src="src/assets/graphics/indicators/indicator_tie.png">
    <img class="indicator__img" src="src/assets/graphics/indicators/indicator_win.png">
    <img class="indicator__img" src="src/assets/graphics/indicators/indicator_lose.png">
    <img class="indicator__img" src="src/assets/graphics/indicators/indicator_test.png">
  `;

  renderElement( '.indicator', indicatorMarkup );
})();
