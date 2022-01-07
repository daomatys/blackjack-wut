import Button from "../button.js";
import thatComponentStyleSheet from './button__panel-adder.css' assert { type: 'css' };


export default class PanelAdderButton extends Button {

  constructor( itemname ) {
    super();
    this.itemname = itemname;
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
