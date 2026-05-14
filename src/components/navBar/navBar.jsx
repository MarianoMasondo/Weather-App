import PropTypes from "prop-types";
import {
  AppBar,
  Autocomplete,
  Box,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import "./navBar.css";

const cityOptions = [
  "Cordoba, Argentina",
  "Buenos Aires, Argentina",
  "Rosario, Argentina",
  "Mendoza, Argentina",
  "La Plata, Argentina",
  "San Miguel de Tucumán, Argentina",
  "Mar del Plata, Argentina",
  "Salta, Argentina",
  "Santa Fe, Argentina",
  "Bariloche, Argentina",
  "Ushuaia, Argentina",
  "Neuquén, Argentina",
  "San Juan, Argentina",
  "San Luis, Argentina",
  "Corrientes, Argentina",
  "Resistencia, Argentina",
  "Posadas, Argentina",
  "Paraná, Argentina",
  "Bahía Blanca, Argentina",
  "Florianópolis, Brazil",
  "São Paulo, Brazil",
  "Rio de Janeiro, Brazil",
  "Curitiba, Brazil",
  "Porto Alegre, Brazil",
  "Santiago, Chile",
  "Valparaíso, Chile",
  "Montevideo, Uruguay",
  "Punta del Este, Uruguay",
  "Asunción, Paraguay",
  "Lima, Perú",
  "Bogotá, Colombia",
  "Madrid, Spain",
  "Barcelona, Spain",
  "Valencia, Spain",
  "Ciudad de México, México",
  "Cancún, México",
  "New York, USA",
  "Miami, USA",
  "Los Angeles, USA",
  "London, United Kingdom",
  "Paris, France",
  "Rome, Italy",
  "Tokyo, Japan",
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const filterOptions = createFilterOptions({
  stringify: (option) => normalizeText(option),
  matchFrom: "start",
});

const Navbar = ({ city, setCity, onSubmit, loading }) => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbarToolbar">
        <Typography component="h1" className="navbarTitle">
          ¿Cómo está el clima?
        </Typography>

        <Box component="form" onSubmit={onSubmit} className="navbarForm">
          <Autocomplete
            freeSolo
            options={cityOptions}
            value={city}
            filterOptions={filterOptions}
            onInputChange={(event, newInputValue) => {
              setCity(newInputValue);
            }}
            onChange={(event, newValue) => {
              setCity(newValue || "");
            }}
            className="navbarAutocomplete"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ubicación"
                placeholder="Elegí o escribí una ciudad"
                size="small"
              />
            )}
          />

          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            className="navbarButton"
          >
            Buscar
          </LoadingButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Navbar;