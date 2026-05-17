// Map
let map;
let cachedPets = [];

function loadMap(){
    map = L.map('map').setView([38.9897, -76.9378], 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}
// Map Cordinates
function getRandomCoords() {
    const lat = 38.9897 + (Math.random() - 0.50);
    const lng = -76.9378 + (Math.random() - 0.50);
    return [lat, lng];
}

// Filtering Pets On Map
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

// Loads Pet Markers On Map
async function loadPetMarkers() {
    if (cachedPets.length === 0) {
        const res = await fetch("http://localhost:3000/pets");
        const pets = await res.json();

        cachedPets = pets.map(pet => ({
            ...pet,
            coords: getRandomCoords(),
            image:
                pet.animal_type?.toLowerCase() === "dog"
                    ? `https://place.dog/300/200?random=${Math.random()}`
                    : `https://cataas.com/cat?random=${Math.random()}`
        }));
    }

    const filteredPets = filterPets(cachedPets);
    filteredPets.forEach(pet => {
        const marker = L.marker(pet.coords).addTo(map);
        const popupContent = `
            <img src="${pet.image}" width="200"><br>
            <b>${pet.animal_type}</b><br>
            <b>Breed:</b> ${pet.breed}<br>
            <b>Color:</b> ${pet.color}<br>
            <b>Description:</b> ${pet.description}<br>
            <b>Location:</b> ${pet.last_seen_location}<br>
            <b>Contact:</b> ${pet.contact_information}
        `;
        marker.bindPopup(popupContent);
        marker.on("mouseover", () => {
            marker.openPopup();
        });

        marker.on("mouseout", () => {
            marker.closePopup();
        });
    });
}

// Reloads the Map to help Filter on the Map.
function reloadMap() {
    if (!map) return;
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    loadPetMarkers();
}

// Loads up pets Markers and Map
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("map")) {
        loadMap();
        setTimeout(() => {
            loadPetMarkers();
        }, 300);
    }
    const filters = [
        "typeFilter",
        "colorFilter",
        "breedFilter",
        "locationFilter"
    ];
    filters.forEach(id => {
        if (document.getElementById(id)) {
            document.getElementById(id).addEventListener("input", reloadMap);
            document.getElementById(id).addEventListener("change", reloadMap);
        }
    });
});

// Swiper
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

// Found Pets Load
async function loadFoundPets() {
    const response = await fetch("http://localhost:3000/pets");
    const pets = await response.json();
    const container = document.getElementById("petsContainer");
    container.innerHTML = "";

    pets.forEach(pet => {
        let image;
        if (pet.animal_type.toLowerCase() === "dog") {
            image = `https://place.dog/300/200?random=${Math.random()}`;
        } 
        else if (pet.animal_type.toLowerCase() === "cat") {
            image = `https://cataas.com/cat?width=300&height=200&random=${Math.random()}`;
        }
        const section = document.createElement("div");
        section.innerHTML = `
            <div class="pet-card" id="pet-${pet.id}">
                <img src="${image}" alt="pet image">

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
// This would have had the functions to add in the animals but sadly could not 
// figure it out.
