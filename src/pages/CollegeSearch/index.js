import { useState } from "react";
import useQuerySchools from "hooks/queries/useQuerySchools";
import {
  InputBase,
  LinearProgress,
  Button,
  Paper,
  Box,
  Typography,
  Container,
} from "@mui/material";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const center = {
  lat: -3.745,
  lng: -38.523,
};

const CollegeSearch = () => {
  const [schoolName, setSchoolName] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [activeMarker, setActiveMarker] = useState(null);

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API,
  });

  const { data: schools = [], isFetching: isSchoolFetching } = useQuerySchools({
    fields: "id,school.name,location.lat,location.lon",
    "school.name": encodeURIComponent(searchWord),
  });

  const handleOnChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSearch = () => setSearchWord(schoolName);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    let bounds;
    if (schools?.results?.length === 0) {
      bounds = new window.google.maps.LatLngBounds(center);
    } else {
      bounds = new window.google.maps.LatLngBounds();
    }
    schools?.results?.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  return (
    <Box>
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper sx={{ display: "flex" }}>
          <InputBase
            autoFocus
            placeholder="search schools"
            inputProps={{ "aria-label": "search schools" }}
            sx={{ flex: 1, pl: 2 }}
            onChange={handleOnChange}
            onKeyDown={(e) => {
              if (e.nativeEvent.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Paper>
      </Container>

      <LinearProgress
        sx={{ mt: 5, visibility: isSchoolFetching ? "visible" : "hidden" }}
      />
      <Box>
        {isMapLoaded && (
          <GoogleMap
            onLoad={handleOnLoad}
            onClick={() => setActiveMarker(null)}
            mapContainerStyle={{ width: "100%", height: "450px" }}
            {...(schools?.result?.length === 0 && { center, zoom: 2 })}
          >
            {schools?.results
              ?.filter(({lat, lng}) => lat && lng)
              .map(({ id, lat, lng, name }) => {
                return (
                  <Marker
                    key={id}
                    position={{ lat, lng }}
                    onClick={() => handleActiveMarker(id)}
                  >
                    {activeMarker === id ? (
                      <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                        <Typography variant="body1">{name}</Typography>
                      </InfoWindow>
                    ) : null}
                  </Marker>
                );
              })}
          </GoogleMap>
        )}
      </Box>
    </Box>
  );
};

export default CollegeSearch;
