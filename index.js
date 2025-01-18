import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dns from "dns";
import portscanner from "portscanner";
import isPortReachable from "is-port-reachable";

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
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
        error: req.statusMessage,
      };
      res.json(errorMessage);
    }
  }
});

app.get("/myLocation", async (req, res) => {
  if (req.query.ip === undefined || "") {
    res.json({
      error: `No Ip address was given`,
    });
  } else {
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
      console.log(err);
      console.log(err.status);
      if (err.status === 404) {
        var errorMessage = {
          error: `The IP address ${req.query.ip} provided is not valid.`,
        };
        res.json(errorMessage);
      } else if (err.status === undefined) {
        var errorMessage = {
          error: "Request timeout, check out your internet connection.",
        };
        res.json(errorMessage);
      } else {
        var errorMessage = {
          error: `We ecounter an error with an error code ${err.status}`,
        };
        res.json(errorMessage);
      }
    }
  }
});

app.get("/reverseDNSLookup", (req, res) => {
  const ip = req.query.ip;
  if (ip === undefined || "") {
    res.json({ error: "No IP address was specified." });
  } else {
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
  }
});

app.get("/dnsLookup", (req, res) => {
  const domain = req.query.domain;
  const recordType = req.query.recordType;
  if ((domain && recordType) == undefined) {
    res.json({
      error: "You did specify either a domain name or record type or Both.",
    });
  } else {
    console.log(false);
    dns.resolve(domain, recordType, (err, records) => {
      if (err) {
        console.log(err);
        if (err.code === "ECONNREFUSED") {
          res.json({
            error: `You have a Connectivity problem.`,
          });
        } else {
          res.json({ error: err.code });
        }
      } else {
        res.json({
          domain: domain,
          recordType: recordType,
          records: records,
        });
      }
    });
  }
});

app.get("/portScanner/checkPortStatus", (req, res) => {
  portscanner.checkPortStatus(req.query.port, req.query.ip, (error, status) => {
    if (error) {
      res.json({
        error: error,
      });
    } else {
      res.json({
        status: `The port  ${req.query.port} is ${status} on target ${req.query.ip}`,
      });
    }
  });
});

app.get("/portScanner/findPortInUse", (req, res) => {
  portscanner.findAPortInUse(req.query.port, req.query.ip, (error, status) => {
    if (error) {
      console.log(error);
      res.json({
        error: error,
      });
    } else {
      res.json({
        status: `The port ${status} on Target ${req.query.ip} is in use.`,
      });
    }
  });
});

app.get("/portScanner/findPortNotInUse", (req, res) => {
  portscanner.findAPortNotInUse(
    req.query.port,
    req.query.ip,
    (error, status) => {
      if (error) {
        console.log(error);
        res.json({
          error: error,
        });
      } else {
        if (status == false) {
          res.json({
            status: `All the Port Specified are in use`,
          });
        } else {
          res.json({
            status: `The port ${status} on Target ${req.query.ip} is not in use.`,
          });
        }
      }
    }
  );
});

app.get("/portScanner/isPortReachable", async (req, res) => {
  var reponse = await isPortReachable(req.query.port, { host: req.query.host });
  console.log(reponse);
  
  if (reponse === true) {
    res.json({
      status: `The Port ${req.query.port} on Host ${req.query.host} is Reachable.`,
    });
  } else if (reponse === false) {
    res.json({
      status: `The Port ${req.query.port} on Host ${req.query.host} is not Reachable.`,
    });
  } else {
    res.json({
      status: `There is a problem with getting the status of the Port ${req.query.port} on Host ${req.query.host}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
