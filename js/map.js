class MyMap {
  constructor() {
    this.position = { lat: 46.5333, lng: 6.6667 };
    this.$restaurantListAside = document.querySelector(
      "#restaurant-list-aside"
    );
    this.centerMap();
    this.minRating = 0;
    this.maxRating = 5;
    this.markers = [];
  }

  /* Récupere la position de l'utilisateur via le navigateur
  en cas d'echec une position par défaut est définie */
  getCenterPosition() {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.position.lat = position.coords.latitude;
            this.position.lng = position.coords.longitude;
            resolve("user_position");
          },
          (error) => {
            resolve("default_position");
          }
        );
      } else {
        resolve("default_position");
      }
    });
  }

  // Centrer la position de l'utilisateur sur la map
  async centerMap() {
    const position = await this.getCenterPosition();
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: this.position,
      zoom: 12,
      mapTypeControl: false,
    });

    this.clickAddMarker();

    this.service = new google.maps.places.PlacesService(this.map);

    const marker = new Marker(null, this.position);
    marker.addUserMap(this.map);
    if (position === "default_position") {
      this.initRestaurantWithJson("../json/restaurants.json");
    } else {
      this.getRestaurantAround();
    }
  }

  /* Permet de récuperer le contenu du fichier restaurant.json 
     en cas d'echec message d'erreur */
  initRestaurantWithJson(url) {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert(`Une erreur est survenue: $STATUS REQUEST:${response.status}`);
        }
      })
      .then((restaurants_) => {
        this.restaurants = restaurants_;
        this.displayRestaurants(true);
      });
  }

  displayRestaurant(restaurant, fromjson = false) {
    if (
      fromjson ||
      (restaurant.vicinity && restaurant.geometry && restaurant.name)
    ) {
      if (!restaurant.rating) {
        restaurant.rating = 0;
      }

      const marker = new Marker(restaurant);
      let myMarker = marker.addOnMap(this.map);
      //Ajouter au tableau markers
      this.markers.push(myMarker);

      new Restaurant(
        restaurant,
        marker,
        this.$restaurantListAside,
        this.service,
        this.map
      );
    } else {
      console.log("NON");
    }
  }

  displayRestaurants(fromjson, shouldFilter) {
    this.$restaurantListAside.innerHTML = "";
    if (shouldFilter) {
      filterRestaurants = this.restaurants.filter((restaurant) => {
        return (
          restaurant.rating >= this.minRating &&
          restaurant.rating <= this.maxRating
        );
      });
    } else {
      filterRestaurants = [...this.restaurants];
    }

    this.deleteMarkers();

    filterRestaurants.forEach((restaurant) => {
      this.displayRestaurant(restaurant, fromjson);
    });
  }

  // Récupere les restaurants autour de 5km
  getRestaurantAround() {
    const request = {
      location: this.position,
      radius: "5000",
      type: ["restaurant"],
    };

    this.service.nearbySearch(request, (restaurants, status) => {
      if (status == "OK") {
        this.restaurants = restaurants;
        this.displayRestaurants(false);
      }
    });
  }

  // Ajoute un restaurant manuellement au clic de la souris sur la map
  clickAddMarker() {
    this.map.addListener("click", (e) => {
      const clickPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      const restaurantName = prompt(
        "Veuillez saisir un nom pour ce restaurant"
      );

      const confirmChoice = confirm(
        `Voulez-vous ajouter le restaurant ${restaurantName} sur la map`
      );
      if (confirmChoice) {
        const marker = new Marker(clickPosition);
        marker.addOnMap(this.map);
        const geocoder = new google.maps.Geocoder();
        geocoder
          .geocode({ location: clickPosition })
          .then((response) => {
            if (response.results[0]) {
              const address = response.results[0].formatted_address;
              const confirmation = confirm(
                `Confirmez-vous que cette adresse correspond au restaurant que vous souhaitez ajouter ? ${address}`
              );
              if (confirmation) {
                const restaurant = {
                  geometry: { location: e.latLng },
                  vicinity: address,
                  name: restaurantName,
                  rating: 0,
                };
                this.displayRestaurant(restaurant, false);
              }
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Geocoder failed due to: " + e));
      }
    });
  }

  // Efface les marquers après avoir filtré les restaurants
  deleteMarkers() {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
  }
}
