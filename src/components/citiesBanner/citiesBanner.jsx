import PropTypes from "prop-types";
import "./CitiesBanner.css";

const cities = [
  "Córdoba, Argentina",
  "Buenos Aires, Argentina",
  "London, United Kingdom",
  "New York, USA",
  "Paris, France",
  "Madrid, Spain",
  "Tokyo, Japan",
  "Rio de Janeiro, Brazil",
  "Florianópolis, Brazil",
  "Montevideo, Uruguay",
];

export default function CitiesBanner({ onCitySelect, loading }) {
  return (
    <section className="citiesBanner">
      <p className="citiesBannerTitle">Ciudades populares</p>

      <div className="citiesList">
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            className="cityChip"
            disabled={loading}
            onClick={() => onCitySelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </section>
  );
}

CitiesBanner.propTypes = {
  onCitySelect: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};