import React, { Component } from "react";
import { DateTime } from "luxon";

import "./App.css";

const weatherApp = {
  selectedLocations: {},
  addDialogContainer: document.getElementById("addDialogContainer")
};

class App extends Component {
  toggleAddDialog() {
    weatherApp.addDialogContainer.classList.toggle("visible");
  }

  addLocation() {
    // Hide the dialog
    this.toggleAddDialog();
    // Get the selected city
    const select = document.getElementById("selectCityToAdd");
    const selected = select.options[select.selectedIndex];
    const geo = selected.value;
    const label = selected.textContent;
    const location = { label: label, geo: geo };
    // Create a new card & get the weather data from the server
    const card = this.getForecastTemplate(location);
    this.getForecastFromNetwork(geo).then(forecast => {
      this.renderForecast(card, forecast);
    });
    // Save the updated list of selected cities.
    weatherApp.selectedLocations[geo] = location;
    this.saveLocationList(weatherApp.selectedLocations);
  }

  removeLocation(evt) {
    const parent = evt.srcElement.parentElement;
    parent.remove();
    if (weatherApp.selectedLocations[parent.id]) {
      delete weatherApp.selectedLocations[parent.id];
      this.saveLocationList(weatherApp.selectedLocations);
    }
  }

  renderForecast(card, data) {
    if (!data) {
      // There's no data, skip the update.
      return;
    }

    // Find out when the element was last updated.
    const cardLastUpdatedElem = card.querySelector(".card-last-updated");
    const cardLastUpdated = cardLastUpdatedElem.textContent;
    const lastUpdated = parseInt(cardLastUpdated);

    // If the data on the element is newer, skip the update.
    if (lastUpdated >= data.currently.time) {
      return;
    }
    cardLastUpdatedElem.textContent = data.currently.time;

    // Render the forecast data into the card.
    card.querySelector(".description").textContent = data.currently.summary;
    const forecastFrom = DateTime.fromSeconds(data.currently.time)
      .setZone(data.timezone)
      .toFormat("DDDD t");
    card.querySelector(".date").textContent = forecastFrom;
    card.querySelector(
      ".current .icon"
    ).className = `icon ${data.currently.icon}`;
    card.querySelector(".current .temperature .value").textContent = Math.round(
      data.currently.temperature
    );
    card.querySelector(".current .humidity .value").textContent = Math.round(
      data.currently.humidity * 100
    );
    card.querySelector(".current .wind .value").textContent = Math.round(
      data.currently.windSpeed
    );
    card.querySelector(".current .wind .direction").textContent = Math.round(
      data.currently.windBearing
    );
    const sunrise = DateTime.fromSeconds(data.daily.data[0].sunriseTime)
      .setZone(data.timezone)
      .toFormat("t");
    card.querySelector(".current .sunrise .value").textContent = sunrise;
    const sunset = DateTime.fromSeconds(data.daily.data[0].sunsetTime)
      .setZone(data.timezone)
      .toFormat("t");
    card.querySelector(".current .sunset .value").textContent = sunset;

    // Render the next 7 days.
    const futureTiles = card.querySelectorAll(".future .oneday");
    futureTiles.forEach((tile, index) => {
      const forecast = data.daily.data[index + 1];
      const forecastFor = DateTime.fromSeconds(forecast.time)
        .setZone(data.timezone)
        .toFormat("ccc");
      tile.querySelector(".date").textContent = forecastFor;
      tile.querySelector(".icon").className = `icon ${forecast.icon}`;
      tile.querySelector(".temp-high .value").textContent = Math.round(
        forecast.temperatureHigh
      );
      tile.querySelector(".temp-low .value").textContent = Math.round(
        forecast.temperatureLow
      );
    });

    // If the loading spinner is still visible, remove it.
    const spinner = card.querySelector(".card-spinner");
    if (spinner) {
      card.removeChild(spinner);
    }
  }

  saveLocationList(locations) {
    const data = JSON.stringify(locations);
    localStorage.setItem("locationlist", data);
  }

  loadLocationList() {
    let locations = localStorage.getItem("locationList");
    if (locations) {
      try {
        locations = JSON.parse(locations);
      } catch (ex) {
        locations = {};
      }
    }
    if (!locations || Object.keys(locations).length === 0) {
      const key = "40.7720232,-73.9732319";
      locations = {};
      locations[key] = {
        label: "New York City",
        geo: "40.7720232,-73.9732319"
      };
    }
    return locations;
  }

  getForecastTemplate(location) {
    const id = location.geo;
    const card = document.getElementById(id);
    if (card) {
      return card;
    }
    const newCard = document.getElementById("weather-template").cloneNode(true);
    newCard.querySelector(".location").textContent = location.label;
    newCard.setAttribute("id", id);
    newCard
      .querySelector(".remove-city")
      .addEventListener("click", this.removeLocation.bind(this));
    document.querySelector("main").appendChild(newCard);
    newCard.removeAttribute("hidden");
    return newCard;
  }

