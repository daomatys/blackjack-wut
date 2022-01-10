import MyComponent from '../components.js';
import thatComponentStyleSheet from './modal-window.css' assert { type: 'css' };


export default class ModalWindow extends MyComponent {
  
  constructor( text, wrapref ) {
    super();

    this.wrapref = wrapref;
    this.text = text;

    this.render();
    this.initElemRef();
    this.initEventListeners();
  }
  
  markup() {
    return `
      <div class="modal-window modal-window_hidden">
        <div class="modal-window__text-window">
          ${ this.text }
        </div>
        <div class="modal-window__escape-button">X</div>
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

  initElemRef() {
    this.elem = this.defineElementByItsWrap( this.wrapref );
  }

  initEventListeners() {
    this.elem.lastElementChild.onclick = () => this.switchWindowVisibilityState();
  }

  switchWindowVisibilityState() {
    this.elem.classList.toggle('modal-window_hidden');
  }
}
