import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-clicker.css' assert { type: 'css' };


export default class PanelClickerButton extends Button {

  constructor( itemName ) {
    super();

    this.itemName = itemName;
    
    this.render();
    this.initElemRef();
    this.initEventHook();
  }

  markup() {
    return `
      <div class="clicker__container clicker-${ this.itemName }">
        <div class="clicker js-tappable" id="${ this.itemName }">
          <img src="src/assets/graphics/buttons/button_${ this.itemName }_off.png">
          <img src="src/assets/graphics/buttons/button_${ this.itemName }_on.png" class="js-button-image_hidden">
        </div>
        <div class="clicker__thumb deny-click">
          <img src="src/assets/graphics/buttons/button_inactive.png">
        </div>
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: '.panel__clickers-row',
      markup: this.markup()
    });
  }

  initElemRef() {
    const selector = `.clicker-${ this.itemName }`;

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
