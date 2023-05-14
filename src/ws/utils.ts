import axios from "axios";
import { SpeachMaticClient } from "./Speachmatics";
import { config } from "../config/config";

export async function createSmClient() {
  const url = `${config.speechmatics.apiHost}/v1/api_keys?type=rt`;
  const authToken = `Bearer ${config.speechmatics.apiKey}`;

  const data = {
    ttl: 3600,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: authToken,
  };

  try {
    const response = await axios.post<
      { ttl: number },
      { data: { key_value: string } }
    >(url, data, { headers });

    return new SpeachMaticClient(response.data.key_value);
  } catch (ex) {
    console.log("### ex", ex);
  }
}
