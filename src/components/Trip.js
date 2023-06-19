import React, { useState, useEffect, useCallback } from "react";

import DeckGL from "@deck.gl/react";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { PathLayer, IconLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Map } from "react-map-gl";

import { Slider } from "@mui/material";
import "../css/trip.css";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const INITIAL_VIEW_STATE = {
  longitude: 126.72,
  latitude: 37.6,
  zoom: 11.5,
  minZoom: 3,
  maxZoom: 100,
  pitch: 0,
  bearing: 0,
};

const THEME = {
  path: [173, 134, 5],
  busPath: [255, 0, 0],
  subway: [240, 215, 129],
};

const minTime = 390;
const maxTime = 480;
const animationSpeed = 1;
const mapStyle = "mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc";
const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

const returnAnimationTime = (time) => {
  if (time > maxTime) {
    return minTime;
  } else {
    return time + 0.01 * animationSpeed;
  }
};

const addZeroFill = (value) => {
  const valueString = value.toString();
  return valueString.length < 2 ? "0" + valueString : valueString;
};

const returnAnimationDisplayTime = (time) => {
  const hour = addZeroFill(parseInt((Math.round(time) / 60) % 24));
  const minute = addZeroFill(Math.round(time) % 60);
  return [hour, minute];
};

const busGetColor = (point) => {
  if (point.bus_type === "70") {
    return [255, 0, 0];
  } else if (point.bus_type === "70A") {
    return [0, 255, 0];
  } else if (point.bus_type === "70B") {
    return [0, 0, 255];
  }
};

const Trip = ({ data }) => {
  const [time, setTime] = useState(minTime);
  const [animation] = useState([]);

  const animate = useCallback(() => {
    setTime((time) => returnAnimationTime(time));
    animation.id = window.requestAnimationFrame(animate);
  }, [animation]);

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation, animate]);

  const layers = [
    new PathLayer({
      id: "subway_path",
      data: data.subway_path,
      pickable: true,
      widthScale: 1,
      widthMinPixels: 2,
      getPath: (d) => d.route,
      getColor: (d) => THEME.path,
      getWidth: (d) => 1,
    }),
    new PathLayer({
      id: "bus_path",
      data: data.bus_path,
      pickable: true,
      widthScale: 1,
      widthMinPixels: 2,
      getPath: (d) => d.route,
      getColor: (d) => busGetColor(d),
      getWidth: (d) => 1,
    }),
    new IconLayer({
      id: "bus_station",
      data: data.bus_station,
      pickable: true,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: ICON_MAPPING,
      getIcon: (d) => "marker",
      sizeScale: 5,
      getPosition: (d) => [d.start_lon, d.start_lat],
      getSize: (d) => 3,
      getColor: (d) => busGetColor(d),
    }),
    new TripsLayer({
      id: "subway_trip",
      data: data.subway_trip,
      getPath: (d) => d.trip,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => THEME.subway,
      opacity: 1,
      widthMinPixels: 5,
      trailLength: 0.8,
      currentTime: time,
      shadowEnabled: false,
    }),
    new TripsLayer({
      id: "bus_trip",
      data: data.bus_trip,
      getPath: (d) => d.trip,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => busGetColor(d),
      opacity: 1,
      widthMinPixels: 5,
      trailLength: 0.8,
      currentTime: time,
      shadowEnabled: false,
    }),
    new TripsLayer({
      id: "shuttle_bus_trip",
      data: data.shuttle_bus_trip,
      getPath: (d) => d.trip,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => [0, 0, 0],
      opacity: 1,
      widthMinPixels: 5,
      trailLength: 0.8,
      currentTime: time,
      shadowEnabled: false,
    }),
    new TripsLayer({
      id: "subway_passenger_trip",
      data: data.subway_passenger_trip,
      getPath: (d) => d.trip,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => [255, 255, 0],
      opacity: 1,
      widthMinPixels: 5,
      trailLength: 0.8,
      currentTime: time,
      shadowEnabled: false,
    }),
    new TripsLayer({
      id: "bus_passenger_trip",
      data: data.bus_passenger_trip,
      getPath: (d) => d.trip,
      getTimestamps: (d) => d.timestamp,
      getColor: (d) => [255, 255, 255],
      opacity: 1,
      widthMinPixels: 5,
      trailLength: 0.8,
      currentTime: time,
      shadowEnabled: false,
    }),
    // new TripsLayer({
    //   id: "prev_bus_trip",
    //   data: data.prev_bus_trip,
    //   getPath: (d) => d.trip,
    //   getTimestamps: (d) => d.timestamp,
    //   getColor: (d) => [255, 255, 255],
    //   opacity: 1,
    //   widthMinPixels: 5,
    //   trailLength: 0.8,
    //   currentTime: time,
    //   shadowEnabled: false,
    // }),
  ];

  const SliderChange = (value) => {
    const time = value.target.value;
    setTime(time);
  };

  const [hour, minute] = returnAnimationDisplayTime(time);

  return (
    <div className="trip-container" style={{ position: "relative" }}>
      <DeckGL
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={mapStyle} mapboxAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
      <h1 className="time">TIME : {`${hour} : ${minute}`}</h1>
      <Slider
        id="slider"
        value={time}
        min={minTime}
        max={maxTime}
        onChange={SliderChange}
        track="inverted"
      />
    </div>
  );
};

export default Trip;
