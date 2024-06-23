const locationSeasons = document.querySelector(".nav .location.seasons");
const locationHover = document.querySelector(".location-hover.seasons");
const locationBackdrop = document.querySelector(".location-backdrop");
const chevron = document.querySelector(".location.seasons span");

function showLocationHover() {
  locationHover.classList.toggle("hidden"); // Remove hidden class if needed

  if (locationBackdrop.classList.contains("hidden")) {
    locationBackdrop.classList.toggle("hidden")
  }

  chevron.classList.toggle("down");

}

const searchBar = document.querySelector("#container .search-container #searchbar");
const charactersContainer = document.querySelector("#characters");

searchBar.addEventListener("input", filterCharacters);

function filterCharacters() {
  const searchTerm = searchBar.value.toLowerCase(); // Get search term and convert to lowercase

  // Loop through all character cards
  const characters = charactersContainer.querySelectorAll(".character");
  for (const character of characters) {
    const characterName = character.querySelector(".character-information-holder .character-name").textContent.toLowerCase();

    // Check if name includes search term (case-insensitive)
    if (characterName.includes(searchTerm)) {
      character.style.display = "block"; // Show character card
    } else {
      character.style.display = "none"; // Hide character card
    }
  }
}

const mobilePopoutButton = document.querySelector(".mobile-menu-popout-button");
mobilePopoutButton.addEventListener("click", () => {
  const nav = document.querySelector("#navigation .nav");
  if (!locationHover.classList.contains("hidden")) {
    locationHover.classList.add("hidden");
    chevron.classList.remove("down")
  }
  nav.classList.toggle("popped-out");
})

function hideLocationPopups() {
  locationHover.classList.add("hidden");
  locationBackdrop.classList.add("hidden");
}

locationBackdrop.addEventListener("click", hideLocationPopups)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}