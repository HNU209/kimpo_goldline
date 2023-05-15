import React, { useState, useEffect, useCallback } from "react";
import Trip from "./components/Trip";

const App = () => {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  const RequestData = useCallback(async (type) => {
    const res = await fetch(`data/${type}.json`);
    const data = await res.json();
    setData(prev => ({ ...prev, [type]: data }));
  }, []);

  const TotalRequestData = useCallback(async () => {
    await RequestData('subway_path');
    setLoaded(true);
  }, []);

  useEffect(() => {
    TotalRequestData();
    console.log(data);
  }, []);
  
  return (
    loaded && <Trip data={data} />
  );
};

export default App;
