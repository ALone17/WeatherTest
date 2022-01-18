const backgroundFon = document.querySelector('.container');
const degSwitch = document.querySelector('.degrees-temperature');
const search = document.querySelector('.search');
const searchField = document.querySelector('.search-field');
const Precipitation = document.querySelector('.Precipitation');
const date = document.querySelector('.date');
const time = document.querySelector('.time');
const temperatureDegrees = document.querySelector('.degrees');
const cityName = document.querySelector('.city-name');
const weatherForTheDay = document.querySelector('.weather-for-the-day');
const weatherAllTemp = document.querySelector('.weather-all-temp');
const btnScrollLeft = document.querySelector('.btn-scroll--left');
const btnScrollRight = document.querySelector('.btn-scroll--right');


let celsiusNow;

async function test(e) {
    try {
        e.preventDefault();
        // searchField.value.split('').forEach(e => console.log('123456789'.indexOf(e)));
        if (Number.isInteger(Number(searchField.value))) return;
        const city = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchField.value}&language=ru`)).json();
        const { longitude, latitude, country, admin1 } = city.results[0];

        const { current_weather, hourly } = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&hourly=weathercode&hourly=apparent_temperature&current_weather=true&past_days=0&windspeed_unit=ms`)).json();
        console.log(current_weather);
        updateWeatherAnHours(hourly);
        updateTemperature(current_weather, country, admin1, hourly);
        document.querySelector('.weather-main').style.display = "grid";
        document.querySelector('.weather-main').style.animationPlayState = "running";
        document.querySelector('.weather-for-the-day').style.display = "flex";
        document.querySelector('.weather-for-the-day').style.animationPlayState = "running";
        document.querySelector('.section-error').style.display = "none";
        document.querySelector('.weather-speed').querySelector('span').textContent = `${current_weather.windspeed}м/c`;
        let clock;
        updateTimeAndDate(clock);

        searchField.value = '';
        searchField.blur();
        degSwitch.style.pointerEvents = 'auto';
        changeImgAndIcon(current_weather.weathercode);
        weatherAllTemp.scrollLeft = 0;
    }
    catch (e) {
        console.error('Упс');
        document.querySelector('.weather-main').style.display = "none";
        document.querySelector('.weather-main').style.animationPlayState = "paused";
        document.querySelector('.weather-for-the-day').style.display = "none";
        document.querySelector('.weather-for-the-day').style.animationPlayState = "paused";
        backgroundFon.style.backgroundImage = `url(img/error.jpg)`;
        document.querySelector('.section-error').style.display = "block";
        document.querySelector('.error').textContent = `Error: ${e}`;
    }
}

let degreesApparent;
const updateTemperature = function (current_weather, country, city, hourly) {
    temperatureDegrees.textContent = current_weather.temperature;
    cityName.textContent = `${city}, ${country}`;
    celsiusNow = current_weather.temperature;
    hourly.time.forEach((el, i) => {
        if (current_weather.time === el)
            document.querySelector('.degress-apparent').textContent = `Ощущается как: ${hourly.apparent_temperature[i]}°`;
        degreesApparent = hourly.apparent_temperature[i];
    });
};

const updateTimeAndDate = function (clock) {

    const optionDate = {
        weekday: 'narrow',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };


    const optionTime = {
        hour: 'numeric',
        minute: 'numeric',
    };

    if (clock) clearInterval(clock);

    const dateNow = new Intl.DateTimeFormat('ru-RU', optionDate);
    const timeNow = new Intl.DateTimeFormat('ru-RU', optionTime);

    clock = setInterval(function () {
        if (!(time.textContent === timeNow.format(new Date())))
            time.textContent = timeNow.format(new Date());
    }, 1000);

    date.textContent = dateNow.format(new Date());
};

const celsiusToFahrenheit = function (celsius) {
    return celsius * 1.8 + 32;
};

const changeImgAndIcon = function (Code) {

    backgroundFon.style.backgroundImage = `url(/img/осадки/${weatherIcon(Code)}.jpg)`;
    Precipitation.innerHTML = "";
    Precipitation.insertAdjacentHTML('afterbegin', `<ion-icon class="${(new Date().getHours() > 7 && new Date().getHours() < 20) || weatherIcon(Code) === "cloud" ? weatherIcon(Code) : 'moon'}-icon" name="${(new Date().getHours() > 7 && new Date().getHours() < 20) || weatherIcon(Code) === "cloud" ? weatherIcon(Code) : 'moon'}"></ion-icon>
    <p class="precipitation-name">${weatherCode(Code)}</p>`);

};

