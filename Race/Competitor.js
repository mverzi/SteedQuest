class Competitor {
  constructor(config, race) {
      Object.keys(config).forEach(key => {
          this[key] = config[key];
      })
      this.race = race;
      this.boosts = 3;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return  this.xp / this.maxXp * 100;
  }

  get isActive() {
    return this.race.activeCompetitors[this.team] === this.id;
  }

  get givesXP() {
    return this.level * 20;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Competitor");
    this.hudElement.setAttribute("data-competitor", this.id); 
    this.competitorHorseElement = document.createElement("img");
    this.competitorHorseElement.classList.add("CompetitorHorse");
    this.competitorHorseElement.setAttribute("src", this.idleSrc);
    // this.competitorHorseElement.setAttribute("src", this.runSrc);
    this.competitorHorseElement.setAttribute("alt", this.name);
    this.competitorHorseElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
    <p class="Competitor_name">${this.name}</p>
    <p class="Competitor_level"></p>
    <div class="Competitor_character_crop">
        <img class="Competitor_character" alt="${this.name}" src="${this.src}" />
    </div>
    <img class="Competitor_type" src="${this.icon}" alt="${this.type}" />
    <svg viewBox="0 0 26 3" class="Competitor_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
    </svg>
    <svg viewBox="0 0 26 2" class="Competitor_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
    </svg>
    <p class="Competitor_status"></p>
    `);

    this.hpFills = this.hudElement.querySelectorAll(".Competitor_life-container > rect");

    this.xpFills = this.hudElement.querySelectorAll(".Competitor_xp-container > rect");
}

  // updatePosition() {

  //     this.x += this.speed;
  //     this.horseElement.style.left = `${this.x}px`;
  
  //     if (this.x >= 200) {
  //       this.raceEnd();
  //     }
  //   }

  //   raceEnd() {
  //     console.log(`${this.name} has finished the race!`);
  //     clearInterval(this.race.intervalId);

  
  //   }

    update(changes={}) {
      Object.keys(changes).forEach(key => {
        this[key] = changes[key]
      });

      this.hudElement.setAttribute("data-active", this.isActive);
      this.competitorHorseElement.setAttribute("data-active", this.isActive);
    

      this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`);
      this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`);

      this.hudElement.querySelector(".Competitor_level").innerText = this.level;

      const statusElement = this.hudElement.querySelector(".Competitor_status");
      if (this.status) {
        statusElement.innerText = this.status.type;
        statusElement.style.display = "block";
      } else {
        statusElement.innerText = "";
        statusElement.style.display = "none";
      }
    }

    runAnimation() {
      if (!this.isRunning) {
          this.isRunning = true;

          this.competitorHorseElement.src = "images/405.png";
          let frameIndex = 0;
          const frameWidth = 32; // Width of each frame in pixels
          const spriteSheetFrames = 6; // Number of frames in the sprite sheet
  
          // Set runSrc as the background image when the horse starts running
          
          this.competitorHorseElement.style.backgroundImage = `url(${this.runSrc})`;
          this.competitorHorseElement.style.backgroundSize = `auto ${frameWidth}px`;
  
          const animate = () => {
              const frameX = frameIndex * frameWidth;
              // Update the background position to shift to the next frame
              this.competitorHorseElement.style.backgroundPosition = `-${frameX}px 0`;
  
              frameIndex = (frameIndex + 1) % spriteSheetFrames;
  
              if (this.isRunning) {
                  requestAnimationFrame(animate);
              }
          };
  
          animate();
      }
  }
  
  stopRunAnimation() {
    this.isRunning = false;
    
    // Set the src attribute back to idleSrc when the horse stops running
    this.competitorHorseElement.src = this.idleSrc;

    // Reset the background image and size to idle state
    this.competitorHorseElement.style.backgroundImage = "none";
    this.competitorHorseElement.style.backgroundSize = "auto 32px";
  }
  
  updatePosition() {
    this.x += this.speed;
    this.competitorHorseElement.style.left = `${this.x}px`;

    // Call runAnimation when the horse starts running
    if (this.speed > 0 && !this.isRunning) {
        this.runAnimation();
    } else if (this.x >= 300) {
        // Call stopRunAnimation when the horse stops running
        this.stopRunAnimation();
    }
}

  useBoost() {
    if (this.boosts > 0 && !this.isBoostActive) {
        this.isBoostActive = true; // Mark boost as active

        console.log(`${this.name} started boosting!`);

        // Store the original speed before applying the boost
        const originalSpeed = this.speed;

        // Apply boost logic here, e.g., increase speed temporarily
        this.speed *= 2; // Example: double the speed

        // Set a timeout to revert the speed back to the original after 1 second
        setTimeout(() => {
            this.speed = originalSpeed;
            console.log(`${this.name}'s boost ended.`);
            this.isBoostActive = false; // Mark boost as inactive
        }, 1000);
        
        // Decrement the number of boosts
        this.boosts--;

    } else if (this.boosts === 0) {
        console.log(`${this.name} has run out of boosts and cannot boost right now.`);
    } else {
        console.log(`${this.name} cannot boost right now.`);
    }
}

//   raceEnd() {
//     console.log(`${this.name} has finished the race!`);
//     clearInterval(this.race.intervalId);
//     // this.race.raceEvent.raceFinish(this.name); // Pass the winner's name
// }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.competitorHorseElement);

    this.competitorHorseElement.style.backgroundImage = `url(${this.idleSrc})`;
    this.competitorHorseElement.style.backgroundSize = "auto 32px";
   
    this.update();

      // this.intervalId = setInterval(() => {
      //   this.updatePosition();
      // }, 100);
  }
}
