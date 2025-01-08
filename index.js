import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/getIp", (req, res) => {
  console.log(req.headers["x-forwarded-for"] || req.socket.remoteAddress);
});

app.get("/myIpAddress", async (req, res) => {
  try {
    const response = await axios.get("https://get.geojs.io/v1/ip.json");
    const ip = response.data.ip;
    console.log(ip);
    var ipDetail = {
      myIpAddress: ip,
    };
    res.json(ipDetail);
  } catch (err) {
    console.log(err);
    console.log(res.statusCode);

    if (res.statusCode === 404) {
      var errorMessage = {
        message: res.statusMessage,
      };
      res.json(errorMessage);
    } else if (res.statusCode === 408) {
      var errorMessage = {
        message: "Request timeout",
      };
      res.json(errorMessage);
    } else {
      var errorMessage = {
        message: res.statusMessage,
      };
      res.json(errorMessage);
    }
  }
});

app.post("/myLocation", async (req, res) => {
  try {
    const response = await axios.get(
      "https://get.geojs.io/v1/ip/geo/" + req.query.ip + ".json"
    );
    const respond = response.data;
    var location = {
      myIpAddress: respond.ip,
      userCity: respond.city,
      userRegion: respond.region,
      userCountry: respond.country,
      userLongitutde: respond.longitude,
      userLatitude: respond.latitude,
      userTimeZone: respond.timezone,
      userCountryCode: respond.country_code,
      userNetworkProvider: respond.organization_name,
    };
    res.json(location);
  } catch (err) {
    if (res.statusCode === 404) {
      var errorMessage = {
        message: res.statusMessage,
      };
      res.json(errorMessage);
    } else if (res.statusCode === 408) {
      var errorMessage = {
        message: "Request timeout",
      };
      res.json(errorMessage);
    } else {
      var errorMessage = {
        message: res.statusMessage,
      };
      res.json(errorMessage);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
