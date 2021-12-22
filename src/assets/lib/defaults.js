export default {
  hands: () => ({
    dealer: {
      count: 0,
      value: 0,
      topaces: 0,
      overdraft: false,
      forbiddraw: false
    },
    player: {
      normal: {
        count: 0,
        value: 0,
        topaces: 0,
        overdraft: false
      },
      splitleft: {
        count: 1,
        value: 0,
        topaces: 0,
        overdraft: false
      },
      splitright: {
        count: 1,
        value: 0,
        topaces: 0,
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
  })
}
