import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getEnv } from "../../config/envConfig.js";

function createClient() {
  // Creates a cookie jar
  const jar = new CookieJar();

  // Wraps axios so it supports cookies
  const client = wrapper(
    axios.create({
      baseURL: `http://localhost:${getEnv("PORT")}`, // server
      withCredentials: true, // sends cookies automatically with each request
      jar, // attaches the cookie jar to the client
    })
  );

  return { client, jar };
}

const userA = createClient();
const userB = createClient();

export { userA, userB }; // Exports both user clients to be used in tests;
