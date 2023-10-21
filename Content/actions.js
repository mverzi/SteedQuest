window.Actions = {
  //Moves and Statuses
    damage1: {
      name: "Kick",
      description: "Do some damage with a good kick!",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "spin"},
        { type: "stateChange", damage: 10}
      ]
    },
    nuzzlingBondStatus: {
      name: "Nuzzle",
      description: "Nuzzle up to regain some HP!",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "stateChange", status: { type: "nuzzling bond", expiresIn: 3 }}
      ]
    },
    spookedStatus: {
      name: "Spook",
      description: "Spook your opponent!",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "spook", color: "#0f0f0f" },
        { type: "stateChange", status: { type: "spooky", expiresIn: 3 }}
      ]
    },
    //Items
    item_recoverStatus: {
      name: "Carrot",
      description: "This has a nice crunch that removes status effects!",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
        { type: "stateChange", status: null},
        { type: "textMessage", text: "All status effects removed!"}
      ]
    },
    item_recoverHp: {
      name: "Apple",
      description: "Looks sweet enough to restore some health!",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
        { type: "stateChange", recover: 10},
        { type: "textMessage", text: "{CASTER} recovers some HP!"}
      ]
    }

  }