import {Container, Typography, Box, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab"
import { useState } from "react";

const API_WEATHER = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${import.meta.env.VITE_API_KEY}&q=`

export default function App(){

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
  })

  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    })
    try {
      if (!city.trim()) {
        throw { message: "El campo ciudad es obligatorio" };
      }
    
      const response = await fetch(`${API_WEATHER}${city}`);
      console.log("API Response:", response);
    
      const dataText = await response.text();
      console.log("Response Text:", dataText);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(dataText, "text/xml");
      
      const location = xmlDoc.querySelector("request>query").textContent;
      const tempC = xmlDoc.querySelector("temp_C").textContent;
      const weatherIconUrl = xmlDoc.querySelector("weatherIconUrl").textContent;
      const weatherDesc = xmlDoc.querySelector("weatherDesc").textContent;
    
      setWeather({
        city: location,
        temp: tempC,
        icon: weatherIconUrl,
        conditionText: weatherDesc,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }    
    
  }

  return (
    <Container
    maxWidth="xs"
    sx={{
      mt: 2,
      backgroundImage: 'url("https://via.placeholder.com/1150")',
 
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <Typography
      variant="h3"
      component="h1"
      align="center"
      gutterBottom
      >
        Cómo está el clima?
      </Typography>
      <Box
      sx={{display:"grid", gap:2}}
      component="form"
      autoComplete="off"
      onSubmit={onSubmit}
      >
        <TextField 
        id="city"
        label="Ciudad"
        variant="outlined"
        size="small"
        required
        fullWidth
        value={city}
        onChange={(e) => setCity(e.target.value)}
        error={error.error}
        helperText={error.message}
        />

        <LoadingButton
        type="submit"
        variant="contained"
        loading={loading}
        loadingIndicator="Cargando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 2,
          textAlign: "center",
        }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box
          component="img"
          alt={weather.conditionText}
          src={weather.icon}
          sx={{margin: "0 auto"}}
          />
          <Typography variant="h5" component="h3">
            {weather.temp} °C
          </Typography>
          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Typography
      textAlign="center"
      sx={{mt:2, fontSize:"10px"}}
      >
        Powered by:{" "}
        <a
        href="https://www.weatherapi.com/"
        title="Weather API"
        >
          WeatherAPI.com 
        </a>
        Developed by:{" "}
        <a
        href="https://marianomasondo.github.io/Porfolio/"
        title="Mariano Masondo"
        >
           Mariano Masondo
        </a>
      </Typography>
    </Container>
  )
}
