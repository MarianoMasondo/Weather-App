import { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import Navbar from "./components/navBar";

const API_WEATHER = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=fe3597c6c0f04584b1e173127230512&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
    feel: "",
    humidity: "",
    wind: "",
    date: "",
    sunrise: "",
    sunset: "",
  });

  const parseWeatherData = (xmlDoc, cityName) => {
    const tempC = xmlDoc.querySelector("temp_C")?.textContent;
    const weatherIconUrl = xmlDoc.querySelector("weatherIconUrl")?.textContent;
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
      throw new Error("No se pudo obtener la temperatura.");
    }

    setWeather({
      city: cityName,
      country: "",
      temp: tempC,
      icon: weatherIconUrl || "",
      conditionText: weatherDesc || "",
      feel: feelsLike || "",
      humidity: humidity || "",
      wind: wind || "",
      date: date || "",
      sunrise: sunrise || "",
      sunset: sunset || "",
    });
  };

  const getWeatherByCity = async (cityToSearch) => {
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
  };

  const getWeatherByCoordinates = async (coordinates) => {
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

      parseWeatherData(xmlDoc, "The weather here is...");
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (!data.city || !data.country_name) {
        throw new Error("No se pudo obtener la ubicación por IP.");
      }

      const locationByIP = `${data.city}, ${data.country_name}`;

      await getWeatherByCity(locationByIP);
    } catch (error) {
      console.error("Error getting location by IP:", error.message);

      // Si también falla la ubicación por IP, usamos Córdoba por defecto
      await getWeatherByCity("Cordoba, Argentina");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError({
        error: true,
        message: "The city field is required",
      });
      return;
    }

    try {
      await getWeatherByCity(city);
    } catch (error) {
      console.error("Error searching city:", error.message);
    }
  };

  useEffect(() => {
    const getInitialLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");

        // Si el navegador no soporta geolocalización, usamos IP
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
            console.error("Error getting weather by coordinates:", error.message);

            // Si falla el clima por coordenadas, usamos IP
            getLocationByIP();
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);

          // Si el usuario rechaza ubicación, usamos IP
          getLocationByIP();
        }
      );
    };

    getInitialLocation();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        minHeight: "100vh",
        backgroundImage:
          "url(https://wallpapers.com/images/hd/sky-clouds-hd-desktop-wallpaper-high-definition-fullscreen-yqckhncsi87skp5n.webp)",
        backgroundSize: "cover",
      }}
    >
      <div style={{ flex: 1 }}>
        <Navbar
          city={city}
          setCity={setCity}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
        />
      </div>

      <Container
        sx={{
          backgroundColor: "rgba(173, 181, 189, 0.4)",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100%", md: "40%" },
          borderRadius: "20px",
          marginBottom: { xs: "100%", md: "17.5%" },
          marginTop: { xs: "50%", md: "5.5%" },
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(3, 1fr)",
            margin: "2%",
          }}
        >
          <Box
            sx={{
              gridColumn: "1 / span 1",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              mb="10%"
              sx={{ fontWeight: "bold" }}
            >
              {weather.city} {weather.country}
            </Typography>

            {weather.icon && (
              <Box
                component="img"
                alt={weather.conditionText || "weather icon"}
                src={weather.icon}
                sx={{ width: "100px", height: "100px" }}
              />
            )}

            <Typography
              variant="h6"
              component="h3"
              mt="10%"
              sx={{ fontWeight: "bold" }}
            >
              Temperature:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.temp} °C
            </Typography>

            <Typography
              variant="h5"
              component="h3"
              mt="10%"
              sx={{ fontWeight: "bold" }}
            >
              {weather.conditionText}
            </Typography>
          </Box>

          <Box
            sx={{
              gridColumn: "2 / span 1",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Feels like:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.feel} °C
            </Typography>

            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Humidity:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.humidity} %
            </Typography>

            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Wind:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.wind} km/h
            </Typography>
          </Box>

          <Box
            sx={{
              gridColumn: "3 / span 1",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Date:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.date}
            </Typography>

            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Sunrise:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.sunrise}
            </Typography>

            <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
              Sunset:
            </Typography>

            <Typography variant="h6" component="h1">
              {weather.sunset}
            </Typography>
          </Box>
        </Box>
      </Container>

      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px",
          backgroundColor: "#343a40",
          color: "white",
          minHeight: "5vh",
        }}
      >
        <Typography sx={{ fontSize: "15px", mr: "3%" }}>
          Powered by:{" "}
          <a
            href="https://www.weatherapi.com/"
            title="Weather API"
            style={{ textDecoration: "none", color: "white" }}
          >
            WeatherAPI.com
          </a>
        </Typography>

        <Typography sx={{ fontSize: "15px", ml: "3%" }}>
          Developed by:{" "}
          <a
            href="https://marianomasondo.github.io/Porfolio/"
            title="Mariano Masondo"
            style={{ textDecoration: "none", color: "white" }}
          >
            Mariano Masondo
          </a>
        </Typography>
      </footer>
    </div>
  );
}
