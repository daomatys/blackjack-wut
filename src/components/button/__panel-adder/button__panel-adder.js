import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-adder.css' assert { type: 'css' };


export default class PanelAdderButton extends Button {

  constructor( itemName ) {
    super();

    this.itemName = itemName;
    
    this.render();
  }

  markup() {
    return `
      <div class="adder__container adder-${ this.itemName }">
        <div class="adder js-tappable" id="adder-${ this.itemName }">
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
    const selector = '.panel__adders';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });
  }

  toggleClickPossibility() {
    const selector = '.adder-' + this.itemName;

    this.switchClickPossibility( selector );
  }
}
