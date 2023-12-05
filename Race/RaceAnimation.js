window.RaceAnimations = {
    async run(rcevent, onComplete) {
        const element = rcevent.caster.competitorHorseElement;
        const animationClassName = rcevent.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
        element.classList.add(animationClassName);

        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, {once:true});

        await utils.wait(100);
        onComplete();
    }
}