  getForecastFromNetwork(coords) {
    return fetch(`forecast/${coords}`)
      .then(response => {
        return response.json();
      })
      .catch(() => {
        return null;
      });
  }

  getForecastFromCache(coords) {
    if (!("caches" in window)) {
      return null;
    }
    const url = `${window.location.origin}/forecast/${coords}`;
    return caches
      .match(url)
      .then(response => {
        if (response) {
          return response.json();
        }
        return null;
      })
      .catch(err => {
        console.error("Error getting data from cache", err);
        return null;
      });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>
            {" "}
            Weather PWA{" "}
            <a href="https://darksky.net/poweredby/" class="powered-by">
              {" "}
              Powered by Dark Sky
            </a>
          </h1>
          <button id="butInstall" aria-label="Install"></button>
        </header>

        <main class="main">
          <button
            onClick={this.toggleAddDialog.bind(this)}
            id="butAdd"
            class="fab"
            aria-label="Add"
          >
            <span class="icon add"></span>
          </button>

          <div id="weather-template" class="weather-card" hidden>
            <div class="card-spinner">
              <svg viewBox="0 0 32 32" width="32" height="32">
                <circle cx="16" cy="16" r="14" fill="none"></circle>
              </svg>
            </div>
            <button class="remove-city">&times;</button>
            <div class="city-key" hidden></div>
            <div class="card-last-updated" hidden></div>
            <div class="location">&nbsp;</div>
            <div class="date">&nbsp;</div>
            <div class="description">&nbsp;</div>
            <div class="current">
              <div class="visual">
                <div class="icon"></div>
                <div class="temperature">
                  <span class="value"></span>
                  <span class="scale">°F</span>
                </div>
              </div>
              <div class="description">
                <div class="humidity">
                  <span class="label">Humidity:</span>
                  <span class="value"></span>
                  <span class="scale">%</span>
                </div>
                <div class="wind">
                  <span class="label">Wind:</span>
                  <span class="value"></span>
                  <span class="scale">mph</span>
                  <span class="direction"></span>°
                </div>
                <div class="sunrise">
                  <span class="label">Sunrise:</span>
                  <span class="value"></span>
                </div>
                <div class="sunset">
                  <span class="label">Sunset:</span>
                  <span class="value"></span>
                </div>
              </div>
            </div>
            <div class="future">
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
              <div class="oneday">
                <div class="date"></div>
                <div class="icon"></div>
                <div class="temp-high">
                  <span class="value"></span>°
                </div>
                <div class="temp-low">
                  <span class="value"></span>°
                </div>
              </div>
            </div>
          </div>
        </main>

        <div id="addDialogContainer">
          <div class="dialog">
            <div class="dialog-title">Add new city</div>
            <div class="dialog-body">
              <select id="selectCityToAdd" aria-label="City to add">
                <option value="28.6472799,76.8130727">Dehli, India</option>
                <option value="-5.7759362,106.1174957">
                  Jakarta, Indonesia
                </option>
                <option value="51.5287718,-0.2416815">London, UK</option>
                <option value="40.6976701,-74.2598666">New York, USA</option>
                <option value="48.8589507,2.2770202">Paris, France</option>
                <option value="-64.8251018,-63.496847">
                  Port Lockroy, Antarctica
                </option>
                <option value="37.757815,-122.5076401">
                  San Francisco, USA
                </option>
                <option value="31.2243085,120.9162955">Shanghai, China</option>
                <option value="35.6735408,139.5703032">Tokyo, Japan</option>
              </select>
            </div>
            <div class="dialog-buttons">
              <button
                onClick={this.toggleAddDialog.bind(this)}
                id="butDialogCancel"
                class="button"
              >
                Cancel
              </button>
              <button
                onClick={this.addLocation.bind(this)}
                id="butDialogAdd"
                class="button"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <script src="../public/install.js"></script>
      </div>
    );
  }

  componentDidMount() {
    weatherApp.addDialogContainer = document.getElementById(
      "addDialogContainer"
    );
    weatherApp.selectedLocations = this.loadLocationList();
    Object.keys(weatherApp.selectedLocations).forEach(key => {
      const location = this.loadLocationList()[key];
      const card = this.getForecastTemplate(location);
      this.getForecastFromCache(location.geo).then(forecast => {
        this.renderForecast(card, forecast);
      });
      this.getForecastFromNetwork(location.geo).then(forecast =>
        this.renderForecast(card, forecast)
      );
    });
  }
}
export default App;
