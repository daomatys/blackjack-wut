import MyComponent from '../components.js';
import thatComponentStyleSheet from './sidebar.css' assert { type: 'css' };


export default class Sidebar extends MyComponent {
  
  constructor() {
    super();
    
    this.render();
    this.eventListeners();
  }
  
  markup() {
    const defineButtonByTypeName = typename => `
      <div class="sidebar__button" id="sidebar-${ typename }">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ typename }_off.png" style="display: inline">
        <img src="src/assets/graphics/buttons/sidebar-btn_${ typename }_on.png" style="display: none">
      </div>
    `;

    const buttonTypeNames = [
      'next',
      'menu',
      'help'
    ];

    const buttonsRow = buttonTypeNames
      .map( typename => defineButtonByTypeName( typename ) )
      .join('');

    return `
      <div class="sidebar">
        <div class="sidebar__background" id ="sidebar">
          <img src="src/assets/graphics/sidebar.png">
        </div>
        <div class="sidebar__buttons-row">
          ${ buttonsRow }
        </div>
      </div>
    `;
  }

  render() {
    const selector = '[data-sidebar]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
  
  eventListeners() {
    this.elem.addEventListener('click', this.actsOfButtons);
    this.elem.addEventListener('pointerdown', this.changeButtonDisplayState);
  }
  
  changeButtonDisplayState = event => {
    const btn = this.elem.querySelector(`#${ event.target.id }`);
    
    const btnClickIllusion = () => {
      const imgOff = btn.firstElementChild;
      const imgOn = btn.lastElementChild;
      
      imgOn.style.display === 'none'
      ? ( imgOn.style.display = 'inline', imgOff.style.display = 'none' )
      : ( imgOn.style.display = 'none', imgOff.style.display = 'inline' );
    }
    btnClickIllusion();
    
    document.addEventListener('pointerup', btnClickIllusion, { once: true } );
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    switch ( event.target.id ) {
      case 'sidebar': this.shiftSidebar(); break;
      case 'sidebar-next': this.actNext(); break;
      case 'sidebar-menu': this.actMenu(); break;
      case 'sidebar-help': this.actHelp(); break;
    }
  }
  
  actNext() {
    this.elem.dispatchEvent( new CustomEvent('end-of-round', {bubbles: true}));
  }
  
  actMenu() {
    document.querySelector('#start-screen-menu').style.display = 'flex';
  }
  
  actHelp() {
    
  }
  
  shiftSidebar() {
    this.elem.classList.toggle('sidebar_ejected');
  }
}
