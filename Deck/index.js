export default class Deck {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('deck');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.initStyle();
    this.drawingCard();
  }
  
  layout() {
    return `
      <div class="deck__veiled">
        <img src="/assets/cards/back_red_deck.png" width="126px">
      </div>
      <div class="deck__top">
        <img src="/assets/cards/back_red.png" width="120px">
      </div>`;
  }
  
  sub = suffix => this.elem.querySelector(`.deck__${ suffix }`);
  
  initStyle() {
    const top =
      document.documentElement.clientHeight / 2 - 
      this.elem.style.height / 2;
    
    console.log(this.elem.offsetHeight)
    this.sub('veiled').style.top = top + 'px';
    this.sub('top').style.top = top - 1 + 'px';
  }
  
  drawingCard() {
    this.elem.ondragstart = () => false;
    
    this.sub('top').addEventListener('pointerdown', this.onPointerDown);
  }
  
  onPointerDown = event => {
    event.preventDefault();
    
    this.sub('top').style.opacity = 1;
    
    this.shiftX = event.clientX - this.sub('top').getBoundingClientRect().left;
    this.shiftY = event.clientY - this.sub('top').getBoundingClientRect().top;
    
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  onPointerMove = event => {
    event.preventDefault();
    
    Object.assign( this.sub('top').style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
  }
  
  onPointerUp = event => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}