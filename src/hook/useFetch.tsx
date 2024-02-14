import { useState, useEffect } from "react";

const cache: { [key: string]: unknown } = {};

export const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache[url]) {
      setData(cache[url] as T);
      setLoading(false);
    }
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const response: { statusCode: number; data: T } = await res.json();
        cache[url] = response.data;
        setData(response.data);
        setLoading(false);
      } catch (error) {
        throw new Error("Something went wrong");
      }
    };
    fetchData();
  }, [url]);

  return { data, loading };
};
