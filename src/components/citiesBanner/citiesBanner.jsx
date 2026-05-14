import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./citiesBanner.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const LANGUAGE = "es";

const popularCities = [
  "Buenos Aires, Argentina",
  "London, United Kingdom",
  "New York, USA",
  "Paris, France",
  "Madrid, Spain",
  "Tokyo, Japan",
  "Rio de Janeiro, Brazil",
  "Montevideo, Uruguay",
  "Rome, Italy",
  "Dubai, UAE",
];

export default function CitiesBanner({ onCitySelect, loading }) {
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    const fetchCitiesWeather = async () => {
      try {
        if (!API_KEY) {
          console.error("Falta la API key para el banner.");
          setBannerLoading(false);
          return;
        }

        const requests = popularCities.map(async (city) => {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
              city
            )}&lang=${LANGUAGE}`
          );

          const data = await response.json();

          if (!response.ok || data.error) {
            throw new Error(
              data.error?.message || `Error cargando ${city}`
            );
          }

          return {
            query: city,
            city: data.location?.name || city,
            country: data.location?.country || "",
            temp: Math.round(data.current?.temp_c),
            icon: data.current?.condition?.icon
              ? `https:${data.current.condition.icon}`
              : "",
            condition: data.current?.condition?.text || "",
          };
        });

        const results = await Promise.all(requests);
        setCitiesWeather(results);
      } catch (error) {
        console.error("Error cargando ciudades del banner:", error.message);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchCitiesWeather();
  }, []);

  const loopedCities = useMemo(() => {
    if (!citiesWeather.length) return [];
    return [...citiesWeather, ...citiesWeather];
  }, [citiesWeather]);

  if (bannerLoading) {
    return (
      <section className="citiesBanner">
        <p className="citiesBannerTitle">Ciudades populares</p>
        <div className="citiesBannerLoading">Cargando ciudades...</div>
      </section>
    );
  }

  if (!citiesWeather.length) {
    return null;
  }

  return (
    <section className="citiesBanner">
      <p className="citiesBannerTitle">Ciudades populares</p>

      <div className="citiesViewport">
        <div className="citiesTrack">
          {loopedCities.map((item, index) => (
            <button
              key={`${item.query}-${index}`}
              type="button"
              className="cityWeatherCard"
              disabled={loading}
              onClick={() => onCitySelect(item.query)}
              title={`Ver clima de ${item.city}, ${item.country}`}
            >
              <div className="cityWeatherTop">
                <div className="cityWeatherText">
                  <span className="cityName">{item.city}</span>
                  <span className="cityCountry">{item.country}</span>
                </div>

                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.condition || `Clima en ${item.city}`}
                    className="cityWeatherIcon"
                  />
                )}
              </div>

              <div className="cityWeatherBottom">
                <span className="cityTemp">{item.temp}°C</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

CitiesBanner.propTypes = {
  onCitySelect: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};