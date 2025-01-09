import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dns from "dns";
import { exec } from "child_process";
import { stderr, stdout } from "process";
import { log } from "console";

const app = express();
const port = 3000;
app.use(bodyParser.json());

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
        error: res.statusMessage,
      };
      res.json(errorMessage);
    } else if (res.statusCode === 408) {
      var errorMessage = {
        error: "Request timeout",
      };
      res.json(errorMessage);
    } else {
      var errorMessage = {
        error: res.statusMessage,
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
        error: res.statusMessage,
      };
      res.json(errorMessage);
    } else if (res.statusCode === 408) {
      var errorMessage = {
        error: "Request timeout",
      };
      res.json(errorMessage);
    } else {
      var errorMessage = {
        error: res.statusMessage,
      };
      res.json(errorMessage);
    }
  }
});

app.get("/reverseDNSLookup", (req, res) => {
  const ip = req.query.ip;

  dns.reverse(ip, (err, hostname) => {
    if (err) {
      console.log(err);
      res.json({ error: "Invalid IP address" });
    } else {
      console.log(hostname);
      res.json({
        ip: ip,
        hostname: hostname,
      });
    }
  });
});

app.get("/dnsLookup", (req, res) => {
  const domain = req.query.domain;
  const recordType = req.query.recordType;

  dns.resolve(domain, recordType, (err, records) => {
    if (err) {
      console.log(err);
      res.json({ error: "Invalid domain" });
    } else {
      res.json({
        domain: domain,
        recordType: recordType,
        records: records,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
