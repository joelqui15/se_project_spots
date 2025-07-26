import { data } from "autoprefixer";
import "../pages/index.css";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

//const initialCards = [
//{
//name: "Golden Gate bridge",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//},
//{
//name: "Val Thorens",
//link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//},
//{
//name: "Restaurant terrace",
//link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//},
//{
//name: "An outdoor cafe",
//link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//},
// {
// name: "A very long bridge, over the forest and through the trees",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//},
// {
//   name: "Tunnel with morning light",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
// },
// {
//   name: "Mountain house",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//
// },
//];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "71047314-a332-46a2-814c-ea3e8c58fd23",
    "Content-Type": "application/json",
  },
});

api

  .renderCardInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    const profileAvatar = document.querySelector(".profile__avatar");
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

//set up updateUserInfo and updateUserAvatar methods

//edit avatar modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarModalForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalBtn = deleteModal.querySelector(
  ".modal__save-btn_type_delete"
);

//edit modal
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
//new post modal
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const submitButton = newPostModal.querySelector(".modal__save-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector("#new-post-form");
const newPostImageLink = newPostModal.querySelector("#image-link-input");
const newPostCaption = newPostModal.querySelector("#caption-input");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

let selectedCard;
let selectedCardId;

let currentUserId;

// card items
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.likes?.some((user) => user._id === currentUserId)) {
    cardElement
      .querySelector(".card__like-btn")
      .classList.add("card__like-btn_active");
  }

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtn.addEventListener("click", () => {
    cardDeleteHandler(cardElement, data._id);
  });

  cardImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });
  console.log("Card likes:", data.likes);
  console.log("Current user ID:", currentUserId);
  return cardElement;
}

function cardDeleteHandler(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
  resetValidation(newPostForm, [newPostImageLink, newPostCaption], settings);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function closeModalEvents(event) {
  const openedModal = document.querySelector(".modal_is-opened");

  if (event.type === "keydown" && event.key === "Escape" && openedModal) {
    closeModal(openedModal);
  }

  if (event.type === "mousedown" && event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
}

document.addEventListener("keydown", closeModalEvents);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", closeModalEvents);
});

//like status handler
function handleLike(evt, cardId) {
  //check if the card is already liked
  const isNowLiked = evt.target;
  const isLiked = isNowLiked.classList.contains("card__like-btn_active");
  api
    .likeStatus({ cardId, isLiked })
    .then((updatedCard) => {
      const isNowLiked = updatedCard.likes?.some(
        (user) => user._id === currentUserId
      );
      if (isNowLiked) {
        isNowLiked.classList.add("card__like-btn_active");
      } else {
        isNowLiked.classList.remove("card__like-btn_active");
      }
    })
    .catch(console.error);
}
// Avatar modal open & close handlers
avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

//submit handler for avatar modal
avatarModalForm.addEventListener("submit", avatarHandlerSubmit);

function avatarHandlerSubmit(evt) {
  evt.preventDefault();
  api
    .updateUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      // Use data for updating the avatar
      const profileAvatar = document.querySelector(".profile__avatar");
      profileAvatar.alt = "User avatar";
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

function createCardHandlerSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: newPostCaption.value,
    link: newPostImageLink.value,
  };

  api
    .createCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
    })
    .catch(console.error);
}
//delete card handler
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId) // Use selectedCardId to delete the card
    .then(() => {
      selectedCard.remove(); // Remove the card element from the DOM
      closeModal(deleteModal);
    })
    .catch(console.error);
}

// Event listeners for delete modal buttons
deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalBtn.addEventListener("click", handleDeleteSubmit);

// Event listeners for new post form submission
newPostForm.addEventListener("submit", createCardHandlerSubmit);

function editProfileHandlerSubmit(evt) {
  evt.preventDefault();
  api
    .updateUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      // Use data for updating the profile
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", editProfileHandlerSubmit);

function newPostHandlerSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: newPostCaption.value,
    link: newPostImageLink.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
  disabledButton(submitButton, settings);

  newPostForm.reset();
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

newPostForm.addEventListener("submit", newPostHandlerSubmit);

enableValidation(settings);
