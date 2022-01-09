import Button from "../button.js";
import thatComponentStyleSheet from './button__sidebar.css' assert { type: 'css' };


export default class SidebarButton extends Button {

  constructor( itemName ) {
    super();

    this.itemName = itemName;

    this.render();
    this.initElemRef();
    this.initEventHook();
  }

  markup() {
    return `
      <div class="sidebar__button" id="sidebar-${ this.itemName }">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemName }_off.png">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemName }_on.png" class="js-button-image_hidden">
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: '.sidebar__buttons-row',
      markup: this.markup()
    });
  }

  initElemRef() {
    const selector = `#sidebar-${ this.itemName }`;

    this.elem = document.querySelector( selector );
  }

  initEventHook() {
    this.elem.onpointerdown = () => this.switchDisplayState( this.elem );
  }
}
