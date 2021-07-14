export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
  }
  
  layout() {
    const buttons = [ 'check', 'double', 'split', 'hover-turn' ];
    const chips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = buttons
      .map( suffix => `
        <div class="panel__button-${ suffix }>
          <button type="button"></button>
          <img src="/assets/buttons/button_${ suffix }.png">
        </div>`)
      .join('');
      
    const layoutChipMachine = chips
      .map( code => `
        <div class="chip" id="c${ code }">
          <button type="button"></button>
          <img src="/assets/chips/chip_${ code }.png">
        </div>`)
      .join('');
    
    return `
      <img src="/assets/panel.png">
      
      <div class="panel__buttons">
      ${ layoutPanelButtons }
      </div>
      
      <div class="panel__chip-machine>
      ${ layoutChipMachine }
      </div>`;
  }
  
  
}