class Restaurant {
  constructor(
    {
      name,
      vicinity,
      geometry,
      rating,
      restaurantName,
      address,
      lat,
      long,
      ratings,
      place_id,
    },
    marker,
    $restaurantListAside,
    service,
    map
  ) {
    if (restaurantName && address && lat && long && ratings) {
      this.restaurantName = restaurantName;
      this.address = address;
      this.lat = lat;
      this.long = long;
      this.ratings = ratings;
    } else {
      this.restaurantName = name;
      this.address = vicinity;
      this.lat = geometry.location.lat();
      this.long = geometry.location.lng();
      this.ratings = rating;
      this.place_id = place_id;
      this.service = service;
    }

    this.marker = marker;
    this.map = map;
    this.$reviewList;
    this.displayOnAsideMap($restaurantListAside);
  }

  // Méthode pour styliser et afficher le contenu dans l'aside
  displayOnAsideMap($restaurantListAside) {
    let rating = 0;
    if (typeof this.ratings == "number") {
      rating = this.ratings;
    } else {
      rating = this.calcRatings();
    }
    const $li = document.createElement("li");
    const $h3 = document.createElement("h3");
    $h3.innerText = `${this.restaurantName}`;
    const $pAdress = document.createElement("p");
    $pAdress.innerText = `${this.address}`;
    const $pNotes = document.createElement("p");
    $pNotes.innerText = `Notes ${rating}`;
    const $button = document.createElement("button");
    $button.innerText = `Plus d'infos`;
    $li.appendChild($h3);
    $li.appendChild($pAdress);
    $li.appendChild($pNotes);
    $li.appendChild($button);
    $button.addEventListener("click", () => {
      this.setBgModalInfos();
    });
    $restaurantListAside.appendChild($li);
  }

  // Méthode pour gérer le contenu de ma modal
  setBgModalInfos() {
    $bgModalContainer.innerHTML = "";
    const $pano = document.createElement("div");
    $pano.className = "modal-streetview-container";
    $bgModalContainer.appendChild($pano);
    this.displayStreetView($pano);
    this.displayCommentForm();
    this.displayComments();
  }

  // Méthode pour afficher la streetview
  displayStreetView($pano) {
    const panorama = new google.maps.StreetViewPanorama($pano, {
      position: { lat: this.lat, lng: this.long },
      pov: {
        heading: 34,
        pitch: 10,
      },
    });
    this.map.setStreetView(panorama);
  }

  // Méthode créer le formulaire d'ajout + poster un (commentaire)
  displayCommentForm() {
    const $form = document.createElement("form");
    $bgModalContainer.appendChild($form);
    const formInnerHtml = `
    <p>
      <label for="textarea-comment">Laisser un commentaire</label>
        <textarea name="texareaComment" id="textarea-comment" cols="30" rows="3"></textarea>
    </p>
        <p>
          <label for="select-rate-comment">Attribuer une note</label>
          <select name="selectRateComment" id="select-rate-comment">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </p>
        <input type="submit" value="Poster">
    `;
    $form.innerHTML = formInnerHtml;
    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      const content = document.getElementById("textarea-comment").value.trim();
      const rate = document.getElementById("select-rate-comment").value.trim();
      const restaurantIndex = restaurants.findIndex(
        (restaurant) => restaurant.place_id == this.place_id
      );
      const review = {
        text: content,
        rating: rate,
        author_name: "Moi",
      };
      restaurants[restaurantIndex].reviews.splice(0, 0, review);
      const $newReview = this.createReview(review);
      this.$reviewList.insertBefore($newReview, this.$reviewList.firstChild);
    });
  }

  // Méthode pour afficher les commentaires posté
  displayComments() {
    this.$reviewList = document.createElement("ul");
    $bgModalContainer.appendChild(this.$reviewList);
    const restaurantIndex = restaurants.findIndex(
      (restaurant) => restaurant.place_id == this.place_id
    );
    if (restaurantIndex > -1) {
      const reviews = restaurants[restaurantIndex].reviews;
      this.displayReviews(reviews, this.$reviewList);
    } else {
      const request = {
        placeId: this.place_id,
        fields: ["reviews"],
      };
      this.service.getDetails(request, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.displayReviews(place.reviews, this.$reviewList);
          restaurants.push({
            place_id: this.place_id,
            reviews: place.reviews,
          });
        }
      });
    }
  }

  // Méthode pour créer, un nouveau commentaire
  createReview(review) {
    const $li = document.createElement("li");
    $li.innerHTML = `<p class="review-author">Publier par : ${review.author_name}</p>
    <p>${review.text}</p>
    <p class="review-rating">${review.rating}</p>`;

    return $li;
  }

  // Méthode pour afficher les commentaires fait en direct pendant la démo
  displayReviews(reviews) {
    reviews.forEach((review) => {
      const $review = this.createReview(review);
      this.$reviewList.appendChild($review);
    });
  }

  //Méthode pour arrondir la note des restaurants ( en faire une moyenne )
  calcRatings() {
    let total = 0;
    this.ratings.forEach((rating) => {
      total += rating.stars;
    });
    return Math.round((total / this.ratings.length) * 10) / 10;
  }
}
