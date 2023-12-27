import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const Navbar = ({ city, setCity, onSubmit, loading, error }) => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#343a40",
        width: { xs: "100%", md: "100%" },
        height: { xs: "10%", md: "10%" },
        justifyContent: { xs: "center", md: "space-evenly" },
      }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: "row", md: "row" },
          alignItems: { xs: "center", md: "center" },
          justifyContent: { xs: "center", md: "space-evenly" },
          textAlign: { xs: "center" },
        }}
      >
        <Typography variant="h4" mb={{ xs: 1, md: 0 }}>
          How is the weather?
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "center" },
            width: "sm",
            mb: { xs: 1, md: 0 },
          }}
        >
          <TextField
            sx={{
              width: "sm",
              mb: 1,
              "& label": {
                color: "#6c757d",
              },
              "& input": {
                color: "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#6c757d",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
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
              width: "sm",
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
  getWeatherByCoordinates: PropTypes.func.isRequired,
};

export default Navbar;

