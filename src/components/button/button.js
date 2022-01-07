import MyComponent from '../components.js';
import thatComponentStyleSheet from './button.css' assert { type: 'css' };


export default class Button extends MyComponent {

  constructor() {
    super();
    this.init();
  }

  init() {
    super.applyStyleSheet( thatComponentStyleSheet );
  }

  switchDisplayState( id ) {
    const button = document.querySelector(`#${ id }`);
    
    const buttonClickIllusion = function switchButtonImagesDisplayState() {
      const buttonImages = [
        button.lastElementChild,
        button.firstElementChild
      ];

      buttonImages.forEach( image => image.classList.toggle('js-button-image_hidden') );
    }

    buttonClickIllusion();
    
    document.addEventListener('pointerup', buttonClickIllusion, { once: true } );
  }

  switchClickPossibility( suffix ) {
    const element = document.querySelector(`.clicker-${ suffix }`).lastElementChild;
    
    element.classList.toggle('deny-click');
    element.classList.toggle('allow-click');
  }
}
