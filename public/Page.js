//Map
let map;
function loadMap(){
    map = L.map('map').setView([32, -95], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

//Map Cordinates
function getRandomCoords() {
    const lat = 32 + (Math.random() - 0.5) * 2;
    const lng = -95 + (Math.random() - 0.5) * 2;
    return [lat, lng];
}

//
function filterPets(pets) {
    const type = document.getElementById("typeFilter")?.value || "all";
    const color = document.getElementById("colorFilter")?.value || "all";
    const breed = document.getElementById("breedFilter")?.value.toLowerCase() || "";
    const location = document.getElementById("locationFilter")?.value.toLowerCase() || "";

    return pets.filter(pet => {
        const petType = pet.animal_type?.toLowerCase();
        const petColor = pet.color?.toLowerCase();
        const petBreed = pet.breed?.toLowerCase();
        const petLocation = pet.last_seen_location?.toLowerCase();
        return (
            (type === "all" || petType === type) &&
            (color === "all" || petColor === color) &&
            (breed === "" || petBreed.includes(breed)) &&
            (location === "" || petLocation.includes(location))
        );
    });
}

async function loadPetMarkers() {

    const res = await fetch("http://localhost:3000/pets");
    const pets = await res.json();
    const filteredPets = filterPets(pets);
    filteredPets.forEach(pet => {

        const coords = getRandomCoords();
        const marker = L.marker(coords).addTo(map);

        let imageHtml = "";
        const type = pet.animal_type?.toLowerCase();
        if (type === "dog") {
            imageHtml = `<img src="https://place.dog/300/200?random=${Math.random()}">`;
        } else if (type === "cat") {
            imageHtml = `<img src="https://cataas.com/cat?random=${Math.random()}">`;
        } else {
            imageHtml = `<img src="https://via.placeholder.com/300x200?text=No+Image">`;
        }

        const popupContent = `
            ${imageHtml}<br>
            <b>${pet.animal_type}</b><br>
            <b>Breed:</b> ${pet.breed}<br>
            <b>Color:</b> ${pet.color}<br>
            <b>Description:</b> ${pet.description}<br>
            <b>Location:</b> ${pet.last_seen_location}<br>
            <b>Contact:</b> ${pet.contact_information}
        `;

        marker.on("mouseover", () => {
            marker.bindPopup(popupContent).openPopup();
        });
        marker.on("mouseout", () => {
            marker.closePopup();
        });
    });
}

function reloadMap() {
    if (!map) return;
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    loadPetMarkers();
}

window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("map")) {
        loadMap();
        setTimeout(() => {
            loadPetMarkers();
        }, 300);
    }
});

window.addEventListener("DOMContentLoaded", () => {

    const filters = [
        "typeFilter",
        "colorFilter",
        "breedFilter",
        "locationFilter"
    ];

    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", reloadMap);
            el.addEventListener("change", reloadMap);
        }
    });
});

//Swiper
function loadSwiper() {
    const container = document.getElementById("homePets");
    for (let i = 0; i < 6; i++) {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        slide.innerHTML = `
            <img src="https://place.dog/300/200?random=${Math.random()}">
            <img src="https://cataas.com/cat?random=${Math.random()}">
        `;

        container.appendChild(slide);
    }
    new Swiper(".swiper", {
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        pagination: {
            el: ".swiper-pagination"
        }
    });
}
window.addEventListener("DOMContentLoaded", loadSwiper);

//Found Pets Load
async function loadFoundPets() {
    const response = await fetch("http://localhost:3000/pets");
    const pets = await response.json();

    const container = document.getElementById("petsContainer");
    container.innerHTML = "";

    pets.forEach(pet => {

        let imageUrl;

        if (pet.animal_type.toLowerCase() === "dog") {
            imageUrl = `https://place.dog/300/200?random=${Math.random()}`;
        } 
        else if (pet.animal_type.toLowerCase() === "cat") {
            imageUrl = `https://cataas.com/cat?width=300&height=200&random=${Math.random()}`;
        } 
        else {
            imageUrl = "https://place.dog/300/200";
        }

        const section = document.createElement("div");

        section.innerHTML = `
            <div class="pet-card" id="pet-${pet.id}">
                <img src="${imageUrl}" alt="pet image">

                <h3>${pet.animal_type}</h3>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Color:</strong> ${pet.color}</p>
                <p><strong>Description:</strong> ${pet.description}</p>
                <p><strong>Location:</strong> ${pet.last_seen_location}</p>
                <p><strong>Contact:</strong> ${pet.contact_information}</p>

                <button onclick="confirmDelete(${pet.id})">
                    I found this pet
                </button>
            </div>
            <hr>
        `;

        container.appendChild(section);
    });
}
window.addEventListener("DOMContentLoaded", loadFoundPets);

//Found Pets Delete
async function confirmDelete(id) {
    const confirmed = confirm("Are you sure you have found this animal?");

    if (!confirmed) return;

    await fetch(`http://localhost:3000/pet/${id}`, {
        method: "DELETE"
    });

    document.getElementById(`pet-${id}`).remove();
}

//Lost Submit Button

