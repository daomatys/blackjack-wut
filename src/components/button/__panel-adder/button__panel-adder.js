import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-adder.css' assert { type: 'css' };


export default class PanelAdderButton extends Button {

  constructor( itemValue ) {
    super();

    this.itemValue = itemValue;
    
    this.render();
    this.initElemRef();
    this.initEventHook();
  }

  markup() {
    return `
      <div class="adder__container adder-${ this.itemValue }">
        <div class="adder js-tappable" id="adder-${ this.itemValue }">
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
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: '.panel__adders',
      markup: this.markup()
    });
  }

  initElemRef() {
    const selector = `.adder-${ this.itemValue }`;

    this.elem = document.querySelector( selector );
  }

  initEventHook() {
    const button = this.elem.firstElementChild;

    this.elem.onpointerdown = () => this.switchDisplayState( button );
  }

  toggleClickPossibility() {
    this.switchClickPossibility( this.elem );
  }
}
