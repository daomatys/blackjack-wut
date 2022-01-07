import Button from "../button.js";
import thatComponentStyleSheet from './button__menu.css' assert { type: 'css' };


export default class MenuButton extends Button {

  constructor( itemname ) {
    super();

    this.itemname = itemname;
    
    this.render();
  }

  markup() {
    return `

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
