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
    about: `
      About test text.
    `,
    help: `
      I can't help you, buddy.
    `
  }
}
