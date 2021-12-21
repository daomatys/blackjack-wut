export default function( selector, markup ) {
  document
    .querySelectorAll( selector )
    .forEach( element => element.insertAdjacentHTML( 'afterbegin', markup ) )
}
