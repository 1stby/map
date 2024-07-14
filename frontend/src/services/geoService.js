import { API_CONFIG } from "../config";

export const convertToCoord = async (location) => {
  const url = new URL(API_CONFIG.GEOCODING_BASE_URL);
  url.searchParams.append("format", "json");
  url.searchParams.append("q", location);

  try {
    const response = await fetch(url.toString());

    const data = await response.json();
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (err) {
    console.error("轉換座標錯誤:", err);
  }
};
