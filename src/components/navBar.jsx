import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";

const Navbar = ({ city, setCity, onSubmit, loading, error }) => {
  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;

          console.log(`Ubicación actual: Latitud ${latitud}, Longitud ${longitud}`);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error.message);
        }
      );
    } else {
      console.error('La geolocalización no está soportada por este navegador');
    }
  };

  useEffect(() => {
    obtenerUbicacionUsuario();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#343a40" }}>
      <Toolbar>
        <Typography variant="h4">How is the weather?</Typography>
        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://w1.pngwing.com/pngs/188/826/png-transparent-circle-design-sunrise-logo-sunset-horizon-orange-line-thumbnail.png"
              alt="Centrally located image"
              style={{ width: "100px", height: "50px" }}
            />
          </div>
          <TextField
            sx={{
              borderColor: "white",
              "& label": {
                color: "blue",
              },
              "& input": {
                color: "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6c757d",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6c757d", 
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px", 
              },
            }}
            id="city"
            label="Location"
            placeholder="Please insert a city name..."
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#495057",
              "&:hover": {
                backgroundColor: "#6c757d",
              },
              "& .MuiButton-label": {
                color: "white", 
              },
            }}
            loading={loading}
            loadingIndicator="Cargando..."
            onClick={onSubmit}
          >
            Search
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
  error: PropTypes.shape({
    error: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default Navbar;





