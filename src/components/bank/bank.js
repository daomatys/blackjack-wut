import renderElement from "../../assets/js-misc/render-element";

(function() {
  const bankMarkup = `
    <img src="src/assets/graphics/bank.png">
    <div class="bank">
      <div class="bank__slot" id="slot-1"></div>
      <div class="bank__slot" id="slot-5"></div>
      <div class="bank__slot" id="slot-10"></div>
      <div class="bank__slot" id="slot-25"></div>
      <div class="bank__slot" id="slot-100"></div>
    </div>
  `;

  renderElement( '[data-bank]', bankMarkup );
})();