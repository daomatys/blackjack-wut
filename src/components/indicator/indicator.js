import renderElement from '/src/assets/js-misc/render-element.js';


(function() {
  const indicatorMarkup = `
    <img src="src/assets/graphics/indicators/indicator_tie.png">
    <img src="src/assets/graphics/indicators/indicator_win.png">
    <img src="src/assets/graphics/indicators/indicator_lose.png">
    <img src="src/assets/graphics/indicators/indicator_test.png">
  `;

  renderElement( 'indicator', indicatorMarkup );
})();