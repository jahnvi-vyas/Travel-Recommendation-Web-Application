const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const recommendationResults = document.getElementById("recommendationResults");
const countryTime = document.getElementById("countryTime");
const contactForm = document.getElementById("contactForm");

let travelData = {};

fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        travelData = data;
        displayAllRecommendations();
    })
    .catch(error => {
        console.error("Error loading JSON:", error);
    });

function createCard(item) {

    return `
        <div class="card">
            <div class="card-content">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

            </div>

        </div>
    `;

}

function displayAllRecommendations() {
    recommendationResults.innerHTML = "";

    travelData.countries.forEach(country => {

        country.cities.forEach(city => {

            recommendationResults.innerHTML += createCard(city);

        });

    });

    travelData.beaches.forEach(beach => {

        recommendationResults.innerHTML += createCard(beach);

    });

    travelData.temples.forEach(temple => {

        recommendationResults.innerHTML += createCard(temple);

    });

}

function searchRecommendation() {

    const keyword = searchInput.value.trim().toLowerCase();

    recommendationResults.innerHTML = "";

    if (keyword === "") {

        displayAllRecommendations();

        return;
    }

    let found = false;

    travelData.countries.forEach(country => {

        if (
            country.name.toLowerCase().includes(keyword) ||
            keyword === "country" ||
            keyword === "countries"
        ) {

            country.cities.forEach(city => {

                recommendationResults.innerHTML += createCard(city);

            });

            found = true;

        }

        country.cities.forEach(city => {

            if (city.name.toLowerCase().includes(keyword)) {

                recommendationResults.innerHTML += createCard(city);

                found = true;

            }

        });

    });

    if (keyword === "beach" || keyword === "beaches") {

        travelData.beaches.forEach(beach => {

            recommendationResults.innerHTML += createCard(beach);

        });

        found = true;

    } else {

        travelData.beaches.forEach(beach => {

            if (beach.name.toLowerCase().includes(keyword)) {

                recommendationResults.innerHTML += createCard(beach);

                found = true;

            }

        });

    }

    if (keyword === "temple" || keyword === "temples") {

        travelData.temples.forEach(temple => {

            recommendationResults.innerHTML += createCard(temple);

        });

        found = true;

    } else {

        travelData.temples.forEach(temple => {

            if (temple.name.toLowerCase().includes(keyword)) {

                recommendationResults.innerHTML += createCard(temple);

                found = true;

            }

        });

    }

    if (!found) {

        recommendationResults.innerHTML =

            "<h2>No travel recommendations found.</h2>";

    }

}

function clearSearch() {

    searchInput.value = "";

    displayAllRecommendations();

}

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        alert(
            "Thank you, " +
            name +
            "!\n\nYour message has been received.\nWe will contact you at " +
            email +
            " soon."
        );
        contactForm.reset();
    });
}

function updateTime() {

    const options = {

        timeZone: "America/New_York",

        hour12: true,

        hour: "numeric",

        minute: "numeric",

        second: "numeric"

    };

    const dateOptions = {

        timeZone: "America/New_York",

        year: "numeric",

        month: "long",

        day: "numeric"

    };

    const time = new Date().toLocaleTimeString("en-US", options);

    const date = new Date().toLocaleDateString("en-US", dateOptions);

    countryTime.innerHTML =

        `New York, USA<br>${date}<br>${time}`;

}

updateTime();

setInterval(updateTime, 1000);

searchBtn.addEventListener("click", searchRecommendation);

clearBtn.addEventListener("click", clearSearch);

searchInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchRecommendation();

    }

});