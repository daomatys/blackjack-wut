export default {
  hands: () => ({
    dealer: {
      count: 0,
      value: 0,
      topaces: false,
      overdraft: false,
      forbiddraw: false
    },
    player: {
      normal: {
        count: 0,
        value: 0,
        topaces: false,
        overdraft: false
      },
      splitleft: {
        count: 1,
        value: 0,
        topaces: false,
        overdraft: false
      },
      splitright: {
        count: 1,
        value: 0,
        topaces: false,
        overdraft: false
      }
    }
  }),

  indicators: () => ({
    player: 3,
    dealer: 3
  }),
  
  results: () => ({
    normal: {
      player: 0,
      dealer: 0,
      tie: 0
    },
    left: {
      player: 0,
      dealer: 0,
      tie: 0
    },
    right: {
      player: 0,
      dealer: 0,
      tie: 0
    }
  }),

  texts: {
    about: {
      title: 'About project',
      text: `
        That's my first own non-commercial open-source pet-project ever.
        Written in pure HTML, CSS and JS.
        Don't steal my graphic assets, please.


        Used fonts:

        ANTIQUE CHERRY BY TYPHOON TYPE

        My fonts for free use allowed only in personal project , non-profit and charity use.
        If you make money from using my fonts, Please purchase a commercial license <a class="modal-window__link" target="_blank" href="http://www.typhoontype.net/fonts/antique-cherry/">here</a>.


        NEONIZE BY RAYHAN

        This font is free for commercial use.


        POKER FONT BY VLADIMIR NICOLIC

        Free for personal use. 
        For commercial use, please order a license <a class="modal-window__link" target="_blank" href="https://www.creativefabrica.com/product/poker-41/ref/144265/">here</a>.
      `
    },
    help: {
      title: "I DUNNO WUT 2 DO HALP",
      text:`
        You'd better look at the bottom control panel.

        See it? There are green buttons upon the chip dispensers. Hit one of them, and - yikes - you've just bet a random chip!
        Amazing, innit?
        
        There we go.
        After that, something gonna blink smoothly, right at the center of the screen. That's a game starter, just press it.

        Voila! A deck just landed.
        Then you can draw a card using your mouse cursor. Just drag the card and drop it to your hand zone.
        Your hand zone is nearby the control panel with chip dispensers.

        Continue drawing cards.
        Character-related cards, like J or K, has a fixed value, equals 10.
        Cards with numeric ranks, like 2 or 5, has the same numeric values.
        Ace's value can be either 1 or 11. As you wish.

        If you don't associate yourself with a 8-bit calculator, you can smash F12 button and open a browser's console.
        There will be some log info about each hand's value after each card drawn.
        
        Your summary value of hand cards shouldn't be greater than 21, that's' the one thing you need to control.
        Closer to 21 - closer to big non-existent cash! More than 21 - you're dead. Simple, huh?

        That is. Enjoy your stay, comrade.
      `
    }
  }
}
