import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, useCallback } from "react";
import Trip from "./components/Trip";
import "./css/app.css";

const App = () => {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  const RequestData = useCallback(async (type) => {
    const res = await fetch(`data/${type}.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await res.json();
    setData((prev) => ({ ...prev, [type]: data }));
  }, []);

  const TotalRequestData = useCallback(async () => {
    await RequestData("bus_station");
    await RequestData("bus_path");
    await RequestData("bus_trip");

    await RequestData("subway_station");
    await RequestData("subway_path");
    await RequestData("subway_trip");

    await RequestData("shuttle_bus_trip");
    await RequestData("prev_bus_trip");

    await RequestData("subway_passenger_trip");
    await RequestData("bus_passenger_trip");

    setLoaded(true);
  }, []);

  useEffect(() => {
    TotalRequestData();
  }, []);

  return <div className="container">{loaded && <Trip data={data} />}</div>;
};

export default App;
