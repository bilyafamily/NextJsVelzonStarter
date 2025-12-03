import axios from "axios";

const microsoftGraphClient = axios.create({
  baseURL: "https://graph.microsoft.com/v1.0",
  headers: { "Content-Type": "application/json" },
});

export default microsoftGraphClient;
