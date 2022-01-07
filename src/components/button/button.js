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

  switchDisplayState( button ) {
    const buttonClickIllusion = function switchButtonImagesDisplayState() {
      const buttonImages = [
        button.lastElementChild,
        button.firstElementChild
      ];
      buttonImages.forEach( image => image.classList.toggle('js-button-image_hidden') );
    }
    
    buttonClickIllusion();
    document.addEventListener('pointerup', buttonClickIllusion, { once: true });
  }

  switchClickPossibility( elem ) {
    console.log(elem)
    const thumb = elem.lastElementChild;
    
    thumb.classList.toggle('deny-click');
    thumb.classList.toggle('allow-click');
  }
}
