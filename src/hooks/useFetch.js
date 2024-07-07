import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/posts";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const fetchData = async () => {
      setError(null);
      try {
        const response = await api.get(url, {
          cancelToken: source.token,
        });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.error(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(fetchData, 1000);

    return () => {
      console.log(`Request canceled by the user`);
      source.cancel();
    };
  }, [url]);

  return { data, setData, isLoading, error };
};

export default useFetch;
