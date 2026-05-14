import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import Navbar from "./components/navBar";
import "./App.css";

const API_WEATHER =
  // "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=fe3597c6c0f04584b1e173127230512&q=";
  
  "https://api.weatherapi.com/v1/forecast.json?key=ffdd5d05d8f6478398e195037261405&lang=es";

const DEFAULT_CITY = "Cordoba, Argentina";

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    temp: "",
    icon: "",
    conditionText: "",
    feel: "",
    humidity: "",
    wind: "",
    date: "",
    sunrise: "",
    sunset: "",
  });

  const translateCondition = useCallback((condition) => {
  const conditions = {
    sunny: "Soleado",
    clear: "Despejado",
    "partly cloudy": "Parcialmente nublado",
    cloudy: "Nublado",
    overcast: "Cubierto",
    mist: "Neblina",
    fog: "Niebla",
    "patchy rain possible": "Posibles lluvias aisladas",
    "light rain": "Lluvia ligera",
    "moderate rain": "Lluvia moderada",
    "heavy rain": "Lluvia fuerte",
    thunderstorm: "Tormenta",
    snow: "Nieve",
  };

  const normalizedCondition = condition.trim().toLowerCase();

  return conditions[normalizedCondition] || condition;
}, []);

  const parseWeatherData = useCallback(
    (xmlDoc, cityName) => {
      const tempC = xmlDoc.querySelector("temp_C")?.textContent;
      const weatherIconUrl =
        xmlDoc.querySelector("weatherIconUrl")?.textContent;
      const weatherDesc = xmlDoc.querySelector("weatherDesc")?.textContent;
      const feelsLike = xmlDoc.querySelector("FeelsLikeC")?.textContent;
      const humidity = xmlDoc.querySelector("humidity")?.textContent;
      const wind = xmlDoc.querySelector("windspeedKmph")?.textContent;
      const date = xmlDoc.querySelector("weather > date")?.textContent;
      const sunrise = xmlDoc.querySelector(
        "weather > astronomy > sunrise"
      )?.textContent;
      const sunset = xmlDoc.querySelector(
        "weather > astronomy > sunset"
      )?.textContent;

      if (!tempC) {
        throw new Error("No se pudo obtener el clima de esa ubicación.");
      }

      setWeather({
        city: cityName,
        temp: tempC,
        icon: weatherIconUrl || "",
        conditionText: translateCondition(weatherDesc || ""),
        feel: feelsLike || "",
        humidity: humidity || "",
        wind: wind || "",
        date: date || "",
        sunrise: sunrise || "",
        sunset: sunset || "",
      });
    },
    [translateCondition]
  );

  const getWeatherByCity = useCallback(
    async (cityToSearch) => {
      setLoading(true);
      setError({
        error: false,
        message: "",
      });

      try {
        const response = await fetch(`${API_WEATHER}${cityToSearch}`);
        const dataText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dataText, "text/xml");

        const apiError = xmlDoc.querySelector("error > msg")?.textContent;

        if (apiError) {
          throw new Error(
            "No encontramos esa ciudad. Probá con otra ubicación."
          );
        }

        const location =
          xmlDoc.querySelector("request > query")?.textContent || cityToSearch;

        parseWeatherData(xmlDoc, location);
      } catch (error) {
        setError({
          error: true,
          message: error.message,
        });

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [parseWeatherData]
  );

  const getCityByCoordinates = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      const data = await response.json();

      const cityName =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.state ||
        "Ubicación actual";

      const countryName = data.address?.country || "";

      return countryName ? `${cityName}, ${countryName}` : cityName;
    } catch (error) {
      console.error("Error obteniendo nombre de ciudad:", error.message);
      return "Ubicación actual";
    }
  }, []);

  const getLocationByIP = useCallback(async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (!data.city || !data.country_name) {
        throw new Error("No se pudo obtener la ubicación por IP.");
      }

      const locationByIP = `${data.city}, ${data.country_name}`;

      await getWeatherByCity(locationByIP);
    } catch (error) {
      console.error("Error obteniendo ubicación por IP:", error.message);

      await getWeatherByCity(DEFAULT_CITY);
    }
  }, [getWeatherByCity]);

  const getWeatherByCoordinates = useCallback(
    async (coordinates) => {
      setLoading(true);
      setError({
        error: false,
        message: "",
      });

      try {
        const response = await fetch(
          `${API_WEATHER}${coordinates.latitude},${coordinates.longitude}`
        );

        const dataText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dataText, "text/xml");

        const apiError = xmlDoc.querySelector("error > msg")?.textContent;

        if (apiError) {
          throw new Error("No se pudo obtener el clima por coordenadas.");
        }

        const cityName = await getCityByCoordinates(
          coordinates.latitude,
          coordinates.longitude
        );

        parseWeatherData(xmlDoc, cityName);
      } catch (error) {
        setError({
          error: true,
          message: error.message,
        });

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [parseWeatherData, getCityByCoordinates]
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError({
        error: true,
        message: "El campo ubicación es obligatorio.",
      });
      return;
    }

    try {
      await getWeatherByCity(city);
      setCity("");
    } catch (error) {
      console.error("Error buscando ciudad:", error.message);
    }
  };

  useEffect(() => {
    const getInitialLocation = () => {
      if (!navigator.geolocation) {
        console.error("El navegador no soporta geolocalización.");
        getLocationByIP();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            await getWeatherByCoordinates({ latitude, longitude });
          } catch (error) {
            console.error(
              "Error obteniendo clima por coordenadas:",
              error.message
            );

            getLocationByIP();
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error.message);
          getLocationByIP();
        }
      );
    };

    getInitialLocation();
  }, [getLocationByIP, getWeatherByCoordinates]);

  return (
    <div className="app">
      <Navbar
        city={city}
        setCity={setCity}
        onSubmit={onSubmit}
        loading={loading}
      />

      <main className="appContent">
        {error.error && (
          <Alert severity="error" className="weatherAlert">
            {error.message}
          </Alert>
        )}

        <Container className="weatherCard">
          {loading ? (
            <Box className="loadingBox">
              <CircularProgress />
              <Typography className="loadingText">
                Buscando el clima...
              </Typography>
            </Box>
          ) : (
            <>
              <Box className="weatherHeader">
                <Typography component="p" className="weatherSubtitle">
                  Clima actual en
                </Typography>

                <Typography component="h1" className="weatherCity">
                  {weather.city || "Cargando ubicación..."}
                </Typography>
              </Box>

              <Box className="weatherMain">
                {weather.icon && (
                  <img
                    src={weather.icon}
                    alt={weather.conditionText || "Ícono del clima"}
                    className="weatherIcon"
                  />
                )}

                <Typography component="p" className="weatherTemperature">
                  {weather.temp ? `${weather.temp}°C` : "--°C"}
                </Typography>

                <Typography component="p" className="weatherCondition">
                  {weather.conditionText || "Obteniendo información..."}
                </Typography>
              </Box>

              <Box className="weatherDetails">
                <Box className="detailItem">
                  <Typography className="detailLabel">
                    Sensación térmica
                  </Typography>
                  <Typography className="detailValue">
                    {weather.feel ? `${weather.feel} °C` : "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Humedad</Typography>
                  <Typography className="detailValue">
                    {weather.humidity ? `${weather.humidity} %` : "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Viento</Typography>
                  <Typography className="detailValue">
                    {weather.wind ? `${weather.wind} km/h` : "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Fecha</Typography>
                  <Typography className="detailValue">
                    {weather.date || "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Amanecer</Typography>
                  <Typography className="detailValue">
                    {weather.sunrise || "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Atardecer</Typography>
                  <Typography className="detailValue">
                    {weather.sunset || "-"}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </main>

      <footer className="footer">
        <Typography className="footerText">
          Datos del clima por{" "}
          <a
            href="https://www.weatherapi.com/"
            title="Weather API"
            target="_blank"
            rel="noreferrer"
          >
            WeatherAPI.com
          </a>
        </Typography>

        <Typography className="footerText">
          Desarrollado por{" "}
          <a
            href="https://marianomasondo.github.io/Porfolio/"
            title="Mariano Masondo"
            target="_blank"
            rel="noreferrer"
          >
            Mariano Masondo
          </a>
        </Typography>
      </footer>
    </div>
  );
}