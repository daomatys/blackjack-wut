export default class Sidebar {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('sidebar');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  layout() {
    return `
      <div class="sidebar__background">
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
    
  }
}