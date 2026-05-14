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

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const DEFAULT_CITY = "Cordoba, Argentina";
const LANGUAGE = "es";

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    temp: null,
    icon: "",
    conditionText: "",
    feel: null,
    humidity: null,
    wind: null,
    date: "",
    sunrise: "",
    sunset: "",
  });

  const parseWeatherData = useCallback((data) => {
    if (!data?.current || !data?.location) {
      throw new Error("No se pudo obtener el clima de esa ubicación.");
    }

    const forecastDay = data.forecast?.forecastday?.[0];

    setWeather({
      city: `${data.location.name}, ${data.location.country}`,
      temp: Math.round(data.current.temp_c),
      icon: data.current.condition?.icon
        ? `https:${data.current.condition.icon}`
        : "",
      conditionText: data.current.condition?.text || "",
      feel: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      wind: Math.round(data.current.wind_kph),
      date: forecastDay?.date || data.location.localtime?.split(" ")[0] || "",
      sunrise: forecastDay?.astro?.sunrise || "",
      sunset: forecastDay?.astro?.sunset || "",
    });
  }, []);

  const getWeather = useCallback(
    async (locationToSearch) => {
      setLoading(true);
      setError({
        error: false,
        message: "",
      });

      try {
        if (!API_KEY) {
          throw new Error("Falta configurar la API key en el archivo .env.");
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
            locationToSearch
          )}&days=1&aqi=no&alerts=no&lang=${LANGUAGE}`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(
            data.error?.message || "No encontramos esa ubicación."
          );
        }

        parseWeatherData(data);
      } catch (error) {
        setError({
          error: true,
          message:
            error.message ||
            "No pudimos obtener el clima. Revisá la ciudad o la API key.",
        });

        console.error("Error obteniendo clima:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [parseWeatherData]
  );

  const getLocationByIP = useCallback(async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (!data.city || !data.country_name) {
        throw new Error("No se pudo obtener la ubicación por IP.");
      }

      await getWeather(`${data.city}, ${data.country_name}`);
    } catch (error) {
      console.error("Error obteniendo ubicación por IP:", error.message);
      await getWeather(DEFAULT_CITY);
    }
  }, [getWeather]);

  const getWeatherByCoordinates = useCallback(
    async (coordinates) => {
      const locationByCoordinates = `${coordinates.latitude},${coordinates.longitude}`;
      await getWeather(locationByCoordinates);
    },
    [getWeather]
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

    await getWeather(city);
    setCity("");
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

          await getWeatherByCoordinates({ latitude, longitude });
        },
        () => {
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
                  {weather.temp !== null ? `${weather.temp}°C` : "--°C"}
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
                    {weather.feel !== null ? `${weather.feel} °C` : "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Humedad</Typography>
                  <Typography className="detailValue">
                    {weather.humidity !== null ? `${weather.humidity} %` : "-"}
                  </Typography>
                </Box>

                <Box className="detailItem">
                  <Typography className="detailLabel">Viento</Typography>
                  <Typography className="detailValue">
                    {weather.wind !== null ? `${weather.wind} km/h` : "-"}
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