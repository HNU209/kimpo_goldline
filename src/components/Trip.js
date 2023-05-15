import React from "react";

import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";

const INITIAL_VIEW_STATE = {
  longitude: 127,
  latitude: 37.5,
  zoom: 10,
  minZoom: 3,
  maxZoom: 50,
  pitch: 0,
  bearing: 0,
};

const mapStyle = "mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc";
const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

const Trip = ({ data }) => {
  const layers = [
    new PathLayer({
      id: "subway-path",
      data: data.subway_path,
      pickable: true,
      widthScale: 1,
      widthMinPixels: 2,
      getPath: d => d.path,
      getColor: d => [255, 255, 0],
      getWidth: d => 1
    }),
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <Map mapStyle={mapStyle} mapboxAccessToken={MAPBOX_TOKEN} />
    </DeckGL>
  );
};

export default Trip;
