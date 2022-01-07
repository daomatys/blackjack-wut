import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-clicker.css' assert { type: 'css' };


export default class PanelClickerButton extends Button {

  constructor( itemValue ) {
    super();

    this.itemValue = itemValue;
    
    this.render();
  }

  markup() {
    return `
      <div class="clicker__container clicker-${ this.itemValue }">
        <div class="clicker js-tappable" id="${ this.itemValue }">
          <img src="src/assets/graphics/buttons/button_${ this.itemValue }_off.png">
          <img src="src/assets/graphics/buttons/button_${ this.itemValue }_on.png" class="js-button-image_hidden">
        </div>
        <div class="clicker__fake deny-click">
          <img src="src/assets/graphics/buttons/button_inactive.png">
        </div>
      </div>
    `;
  }

  render() {
    const selector = '.panel__clickers';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });
  }

  toggleClickPossibility() {
    const selector = '.clicker-' + this.itemValue;

    this.switchClickPossibility( selector );
  }
}
