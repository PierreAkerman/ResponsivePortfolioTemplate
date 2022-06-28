const baseApi = "https://localhost:7073/api/ArtPiece";
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const navMenu = document.querySelector(".navMenu");

const title = document.getElementById("title");
const description = document.getElementById("description");
const created = document.getElementById("created");
const price = document.getElementById("price");
const imgUrl = document.getElementById("imgUrl");

const editId = document.getElementById("id");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editPrice = document.getElementById("editPrice");
const editImgUrl = document.getElementById("editImgUrl");
const editImage = document.getElementById("editImage");

const artPostsGallery = document.getElementById("artPostsGallery");

const gallerySection = document.getElementById("gallerySection");
const newPostSection = document.getElementById("newPostSection");
const editPostSection = document.getElementById("editPostSection");

openMenu.addEventListener("click", () => {
  openMenu.style.display = "none";
  closeMenu.style.display = "block";
  navMenu.classList.toggle("active");
});

closeMenu.addEventListener("click", () => {
  closeMenu.style.display = "none";
  openMenu.style.display = "inline-block";
  navMenu.classList.toggle("active");
});

window.onscroll = () => {
  openMenu.style.display = null;
  closeMenu.style.display = null;
  navMenu.classList.remove("active");
};

createNewPost.addEventListener("click", () => {
  createArtPiece();
});

submitEditPost.addEventListener("click", () => {
  editArtPiece();
});

newPostLink.addEventListener("click", () => {
  showSection("newPostSection");
  navMenu.classList.remove("active");
});

artGalleryLink.addEventListener("click", () => {
  showSection("gallerySection");
  navMenu.classList.remove("active");
});

function showSection(sectionsId) {
  if (sectionsId == "gallerySection") {
    gallerySection.style.display = "block";
    newPostSection.style.display = "none";
    editPostSection.style.display = "none";
  } else if (sectionsId == "newPostSection") {
    editPostSection.style.display = "none";
    gallerySection.style.display = "none";
    newPostSection.style.display = "block";
  } else if (sectionsId == "editPostSection") {
    editPostSection.style.display = "block";
    gallerySection.style.display = "none";
    newPostSection.style.display = "none";
  }
}

class ArtPiece {
  constructor(id, title, created, description, price, imgUrl) {
    id = id;
    title = title;
    description = description;
    created = created;
    price = price;
    imgUrl = imgUrl;
  }
}

function createArtPiece() {
  const formdata = new FormData();
  formdata.append("title", title.value);
  formdata.append("description", description.value);
  formdata.append("price", price.value);
  formdata.append("imgUrl", imgUrl.files[0]);

  fetch("https://localhost:7073/Art/Create", {
    method: "POST",
    headers: {},
    body: formdata,
  })
    .then((response) => response.json())
    .then((data) => {
      loadGallery();
      showSection("gallerySection");
    });
}

function editArtPiece() {
  const formdata = new FormData();
  formdata.append("id", editId.value);
  formdata.append("title", editTitle.value);
  formdata.append("description", editDescription.value);
  formdata.append("price", editPrice.value);
  formdata.append("imgUrl", editImgUrl.files[0]);

  fetch("https://localhost:7073/Art/Update", {
    method: "POST",
    headers: {},
    body: formdata,
  }).then((data) => {
    loadGallery();
    showSection("gallerySection");
  });
}

function fillEditForm(id, title, description, price, imgUrl) {
  editId.value = id;
  editTitle.value = title;
  editDescription.value = description;
  editPrice.value = price;
  editImage.src = "https://localhost:7073/UploadedPics/" + imgUrl;
  showSection("editPostSection");
}

function deleteArtPost(id) {
  fetch("https://localhost:7073/api/ArtPiece/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then((data) => {
    loadGallery();
  });
}

function loadDetails(id) {
  let output = "";
  fetch(baseApi + "/" + id, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => data.json);
}

fetch("https://localhost:7073/api/ArtPiece/21", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => console.log(data));

// LADDAR UPP CARDS
function loadGallery() {
  let output = "";
  fetch(baseApi, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((post) => {
        output += `
            <div class="card" style="width: 22rem;">
                    <img src="https://localhost:7073/UploadedPics/${post.imgUrl}" class="card-img" alt="Art Photo" style="width:100%">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <button class="btn trash" onclick="deleteArtPost(${post.id})" ><i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn edit" onclick="fillEditForm(${post.id}, '${post.title}', '${post.description}', '${post.price}', '${post.imgUrl}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn edit" onclick="showDetails(${post.id})" ><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </div>
    `;
      });
      artPostsGallery.innerHTML = output;
    });
}

loadGallery();
