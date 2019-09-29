import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          {" "}
          Weather PWA
          <a href="https://darksky.net/poweredby/" class="powered-by">
            Powered by Dark Sky
          </a>
        </h1>
      </header>

      <main class="main">
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
    </div>
  );
}

export default App;
