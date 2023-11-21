class Apple extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/images/items/apple.png", // Set the path to your apple image
        });

        this.id = config.id;

        this.talking = [
            {
                events: [
                    { type: "textMessage", text: "You collected an apple!" },
                    { type: "addItemToInventory", item: { actionId: "item_recoverHp", instanceId: "appleItem" } },
                    { type: "destroyGameObject", objectId: this.id },
                  ],
            },
        ];
    }

    update() {
        // You can add any update logic specific to apples here
    }
}
