const express = require("express");
const fetch = require("node-fetch");
const redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

const FORECAST_DELAY = 10;

const API_KEY = "5a8cba7fba3d3fa370ee8a4a1163a599"; //process.env.DARKSKY_API_KEY;
const BASE_URL = `https://api.darksky.net/forecast`;

//fake forecast if API not reachable
const fakeForecast = {
  fakeData: true,
  latitude: 0,
  longitude: 0,
  timezone: "America/New_York",
  currently: {
    time: 0,
    summary: "Clear",
    icon: "clear-day",
    temperature: 43.4,
    humidity: 0.62,
    windSpeed: 3.74,
    windBearing: 208
  },
  daily: {
    data: [
      {
        time: 0,
        icon: "partly-cloudy-night",
        sunriseTime: 1553079633,
        sunsetTime: 1553123320,
        temperatureHigh: 52.91,
        temperatureLow: 41.35
      },
      {
        time: 86400,
        icon: "rain",
        sunriseTime: 1553165933,
        sunsetTime: 1553209784,
        temperatureHigh: 48.01,
        temperatureLow: 44.17
      },
      {
        time: 172800,
        icon: "rain",
        sunriseTime: 1553252232,
        sunsetTime: 1553296247,
        temperatureHigh: 50.31,
        temperatureLow: 33.61
      },
      {
        time: 259200,
        icon: "partly-cloudy-night",
        sunriseTime: 1553338532,
        sunsetTime: 1553382710,
        temperatureHigh: 46.44,
        temperatureLow: 33.82
      },
      {
        time: 345600,
        icon: "partly-cloudy-night",
        sunriseTime: 1553424831,
        sunsetTime: 1553469172,
        temperatureHigh: 60.5,
        temperatureLow: 43.82
      },
      {
        time: 432000,
        icon: "rain",
        sunriseTime: 1553511130,
        sunsetTime: 1553555635,
        temperatureHigh: 61.79,
        temperatureLow: 32.8
      },
      {
        time: 518400,
        icon: "rain",
        sunriseTime: 1553597430,
        sunsetTime: 1553642098,
        temperatureHigh: 48.28,
        temperatureLow: 33.49
      },
      {
        time: 604800,
        icon: "snow",
        sunriseTime: 1553683730,
        sunsetTime: 1553728560,
        temperatureHigh: 43.58,
        temperatureLow: 33.68
      }
    ]
  }
};

function getFakeForecast(location) {
  location = location || "40.7720232,-73.9732319";
  const commaAt = location.indexOf(",");

  // Create a new copy of the forecast
  const result = Object.assign({}, fakeForecast);
  result.latitude = parseFloat(location.substr(0, commaAt));
  result.longitude = parseFloat(location.substr(commaAt + 1));
  return result;
}

function getForecast(req, resp) {
  const location = req.params.location || "40.7720232,-73.9732319";
  const url = `${BASE_URL}/${API_KEY}/${location}`;
  fetch(url)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      setTimeout(() => {
        resp.json(data);
      }, FORECAST_DELAY);
    })
    .catch(err => {
      console.error("Dark Sky API Error:", err.message);
      resp.json(generateFakeForecast(location));
    });
}

function startExpress() {
  const app = express();
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Handle requests for the data
  app.get("/forecast/:location", getForecast);
  app.get("/forecast/", getForecast);
  app.get("/forecast", getForecast);

  return app.listen("8000", () => {
    console.log("local weather app server started on port 8000");
  });
}

startExpress();
