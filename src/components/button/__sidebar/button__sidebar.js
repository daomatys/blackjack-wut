import Button from "../button.js";
import thatComponentStyleSheet from './button__sidebar.css' assert { type: 'css' };


export default class SidebarButton extends Button {

  constructor( itemname ) {
    super();
    this.itemname = itemname;
  }

  markup() {
    return `
      <div class="sidebar__button" id="sidebar-${ this.itemname }">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemname }_off.png" style="display: inline">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemname }_on.png" style="display: none">
      </div>
    `;
  }

  render() {
    const selector = '.sidebar__buttons-row';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    //this.elem = this.defineElementByItsWrap( selector );
  }
}
