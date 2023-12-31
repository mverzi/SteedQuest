class HorseMenu {
    constructor({caster, enemy, onComplete, items, replacements}) {
        this.caster = caster;
        this.enemy = enemy;
        this.replacements = replacements;
        this.onComplete = onComplete;

        console.log({ replacements });

        let quantityMap = {};
        items.forEach(item => {
            if (item.team === caster.team) {
                let existing = quantityMap[item.actionId];
                if (existing) {
                    existing.quantity += 1;
                } else {
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                            quantity: 1,
                            instanceId: item.instanceId,
          }
       }
      }
    })
            this.items = Object.values(quantityMap);
            console.log(this.items);
  }

    getPages() {

        const backOption = {
            label: "Go Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root)
            }
        };

        return {
            root: [{
                label: "Choose Horse",
                description: "Choose race horse",
                handler: () => {
                    //Do something when chosen...
                    this.keyboardMenu.setOptions( this.getPages().replacements )
                }
            },
            {
                label: "Items",
                description: "Choose an item from your inventory",
                handler: () => {
                    this.keyboardMenu.setOptions( this.getPages().items )
                }
            },
        ],
        replacements: [
            ...this.replacements.map(replacement => {
                 return {
                    label: replacement.name, 
                    description: replacement.description,
                    handler: () => {
                        this.menuSubmiteReplacement(replacement)
                    }
                 }
            }),
            backOption
        ],
        items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption
      ],          
        }
    }

    menuSubmiteReplacement(replacement) {
        this.keyboardMenu?.end();
        this.onComplete({
            replacement 
        })
    }

    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end();
         this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId
         })
    }

    // decide() {
        
    //     this.menuSubmit(Actions[ this.caster.actions[0] ]);
    
    // }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions( this.getPages().root);
    }

    init(container) {

        // if (this.caster.isPlayerControlled) {
            this.showMenu(container); 
        // } else  {
            // this.decide();
        // }
        
    }
}