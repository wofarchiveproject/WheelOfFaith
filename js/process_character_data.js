let seasonsLoaded = [];

function isOnMobile() {
  if (document.querySelector("body.mobile")) {
    return true;
  }
  return false;
}

function clearCharacters() {
  const characters = document.querySelector("#characters");
  characters.innerHTML = "";
}

function showSeasonCharacters(season) {
  const locationHover = document.querySelector(".location-hover");
  const locationBackdrop = document.querySelector(".location-backdrop");
  locationHover.classList.add("hidden");
  locationBackdrop.classList.add("hidden");

  if (isOnMobile()) {
    const navMenuPopout = document.querySelector(".nav");
    navMenuPopout.classList.remove("popped-out");
  }

  const characterUrl = `./character_data/season ${season}/data.json`;
  const conversionUrl = './assets/stat-data/conversions.json';
  
  Promise.all([fetch(characterUrl).then(response => response.json()), fetch(conversionUrl).then(response => response.json())])
    .then(([characterData, conversionData]) => {
      for (const characterName in characterData) {
        populateCharacterTemplate(characterName, characterData[characterName], conversionData);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  
  function populateCharacterTemplate(characterName, characterData, conversionData) {
    const characterHolder = document.createElement("div");
    characterHolder.classList.add("character");
  
    // Create the modal element and its content
    const modal = document.createElement("div");
    modal.classList.add("modal");
  
    // Create a modal header with the character name
    const modalHeader = document.createElement("h3");
    modalHeader.textContent = characterName;
    modal.appendChild(modalHeader);
  
    // Loop through all the properties in characterData and create a list element for each
    const modalList = document.createElement("ul");
    for (const [key, value] of Object.entries(characterData)) {
      const listItem = document.createElement("li");
  
      // Check if the value is an object with properties
      if (typeof characterData[key] === "object" && Object.keys(characterData[key]).length > 0) {
        listItem.textContent = "";
        const subList = document.createElement("ul");
        subList.setAttribute("data-type-of-category", key);
        subList.classList.add(`has-${Object.keys(characterData[key]).length}-children`);
        subList.classList.add("category");
  
        // Loop through sub-properties and create nested list items
        for (const subKey in characterData[key]) {
          if (subKey === "Power Mastery" || subKey === "Weapon Mastery") continue; // Skip these keys
          
          const subListItem = document.createElement("li");
          
          // Create pill-shaped element for stats
          if (conversionData[subKey] || subKey === "Weapon" || subKey === "Power") {
            let statValue, statScore;
            let hasPlusNumber = characterData[key][subKey]?.match(/\+\d+/);
            let hasMinusNumber = characterData[key][subKey]?.match(/\-\d+/);
            
            let extra_number = 0;
            if (subKey === "Weapon" || subKey === "Power") {
              const masteryKey = `${subKey} Mastery`;
              if (!hasPlusNumber) {
                hasPlusNumber = characterData[key][masteryKey]?.match(/\+\d+/);
              }
              statValue = characterData[key][masteryKey].replace(/(\+|\-).*/, "").trim();
              statScore = conversionData[masteryKey][statValue] || 0;
              //console.log(statValue, statScore);
            } else {
              if (!hasMinusNumber) {
                hasMinusNumber = characterData[key][subKey]?.match(/\+\d+/);
              }
              if (characterData[key][subKey] === "Nigh-Omniscience" || characterData[key][subKey] === "Meta-Martia") {
                statValue = characterData[key][subKey].trim()
              } else {
                statValue = characterData[key][subKey].replace(/(\+|\-).*/, "").trim();
              }
              statScore = conversionData[subKey][statValue] || 0;
              //console.log(characterName, statValue);
            }
          
            if (hasPlusNumber) {
              // Access the number after the "+" sign
              extra_number = parseInt(hasPlusNumber[0].slice(1));
              //console.log(`PLUS: ${extra_number}:`);
              //console.log(characterData[key][subKey])
            } else if (hasMinusNumber) {
              extra_number = (parseInt(hasMinusNumber[0].slice(1)) * -1);
              //console.log(`MINUS: ${extra_number}`);
            }
            
            //console.log(hasPlusNumber, hasMinusNumber, extra_number);
            //console.log(statValue, statScore, extra_number);

            

            const pillBefore = document.createElement("span");
            const pill = document.createElement("span");
            const pillAfter = document.createElement("span");
            // Replace spaces with hyphens for valid class names
            const sanitizedSubKey = subKey.toLowerCase().replace(/\s+/g, '-');
            pillBefore.classList.add("stat-pill-before");
            pill.classList.add("stat-pill", `stat-${sanitizedSubKey}`);
            pillAfter.classList.add("stat-pill-after");

            // Handle nested pills for Weapon and Power
            const innerPill = document.createElement("span");
            const innerPillText = document.createElement("span");
            innerPill.classList.add("inner-stat-pill");
            
            // Determine the appropriate key to use for conversion
            let conversionKey;
            if (subKey === "Weapon") {
              conversionKey = "Weapon Mastery";
            } else if (subKey === "Power") {
              conversionKey = "Power Mastery";
            } else {
              conversionKey = subKey;
            }

            // Calculate the number of items for the specific stat category
            const numItems = Object.keys(conversionData[conversionKey]).length;
            if (statScore > 0) {
              innerPill.style.width = `calc(${(statScore / (numItems - 1)) * 100}% + 4px)`;
            } else {
              innerPill.style.width = `0px`;
            }

            if (extra_number < 0 || extra_number > 0) {
              pillAfter.style.width = `calc(${(extra_number / (numItems - 1)) * 100}%)`;
            }

            //if (statScore >= 1) {
            //  if (extra_number > 0) {
            //    pillAfter.style.width = `calc(${extra_number / numItems * 100})%`;
            //  } else {
            //    innerPill.style.width = `calc(${(statScore / numItems) * 100}% + 2px)`;
            //  }
            //} else {
            //  if (statScore == 0) {
            //    innerPill.style.width = `0px`;
            //    if (extra_number < 0) {
            //      pillBefore.style.width = `calc(-${extra_number / numItems * 100})%`;
            //    }
            //  }
            //}

            if (characterName === "stan29100502") {
              console.log(statScore, statValue, extra_number)
            }
            
            const ignoreInnerPills = ["Strength", "Speed", "Durability", "IQ", "Fight", "Chaos Force"];
            if (ignoreInnerPills.includes(subKey)) {
              // Do nothing
            } else {
              innerPillText.textContent = characterData[key][subKey];
            }

            innerPill.appendChild(innerPillText);
            pill.appendChild(pillBefore);
            pill.appendChild(innerPill);
            pill.appendChild(pillAfter);
  
            const statLabel = document.createElement("span");
            statLabel.textContent = `${subKey}: `;
            statLabel.style.display = "inline-block"; // Ensures the label doesn't wrap with the pill
            subListItem.appendChild(statLabel);
            subListItem.appendChild(pill);
  
            subList.appendChild(subListItem);

          } else {
            //console.log(subKey);
            subListItem.textContent = `${subKey}: ${characterData[key][subKey]}`;
            //console.log(subListItem.textContent);
  
            if (subListItem.textContent.includes("Chaos Factor")) {
              subListItem.textContent = "";
            } else if (subListItem.textContent.includes("Season")) {
              subListItem.textContent = "";
            }
            if (characterData[key][subKey] === "") {
              subListItem.textContent = "";
            }
            subList.appendChild(subListItem);
          }
        }
  
        listItem.appendChild(subList);
      } else {
        if (characterData[key] === "") {
          listItem.textContent = "";
        } else {
          listItem.textContent = `${key}: ${characterData[key]}`;
        }
  
        if (listItem.textContent.includes(".webp") || listItem.textContent.includes(".png") || listItem.textContent.includes(".jpg")) {
          listItem.textContent = "";
        }
  
        if (listItem.textContent.includes("Factor")) {
          listItem.textContent = "";
        }
      }
  
      modalList.appendChild(listItem);
    }
    modal.appendChild(modalList);
  
    // Create the backdrop element
    const modalBackdrop = document.createElement("div");
    modalBackdrop.classList.add("modal-backdrop");
  
    // Append the modal and backdrop to the characterHolder (initially hidden)
    characterHolder.appendChild(modalBackdrop);
    characterHolder.appendChild(modal);
  
    // Add event listener to the entire characterHolder (including its children)
    characterHolder.addEventListener('click', () => {
      const modal = characterHolder.querySelector('.modal');
      const backdrop = characterHolder.querySelector('.modal-backdrop');
      modal.classList.add("active");
      backdrop.classList.add("active");
    });
  
    const characterImage = document.createElement("img");
    characterImage.classList.add("character-card");
    characterImage.src = `./assets/images/characters/${characterData.Image}`;
    characterImage.onerror = function() {
      characterImage.src = "./assets/images/unavailable.png"
    }
  
    const characterInfoHolder = document.createElement("div");
    characterInfoHolder.classList.add("character-information-holder");
  
    const characterNameElement = document.createElement("span");
    characterNameElement.classList.add("character-name");
    characterNameElement.textContent = characterName;
  
    const characterSeasonElement = document.createElement("span");
    characterSeasonElement.classList.add("season");
    characterSeasonElement.classList.add("badge");
    characterSeasonElement.textContent = season;
  
    const characterRaceElement = document.createElement("span");
    characterRaceElement.classList.add("character-race");
    characterRaceElement.textContent = characterData.Race;
  
    // Append elements to the structure
    characterInfoHolder.appendChild(characterNameElement);
    characterInfoHolder.appendChild(characterRaceElement);
    characterInfoHolder.appendChild(characterSeasonElement);
    characterHolder.appendChild(characterImage);
    characterHolder.appendChild(characterInfoHolder);
  
    // Get the character container element from the HTML
    const characterContainer = document.querySelector("#characters");
  
    const xButton = document.createElement("div");
    xButton.textContent = "X";
    xButton.classList.add("closeModal");
    xButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const modal = characterHolder.querySelector('.modal');
      const backdrop = characterHolder.querySelector('.modal-backdrop');
      modal.classList.remove("active");
      backdrop.classList.remove("active");
    });
  
    modal.appendChild(xButton);
  
    characterContainer.appendChild(characterHolder);
  }
}
