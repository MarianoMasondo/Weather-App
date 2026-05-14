import PropTypes from "prop-types";
import {
  AppBar,
  Autocomplete,
  Box,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import "./navBar.css";

const cityOptions = [
  "Córdoba, Argentina",
  "Buenos Aires, Argentina",
  "Rosario, Argentina",
  "Mendoza, Argentina",
  "La Plata, Argentina",
  "San Miguel de Tucumán, Argentina",
  "Mar del Plata, Argentina",
  "Salta, Argentina",
  "Santa Fe, Argentina",
  "Bariloche, Argentina",
  "Santiago, Chile",
  "Montevideo, Uruguay",
  "São Paulo, Brasil",
  "Madrid, España",
  "Barcelona, España",
  "Ciudad de México, México",
  "New York, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
];

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
            onInputChange={(event, newInputValue) => setCity(newInputValue)}
            onChange={(event, newValue) => setCity(newValue || "")}
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
