class CraftingMenu {
    constructor({horses, onComplete}) {
        this.horses = horses;
        this.onComplete = onComplete;
    }

    getOptions() {
        return this.horses.map(id => {
            const base = Horses[id];
            return {
               label: base.name,
               description: base.description,
               handler: () => {
                //add horse to PlayerState
                playerState.addHorse(id);
                this.close();
               } 
            }
        })
    }

    createElement() {
        this.element = document.createElement("div"),
        this.element.classList.add("CraftingMenu");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
            <h2>Open the Egg</h2>
        `)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }
    
    init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions());
        container.appendChild(this.element);
    }
}