// Variables for the HTML elements
const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const forecast = document.querySelector('.forecast');
const day1 = document.querySelector('.day1');
const day2 = document.querySelector('.day2');
const day3 = document.querySelector('.day3');
const day4 = document.querySelector('.day4');
const day5 = document.querySelector('.day5');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Speech Synthesis function
function speak(text) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-IN';  // English (US)
        window.speechSynthesis.speak(speech);
    } else {
        console.log('Speech synthesis not supported');
    }
}

// Weather Tips based on conditions
function getWeatherTips(weatherMain) {
    let tips = "";
    switch (weatherMain) {
        case 'Clouds':
            tips = "It's cloudy today. You might want to carry a light jacket.";
            break;
        case 'Clear':
            tips = "It's a clear day. Don't forget your sunglasses!";
            break;
        case 'Rain':
            tips = "It's raining. Carry an umbrella and drive safely.";
            break;
        case 'Mist':
            tips = "It's misty outside. Be cautious if you're driving.";
            break;
        case 'Snow':
            tips = "Snowfall expected. Dress warmly and stay safe.";
            break;
        default:
            tips = "Have a great day!";
    }
    return tips;
}

// Main function to check weather
document.addEventListener('DOMContentLoaded',()=>{
async function checkWeather(city) {
    const api_key = "1c04e16025d17767a99c6f680617c438";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`; // Added &units=metric

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (weather_data.cod === "404") {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            speak("Sorry, location not found!");
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";

        // Updating the weather data
        const tempCelsius = Math.round(weather_data.main.temp);
        temperature.innerHTML = `${tempCelsius}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;

        // Get the main weather condition
        const weatherMain = weather_data.weather[0].main;
        const tips = getWeatherTips(weatherMain);

        // Speak the weather and tips
        const weatherInfo = `The weather in ${city} is ${weatherMain} with a temperature of ${tempCelsius} degrees Celsius. ${tips}`;
        speak(weatherInfo);

        // Set appropriate weather image
        switch (weatherMain) {
            case 'Clouds':
                weather_img.src = "/assets/cloud.png";
                break;
            case 'Clear':
                weather_img.src = "/assets/clear.png";
                break;
            case 'Rain':
                weather_img.src = "/assets/rain.png";
                break;
            case 'Mist':
                weather_img.src = "/assets/mist.png";
                break;
            case 'Snow':
                weather_img.src = "/assets/snow.png";
                break;
        }

        console.log(weather_data);

    } catch (error) {
        console.log('Error fetching weather data:', error);
    }
}




async function weatherForecast(city) {
    const api_key = "1c04e16025d17767a99c6f680617c438";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`; // Include &units=metric

    try {
        const response = await fetch(url);
        const forecasting = await response.json();
        console.log(forecasting);

        if (!forecasting.list || forecasting.list.length < 5) {
            console.error("Insufficient forecast data");
            return;
        }

        // Function to format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayOfWeek = days[date.getDay()];
            const month = months[date.getMonth()];
            const dayOfMonth = date.getDate();
            return `${dayOfWeek}, ${month} ${dayOfMonth}`;
        }

        function getDays(index){
            const data = forecasting.list[index];
            if (data) {
                return ` <b>${formatDate(data.dt_txt)}</b>`;
            } else {
                return "Day not available";
            }
        }


        function getDescription(index){
            const data = forecasting.list[index];
            if (data) {
                return ` <b>${data.weather[0].description}</b>`;
            } else {
                return "Desc not available";
            }
        }

        function getTempareture(index){
            const data = forecasting.list[index];
            if (data) {
                return ` <b>${Math.round(data.main.temp)}°C</b>`;
            } else {
                return "Temp not available";
            }
        }

        function getHumidity(index){
            const data = forecasting.list[index];
            if (data) {
                return ` <b>${data.main.humidity}%</b>`;
            } else {
                return "Humidity not available";
            }
        }

        function getWind(index){
            const data = forecasting.list[index];
            if (data) {
                return ` <b>${data.wind.speed} Km/H</b>`;
            } else {
                return "Wind Speed not available";
            }
        }

        // Helper function to get weather image source
        function getWeatherImage(weatherMain) {
            switch (weatherMain) {
                case 'Clouds':
                    return "/assets/cloud.png";
                case 'Clear':
                    return "/assets/clear.png";
                case 'Rain':
                    return "/assets/rain.png";
                case 'Mist':
                    return "/assets/mist.png";
                case 'Snow':
                    return "/assets/snow.png";
                default:
                    return "/assets/default.png"; // Default image if weather condition is not matched
            }
        }

        // Updating the forecast data and images for 5 days
        const forecastIndices = [8, 16, 24, 32, 39];
        const forecastDays = [
            {  imgElement: document.querySelector('.day1-img'), pElement: document.querySelector('.p1'), dElement: document.querySelector('.d1'), tElement: document.querySelector('.t1'), hElement: document.querySelector('.h1'), wElement: document.querySelector('.w1') },
            {  imgElement: document.querySelector('.day2-img'), pElement: document.querySelector('.p2'), dElement: document.querySelector('.d2'), tElement: document.querySelector('.t2'), hElement: document.querySelector('.h2'), wElement: document.querySelector('.w2')},
            {  imgElement: document.querySelector('.day3-img'), pElement: document.querySelector('.p3'), dElement: document.querySelector('.d3'), tElement: document.querySelector('.t3'), hElement: document.querySelector('.h3'), wElement: document.querySelector('.w3')},
            {  imgElement: document.querySelector('.day4-img'), pElement: document.querySelector('.p4'), dElement: document.querySelector('.d4'), tElement: document.querySelector('.t4'), hElement: document.querySelector('.h4'), wElement: document.querySelector('.w4')},
            {  imgElement: document.querySelector('.day5-img'), pElement: document.querySelector('.p5'), dElement: document.querySelector('.d5'), tElement: document.querySelector('.t5'), hElement: document.querySelector('.h5'), wElement: document.querySelector('.w5')}
        ];

        forecastIndices.forEach((index, i) => {
            const data = forecasting.list[index];
            if (data) {
                forecastDays[i].pElement.innerHTML = getDays(index);
                forecastDays[i].tElement.innerHTML = getTempareture(index);
                forecastDays[i].dElement.innerHTML = getDescription(index);
                forecastDays[i].hElement.innerHTML = getHumidity(index);
                forecastDays[i].wElement.innerHTML = getWind(index);
                const weatherMain = data.weather[0].main;
                const imgSrc = getWeatherImage(weatherMain);
                forecastDays[i].imgElement.src = imgSrc;
            }
        });

        // Display the forecast container
        forecast.style.display = 'flex';
    }catch (error) {
        console.error('Error fetching weather forecast:', error);
    }
}



// weatherForecast('Mumbai');

// Add event listener to the search button
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city) {
        checkWeather(city);
        weatherForecast(city);
    } else {
        speak("Please enter a location.");
    }
});

document.addEventListener('keypress', function (event) {
    // Check if the 'Enter' key is pressed
    if (event.key === 'Enter') {
        searchBtn.click(); // Simulate a button click
    }
});
});