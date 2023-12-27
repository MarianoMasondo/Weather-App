import { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import Navbar from "./components/navBar";

const API_WEATHER = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

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

  const getWeatherByCoordinates = async (coordinates) => {
    try {
      const response = await fetch(
        `${API_WEATHER}${coordinates.latitude},${coordinates.longitude}`
      );

      const dataText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataText, "text/xml");
      const tempC = xmlDoc.querySelector("temp_C").textContent;
      const weatherIconUrl = xmlDoc.querySelector("weatherIconUrl").textContent;
      const weatherDesc = xmlDoc.querySelector("weatherDesc").textContent;
      const FeelsLike = xmlDoc.querySelector("FeelsLikeC").textContent;
      const humidity = xmlDoc.querySelector("humidity").textContent;
      const wind = xmlDoc.querySelector("windspeedKmph").textContent;

      const date = xmlDoc.querySelector("weather>date").textContent;
      const sunrise = xmlDoc.querySelector(
        "weather>astronomy>sunrise"
      ).textContent;
      const sunset = xmlDoc.querySelector(
        "weather>astronomy>sunset"
      ).textContent;

      setWeather({
        city: "The Weather here is...",
        temp: tempC,
        icon: weatherIconUrl,
        conditionText: weatherDesc,
        feel: FeelsLike,
        humidity: humidity,
        wind: wind,
        date: date,
        sunrise: sunrise,
        sunset: sunset,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      if (!city.trim()) {
        throw { message: "The city field is required" };
      }

      const response = await fetch(`${API_WEATHER}${city}`);
      const dataText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataText, "text/xml");

      const location = xmlDoc.querySelector("request>query").textContent;
      const tempC = xmlDoc.querySelector("temp_C").textContent;
      const weatherIconUrl = xmlDoc.querySelector("weatherIconUrl").textContent;
      const weatherDesc = xmlDoc.querySelector("weatherDesc").textContent;
      const FeelsLike = xmlDoc.querySelector("FeelsLikeC").textContent;
      const humidity = xmlDoc.querySelector("humidity").textContent;
      const wind = xmlDoc.querySelector("windspeedKmph").textContent;

      const date = xmlDoc.querySelector("weather>date").textContent;
      const sunrise = xmlDoc.querySelector(
        "weather>astronomy>sunrise"
      ).textContent;
      const sunset = xmlDoc.querySelector(
        "weather>astronomy>sunset"
      ).textContent;

      setWeather({
        city: location,
        temp: tempC,
        icon: weatherIconUrl,
        conditionText: weatherDesc,
        feel: FeelsLike,
        humidity: humidity,
        wind: wind,
        date: date,
        sunrise: sunrise,
        sunset: sunset,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherByCoordinates({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100vw", md: "80vw" },
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
          getWeatherByCoordinates={() => getWeatherByCoordinates({})}
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
            <Typography variant="h5" component="h2" mb="10%" sx={{ fontWeight: 'bold' }}>
              {weather.city} {weather.country}
            </Typography>
            <Box
              component="img"
              alt={weather.conditionText}
              src={city.trim() ? weather.icon : weather.icon}
              sx={{ width: "100px", height: "100px" }}
            />
            <Typography variant="h6" component="h3" mt="10%" sx={{ fontWeight: 'bold' }}>
              Temperature:
            </Typography>
            <Typography variant="h6" component="h1">
              {weather.feel} °C
            </Typography>
            <Typography variant="h5" component="h3" mt="10%" sx={{ fontWeight: 'bold' }}>
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
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
              Feels like:
            </Typography>
            <Typography variant="h6" component="h1">
              {weather.feel} °C
            </Typography>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
              Humidity:
            </Typography>
            <Typography variant="h6" component="h1">
              {weather.humidity} %
            </Typography>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
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
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
              Date:
            </Typography>
            <Typography variant="h6" component="h1">
              {weather.date}
            </Typography>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
              Sunrise:
            </Typography>
            <Typography variant="h6" component="h1">
              {weather.sunrise}
            </Typography>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
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
