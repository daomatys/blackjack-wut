import Button from "../button.js";
import thatComponentStyleSheet from './button__sidebar.css' assert { type: 'css' };


export default class SidebarButton extends Button {

  constructor( itemname ) {
    super();

    this.itemname = itemname;
    
    this.render();
  }

  markup() {
    return `
      <div class="sidebar__button" id="sidebar-${ this.itemname }">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemname }_off.png">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ this.itemname }_on.png">
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

    this.elem = document.querySelector(`#sidebar-${ this.itemname }`);

    console.log(this.elem)
  }
}
