//function that retrieves weather data for a given city ID
async function getWeatherData(cityId) {
    // add API key and API URL with city ID
    const apiKey = '53d1fe82cd7d5d1d915f11c304da204e';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

    const cacheKey = `weatherData-${cityId}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData !== null) {
        const { data, timestamp } = JSON.parse(cachedData);
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - timestamp <= fiveMinutes) {
            return data;
        }
    }

    try {
        // Send GET request to API URL and wait for response
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Cache the data
        const timestamp = Date.now();
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp }));

        return data;
    } catch (error) {
        console.error(error);
    }
}
//updates the HTML document with weather data and a background color
function updateHtml(data, color) {
      // Extract timezone offset and timestamp from the weather data
    const timezoneOffset = data.timezone;
    const dt = data.dt;
      // Convert the timestamp to a date object and extract the date and time strings
    const now = new Date((dt + timezoneOffset) * 1000);
    const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
 
    // Convert sunrise and sunset timestamps to date objects and extract the time strings
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunrise_time = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const sunset = new Date(data.sys.sunset * 1000);
    const sunset_time = sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });


    //update the weatherInfo in the page
    document.getElementById('weatherInfo').innerHTML += `<div class="card">
    <div class="card_up" style="background-color:${color};">
        <div class="rec_up">
            <div id="city_name">${data.name}, ${data.sys.country}</div>
            <div id="time_date">${time}, ${date}</div>
            <div id="description"><img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">${data.weather[0].description}</div>
        </div>
        <div class="rec_up temp_r">
            <div id="temp">${data.main.temp.toFixed(0)}&#176;c</div>
            <div id="min_temp">Temp min : ${data.main.temp_min.toFixed(1)}&#176;c</div>
            <div id="max_temp">Temp max : ${data.main.temp_max.toFixed(1)}&#176;c</div>
        </div>
        
    </div>
    <div class="card_down">
        <div class="rec_down" >
            <div id="pressure"><b>Pressure: </b>${data.main.pressure}Hpa</div>
            <div id="humidity"><b>Humidity: </b> ${data.main.humidity}%</div>
            <div id="visibility"><b>Visibility: </b> ${data.visibility / 1000}km</div>

        </div>
        <div class="rec_down" style="border-left:1px solid #5d606d;border-right:1px solid #5d606d;text-align:center;">
            <div id="windicon"><svg style="transform: rotate(${140 + data.wind.deg}deg);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M1.923 9.37c-.51-.205-.504-.51.034-.689l19.086-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.475.553-.717.07L11 13 1.923 9.37zm4.89-.2l5.636 2.255 3.04 6.082 3.546-12.41L6.812 9.17z" fill="#ffffff"/> </g> </svg> </div>
            <div id="wind"><b>${data.wind.speed}m/s  ${data.wind.deg}&#176;</b></div>

        </div>
        <div class="rec_down">
            <div id="sunrise"><b>Sunrise: </b> ${sunrise_time}</div>
            <div id="sunrise"><b>Sunset: </b> ${sunset_time}</div>

        </div>

    </div>
</div>`;
}
// fetches weather data for each city code in the cityCodes array, and updates the HTML of the page with the returned data and a color.
fetch('http://localhost:3000/data') //fetch the array from the local server
    .then(response => response.json())
    .then(async data => {
        let cityCodes = data;

        let colors = ["#388EE7", "#8B49CC", "#3C882C", "#C63F3F", "#6249CC", "#1B127B", "#D847DB", "#138E78"];
        let count = 0;
        for (const element of cityCodes) {
            const weatherData = await getWeatherData(element);
            updateHtml(weatherData, colors[count]);
            count++;
            if (count >= colors.length) {
                count = 0;
            }
        }

    })
    .catch(error => console.error(error));