import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import "./navBar.css";

const Navbar = ({ city, setCity, onSubmit, loading }) => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbarToolbar">
        <Typography component="h1" className="navbarTitle">
          ¿Cómo está el clima?
        </Typography>

        <Box component="form" onSubmit={onSubmit} className="navbarForm">
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            label="Ubicación"
            placeholder="Ej: Córdoba"
            variant="outlined"
            size="small"
            className="navbarInput"
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

