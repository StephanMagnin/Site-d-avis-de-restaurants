// Configuration pour le filtre (des notes)

const filterButton = document.querySelector(".filter");
const minRatingSelect = document.querySelector("#min-rating-select");
const maxRatingSelect = document.querySelector("#max-rating-select");

filterButton.addEventListener("click", () => {
  const min = minRatingSelect.value;
  const max = maxRatingSelect.value;
  if (min > max) {
    alert("Ce choix n'est pas possible");
    return;
  }
  myMap.minRating = min;
  myMap.maxRating = max;
  myMap.displayRestaurants(false, true);
});
