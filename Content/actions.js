window.Actions = {
    damage1: {
      name: "Kick",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "spin"},
        { type: "stateChange", damage: 10}
      ]
    },
    nuzzlingBondStatus: {
      name: "Nuzzle",
      targetType: "friendly",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "stateChange", status: { type: "nuzzling bond", expiresIn: 3 }}
      ]
    },
    spookedStatus: {
      name: "Spook",
      success: [
        { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
        { type: "animation", animation: "spook", color: "#0f0f0f" },
        { type: "stateChange", status: { type: "spooky", expiresIn: 3 }}
      ]
    }

  }