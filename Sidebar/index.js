export default class Sidebar {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('sidebar');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
    
    this.sidebarMovedState = false;
  }
  
  layout() {
    return `
      <div class="sidebar__background" id ="sidebar">
        <img src="/assets/sidebar.png">
      </div>
      <div class="sidebar__button-array">
        <div class="sidebar__button" id="sidebar-next">
          <img src="/assets/buttons/sidebar-btn_next_off.png" style="display: inline">
          <img src="/assets/buttons/sidebar-btn_next_on.png" style="display: none">
        </div>
        <div class="sidebar__button" id="sidebar-menu">
          <img src="/assets/buttons/sidebar-btn_menu_off.png" style="display: inline">
          <img src="/assets/buttons/sidebar-btn_menu_on.png" style="display: none">
        </div>
        <div class="sidebar__button" id="sidebar-help">
          <img src="/assets/buttons/sidebar-btn_help_off.png" style="display: inline">
          <img src="/assets/buttons/sidebar-btn_help_on.png" style="display: none">
        </div>
      </div>
    `;
  }
  
  eventListeners() {
    this.elem.addEventListener('pointerdown', this.actsOfButtons)
  }
  
  changeButtonDisplayState = id => {
    const btn = this.elem.querySelector(`#${ id }`);
    
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
    
    const aim = event.target;
    
    this.changeButtonDisplayState( aim.id );
    
    switch ( aim.id ) {
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
    this.elem.querySelector('#sidebar-menu').onclick = () => {
      document.querySelector('#blackjack-table').style.display = 'none';
      document.querySelector('#start-screen-menu').style.display = 'inline';
    }
  }
  
  actHelp() {
    
  }
  
  scrollSidebar() {
    this.sidebarMovedState = !this.sidebarMovedState;
    
    this.sidebarMovedState
      ? this.sidebarShift = '142px'
      : this.sidebarShift = '0px';
    
    const sidebarAnimation = this.elem.animate({
      transform: `translateX(${ this.sidebarShift })`
    }, {
      easing: 'ease',
      duration: 600,
      fill: 'both',
      composite: 'replace'
    });
    sidebarAnimation.persist();
  }
}
