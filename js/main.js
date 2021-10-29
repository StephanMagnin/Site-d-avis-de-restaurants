// Fonction pour initaliser la map dans l'application
function initMap() {
  myMap = new MyMap();

  // Message pour avertir les utilisateurs de bien activer la géolicalisation
  alert(
    "Bonjour et bienvenue dans la section avis & restaurants. Veuillez noter que pour bénéficier de toutes les fonctionnalités de l'application, il est préferable d'autoriser l'accès à la localisation sur votre navigateur. Néoanmois si vous refusez les fonctionnalités principales vous seront accessibles."
  );
}

// variables globales
let restaurants = [];
let filterRestaurants = [];
let myMap;
