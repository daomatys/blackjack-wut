import MyComponent from '../components.js';
import thatComponentStyleSheet from './sidebar.css' assert { type: 'css' };
import animations from '../../assets/lib/animations.js';


export default class Sidebar extends MyComponent {
  
  constructor() {
    super();

    this.animations = animations;
    this.sidebarMovedState = false;
    
    this.render();
    this.eventListeners();
  }
  
  markup() {
    return `
      <div class="sidebar">
        <div class="sidebar__background" id ="sidebar">
          <img src="src/assets/graphics/sidebar.png">
        </div>
        <div class="sidebar__button-array">
          <div class="sidebar__button" id="sidebar-next">
            <img src="src/assets/graphics/buttons/sidebar-btn_next_off.png" style="display: inline">
            <img src="src/assets/graphics/buttons/sidebar-btn_next_on.png" style="display: none">
          </div>
          <div class="sidebar__button" id="sidebar-menu">
            <img src="src/assets/graphics/buttons/sidebar-btn_menu_off.png" style="display: inline">
            <img src="src/assets/graphics/buttons/sidebar-btn_menu_on.png" style="display: none">
          </div>
          <div class="sidebar__button" id="sidebar-help">
            <img src="src/assets/graphics/buttons/sidebar-btn_help_off.png" style="display: inline">
            <img src="src/assets/graphics/buttons/sidebar-btn_help_on.png" style="display: none">
          </div>
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
      case 'sidebar': this.scrollSidebar(); break;
      case 'sidebar-next': this.actNext(); break;
      case 'sidebar-menu': this.actMenu(); break;
      case 'sidebar-help': this.actHelp(); break;
    }
  }
  
  actNext() {
    this.elem.dispatchEvent( new CustomEvent('end-of-round', {bubbles: true}));
  }
  
  actMenu() {
    document.querySelector('#blackjack-table').style.display = 'none';
    document.querySelector('#start-screen-menu').style.display = 'flex';
  }
  
  actHelp() {
    
  }
  
  scrollSidebar() {
    this.sidebarMovedState = !this.sidebarMovedState;
    
    this.sidebarMovedState
      ? this.sidebarShift = '142px'
      : this.sidebarShift = '-142px';
    
    const sidebarAnimation = this.elem.animate(
      this.animations.sidebar.shift.action( this.sidebarShift ),
      this.animations.sidebar.shift.props
    );
    sidebarAnimation.persist();
  }
}
