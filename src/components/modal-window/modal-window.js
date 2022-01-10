import MyComponent from '../components.js';
import thatComponentStyleSheet from './modal-window.css' assert { type: 'css' };


export default class ModalWindow extends MyComponent {
  
  constructor( text, wrapref ) {
    super();

    this.wrapref = wrapref;
    this.text = text;

    this.render();
  }
  
  markup() {
    return `
      <div class="modal-window">
        <div class="modal-window__text-window">
          ${ this.text }
        </div>
        <div class="modal-window__close-button"></div>
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: this.wrapref,
      markup: this.markup()
    });
  }
}
