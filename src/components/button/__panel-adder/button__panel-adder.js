import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-adder.css' assert { type: 'css' };


export default class PanelAdderButton extends Button {

  constructor( itemname ) {
    super();

    this.itemname = itemname;
    
    this.render();
  }

  markup() {
    return `
      <div class="adder__container adder-${ this.itemname }">
        <div class="adder js-tappable" id="adder-${ this.itemname }">
          <img src="src/assets/graphics/buttons/adder_off.png">
          <img src="src/assets/graphics/buttons/adder_on.png" class="js-button-image_hidden">
        </div>
        <div class="adder__fake allow-click">
          <img src="src/assets/graphics/buttons/adder_inactive.png">
        </div>
      </div>
    `;
  }

  render() {
    const selector = '';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    //this.elem = this.defineElementByItsWrap( selector );
  }
}