const weatherCode = function (Code) {
    const weatherCode = {
        0: 'Чистое небо',
        1: 'В основном ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Изморозь',
        51: 'Легкая изморозь',
        53: 'Умеренная изморозь',
        55: 'Плотная изморозь',
        56: 'Легкие заморозки',
        57: 'Плотные заморозки',
        61: 'Слабый дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        66: 'Слабый холодный дождь',
        67: 'Сильный холодный дождь',
        71: 'Небольшой снегопад',
        73: 'Умеренный снегопад',
        75: 'Сильный снегопад',
        77: 'Снежные зерна',
        80: 'Слабый дождь',
        81: 'Умеренный дождь',
        82: 'Сильный дождь',
        85: 'Слабый снежный ливень',
        86: 'Сильный снежный ливень',
        95: 'Гроза умеренная',
        96: 'Гроза с слабым градом',
        99: 'Гроза с сильным градом'
    }

    const prognoz = weatherCode[String(Code)];

    return prognoz;

}

const weatherIcon = function (Code) {
    switch (Code) {
        case 0: case 1:
            return 'sunny';
        case 2:
        case 3:
            return "cloud";
        case 45:
            return "cloud-download";
        case 48: case 51: case 53: case 55: case 56: case 57:
            return "snow";
        case 61: case 63: case 65: case 66: case 67:
        case 80: case 81: case 82:
            return "rainy";
        case 95: case 96: case 99:
            return "thunderstorm";
        case 71: case 73: case 77: case 85: case 86:
            return 'snow';

        default: return "ну ну";
    }

}

const updateWeatherAnHours = function (hourly) {
    weatherAllTemp.innerHTML = "";
    let time;
    hourly.temperature_2m.forEach((temp, index) => {
        const temperatureHours = new Date(hourly.time[index]);
        if (temperatureHours.getHours() === 0 ||
            temperatureHours.getHours() === 7 ||
            temperatureHours.getHours() === 12 ||
            temperatureHours.getHours() === 17) {
            if (index === 0 || temperatureHours.getDay() !== new Date(hourly.time[index - 1]).getDay()) {
                time = new Intl.DateTimeFormat('ru-RU', {
                    weekday: "long",
                    day: 'numeric', month: 'long', year: "numeric"
                }).format(temperatureHours);
                weatherAllTemp.insertAdjacentHTML('beforeend', `
                <div class="weater-for-the-days weater-for-the-days-${temperatureHours.getDay()}">
                <h3 class="weater-day">${time}</h3>
                </div>`)
            }
            let timeDay = new Intl.DateTimeFormat('ru-RU', {
                hour: 'numeric', minute: 'numeric'
            }).format(temperatureHours);
            const weatherCode = hourly.weathercode[index];
            console.log(time);
            document.querySelector(`.weater-for-the-days-${temperatureHours.getDay()}`).insertAdjacentHTML("beforeend", `
             <div class="weather-for-an-hours">
            <p class="time-hour">${timeDay}</p>
            <ion-icon class="${weatherIcon(weatherCode)}-icon" name="${weatherIcon(weatherCode)}"></ion-icon>
            <p class="degrees-hour">${temp}&deg;</p>
        </div>
            `);
        }
    });


};

weatherAllTemp.scroll({ left: 0, top: 0, behavior: "smooth" });

btnScrollLeft.addEventListener('click', function (e) {
    e.preventDefault();

    weatherAllTemp.scrollLeft -= 820;
})

btnScrollRight.addEventListener('click', function (e) {
    e.preventDefault();

    weatherAllTemp.scrollLeft += 820;
})

let celsiusAnHour = [];

degSwitch.addEventListener('click', function (e) {

    if (e.target.textContent === "C" && !(e.target.classList.contains('deg-activ'))) {
        temperatureDegrees.classList.remove('degreesF');
        temperatureDegrees.textContent = celsiusNow;
        document.querySelector('.degress-apparent').textContent = `Ощущается как: ${degreesApparent}°`;
        if (celsiusAnHour.length > 1) {
            [...document.querySelectorAll('.degrees-hour')]
                .forEach((el, i) => el.textContent = celsiusAnHour[i]);
            celsiusAnHour = [];
        }


    }
    if (e.target.textContent === "F" && !(e.target.classList.contains('deg-activ'))) {
        temperatureDegrees.classList.add('degreesF');
        temperatureDegrees.textContent = Math.trunc(celsiusToFahrenheit(celsiusNow));
        [...document.querySelectorAll('.degrees-hour')].forEach(el => {
            celsiusAnHour.push(el.textContent);
            el.textContent = `${Math.trunc(celsiusToFahrenheit(+el.textContent.replace('°', '')))}°`
        });
        document.querySelector('.degress-apparent').textContent = `Ощущается как: ${Math.trunc(celsiusToFahrenheit(degreesApparent))}°`;
    }

    if (e.target.classList.contains('deg')) {
        degSwitch.querySelectorAll('.deg').forEach(el => el.classList.remove('deg-activ'));
        e.target.classList.add('deg-activ');
    }

});

search.addEventListener('submit', test);


