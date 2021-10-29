class Marker {
  constructor(restaurant, user) {
    this.restaurant = restaurant;
    this.user = user;
  }

  // Méthode pour placer des marqueurs sur la carte autour de l'utilisateur
  addOnMap(map) {
    const position = {};
    if (this.restaurant.geometry) {
      position.lat = this.restaurant.geometry.location.lat();
      position.lng = this.restaurant.geometry.location.lng();
    } else {
      position.lat = this.restaurant.lat;
      position.lng = this.restaurant.long;
    }
    const iconBase = "http://maps.google.com/mapfiles/kml";
    const marker = new google.maps.Marker({
      position,
      map,
      title: "Cliquez pour plus de détails",
      icon: iconBase + "/pal2/icon32.png",
    });

    // Afficher le nom et l'adresse du restaurant dans l'infobulle
    let infoWindowOptions;
    if (this.restaurant.restaurantName) {
      infoWindowOptions = {
        content:
          this.restaurant.restaurantName +
          " " +
          "<br>" +
          this.restaurant.address,
      };
    } else {
      infoWindowOptions = {
        content: this.restaurant.name + " " + "<br>" + this.restaurant.vicinity,
      };
    }

    const infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker, "click", function () {
      infoWindow.open(map, marker);
    });

    return marker;
  }

  // Méthode pour placer un marquer personalisé sur l'emplacement de l'utilisateur
  addUserMap(map) {
    const iconBase = "http://maps.google.com/mapfiles/";
    const marker = new google.maps.Marker({
      position: { lat: this.user.lat, lng: this.user.lng },
      map,
      icon: iconBase + "kml/paddle/blu-circle.png",
    });
  }
}
