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
        
            <img src="${item.imageUrl}" alt="${item.name}">

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

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    recommendationResults.innerHTML = "";

    if (keyword === "") {
        alert("Please enter a search keyword.");
        return;
    }

    let results = [];

    if (keyword === "beach" || keyword === "beaches") {
        results = travelData.beaches;
    }

    else if (keyword === "temple" || keyword === "temples") {
        results = travelData.temples;
    }

    else if (keyword === "country" || keyword === "countries") {

        travelData.countries.forEach(country => {

            results.push(...country.cities);

        });

    }

    travelData.countries.forEach(country => {

        if (country.name.toLowerCase() === keyword) {

            results.push(...country.cities);

        }
        country.cities.forEach(city => {

            if (city.name.toLowerCase().includes(keyword)) {

                results.push(city);

            }

        });

    });

    travelData.beaches.forEach(beach => {

        if (beach.name.toLowerCase().includes(keyword)) {

            results.push(beach);

        }

    });

    travelData.temples.forEach(temple => {

        if (temple.name.toLowerCase().includes(keyword)) {

            results.push(temple);

        }

    });

    if (results.length === 0) {

        recommendationResults.innerHTML =
            "<h2>No recommendations found.</h2>";

        return;

    }

    results.forEach(item => {

        recommendationResults.innerHTML += `

        <div class="card">

            <img src="${item.imageUrl}" alt="${item.name}">

            <div class="card-content">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

            </div>

        </div>

        `;

    });

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