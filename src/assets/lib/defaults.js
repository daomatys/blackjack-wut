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
        That's my first own non-commercial pet-project ever.


        Used fonts:

        ANTIQUE CHERRY BY TYPHOON TYPE (TM)

        Hello, please contact me before any commercial use.
        My fonts for free use allowed only in personal project , non-profit and charity use.
        If you make money from using my fonts, Please purchase a commercial license
        here: http://www.typhoontype.net/fonts/antique-cherry/

        Typhoon Type - Suthi Srisopha
        
        typhoontype@gmail.com
        http://www.typhoontype.net

        ——————————————

        NEONIZE BY RAYHAN

        This font is free for commercial use, but if you want to use it for commercial, contact me first :)

        ——————————————

        POKER FONT BY VLADIMIR NICOLIC

        Poker is a cool and interesting outlined display font. 
        No matter the topic, this font will be an incredibly asset to your font's library, as it has the potential to elevate any creation.

        Free for personal use. 
        For commercial use, please order a license here: https://www.creativefabrica.com/product/poker-41/ref/144265/
      `
    },
    help: {
      title: "So you've no idea",
      text:`
        I can't help you, buddy.
      `
    }
  }
}
