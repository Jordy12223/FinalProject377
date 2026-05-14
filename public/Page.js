const form = document.getElementById("lostPetForm");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const imageFile = document.getElementById("imageUpload").files[0];

        let imageBase64 = "";

        if (imageFile) {

            const reader = new FileReader();

            reader.onloadend = async () => {

                imageBase64 = reader.result;

                submitPet(imageBase64);

            };

            reader.readAsDataURL(imageFile);

        } 
        else {

            submitPet("");

        }

    });

}

async function submitPet(imageData) {

    const petData = {

        animal_type: document.getElementById("animalType").value,
        breed: document.getElementById("breed").value,
        status: "Lost",
        description: document.getElementById("description").value,
        color: document.getElementById("color").value,
        last_seen_location: document.getElementById("location").value,
        contact_information: document.getElementById("contact").value,
        image: imageData

    };

    console.log("SENDING:", petData);

    try {

        const response = await fetch("/pets", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(petData)

        });

        const data = await response.json();

        console.log("SERVER RESPONSE:", data);

        alert("Pet submitted!");

    } 
    catch (error) {

        console.log("ERROR:", error);

        alert("Submission failed");

    }

}