// Configuration pour la modal

const btnInfos = document.getElementById("restaurant-list-aside");
const closeModal = document.getElementsByClassName("close-modal")[0];
const bgModalInfos = document.querySelector(".modal");
const $bgModalContainer = document.querySelector(".modal-content-creating");

btnInfos.addEventListener("click", () => {
  bgModalInfos.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  bgModalInfos.style.display = "none";
});
