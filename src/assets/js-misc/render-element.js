export default function( selector, markup ) {
  document
    .querySelector( selector )
    .insertAdjacentHTML( 'afterbegin', markup );
}
