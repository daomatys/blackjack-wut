export default class MyComponent {

  applyStyleSheet( componentStyleSheet ) {
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      componentStyleSheet
    ];
  }

  insertMarkup( element, markup ) {
    element.insertAdjacentHTML( 'afterbegin', markup );
  }

  applyMarkup( wrapref, markup ) {
    document
      .querySelectorAll( wrapref )
      .forEach( element => this.insertMarkup( element, markup ) );
  }

  initializeComponent( item ) {
    this.applyStyleSheet( item.stylesheet );
    this.applyMarkup( item.wrapref, item.markup )
  }

  defineElementByItsWrap( wrapref ) {
    return document.querySelector( wrapref ).firstElementChild;
  }
}
