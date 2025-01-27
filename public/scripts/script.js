document.querySelector(".recivedDomainName").style.display = "none";
document.querySelector(".recivedIpAddress").style.display = "none";
document.querySelector(".recivedStatus").style.display = "none";

function getIp(events) {
  events.preventDefault();
  var ip = document.querySelector('input[name="ip"]');
  axios
    .get(`/myIpAddress`)
    .then((response) => {
      const myIpAddress = response.data.myIpAddress;
      console.log(`${myIpAddress}`);
      document.querySelector('input[name="ip"]').value = myIpAddress;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getLocation(events) {
  events.preventDefault();
  var ip = document.querySelector('input[name="userIp"]').value;
  console.log(ip);
  axios
    .get(`/myLocation?ip=${encodeURIComponent(ip)}`)
    .then((response) => {
      console.log(`${response.data}`);
      console.log(response.data.myIpAddress);
      document.querySelector(
        "span#ipAddress"
      ).innerHTML = `${response.data.myIpAddress}`;
      document.querySelector(
        "span#userCity"
      ).innerHTML = `${response.data.userCity}`;
      document.querySelector(
        "span#userRegion"
      ).innerHTML = `${response.data.userRegion}`;
      document.querySelector(
        "span#userCountry"
      ).innerHTML = `${response.data.userCountry}`;
      document.querySelector(
        "span#userLongitutde"
      ).innerHTML = `${response.data.userLongitutde}`;
      document.querySelector(
        "span#userLatitude"
      ).innerHTML = `${response.data.userLatitude}`;
      document.querySelector(
        "span#userTimeZone"
      ).innerHTML = `${response.data.userTimeZone}`;
      document.querySelector(
        "span#userCountryCode"
      ).innerHTML = `${response.data.userCountryCode}`;
      document.querySelector(
        "span#userNetworkProvider"
      ).innerHTML = `${response.data.userNetworkProvider}`;
    })
    .catch((error) => {
      console.error(error);
    });
}

function reverseIp(events) {
  document.querySelector(".recivedDomainName").style.display = "none";
  events.preventDefault();
  var ip = document.querySelector('input[name="userIpInputed"]');
  if (ip.value == undefined || "") {
    document.querySelector(".recivedDomainName").style.display = "flex";
    document.querySelector("#recivedDomainName").value =
      "There is no Ip Specified.";
  } else {
    axios
      .get(`/reverseDNSLookup?ip=${encodeURIComponent(ip.value)}`)
      .then((response) => {
        const hostName = response.data.hostname;
        if (hostName !== undefined) {
          console.log(`${hostName}`);
          document.querySelector(".recivedDomainName").style.display = "flex";
          document.querySelector("#recivedDomainName").value = hostName;
        } else {
          document.querySelector(".recivedDomainName").style.display = "flex";
          document.querySelector("#recivedDomainName").value =
            "The Ip Specified is not related to a Domain Name.";
        }
      })
      .catch((error) => {
        console.error(error);
        document.querySelector(".recivedDomainName").style.display = "flex";
        document.querySelector("#recivedDomainName").value =
          "There is an error Encountered";
      });
  }
}

function domainQuery(events) {
  document.querySelector(".recivedIpAddress").style.display = "none";

  events.preventDefault();
  var domain = document.querySelector('input[name="userDomainInputed"]');
  console.log(domain);

  if (domain.value == undefined || "") {
    document.querySelector(".recivedIpAddress").style.display = "flex";
    document.querySelector("#recivedIpAddress").value =
      "There is no Domain Name Specified.";
  } else {
    axios
      .get(`/dnsLookup?domain=${encodeURIComponent(domain.value)}`)
      .then((response) => {
        const ipRecived = response.data.addresses;
        if (ipRecived !== undefined) {
          console.log(`${ipRecived}`);
          document.querySelector(".recivedIpAddress").style.display = "flex";
          document.querySelector("#recivedIpAddress").value = ipRecived;
        } else {
          document.querySelector(".recivedIpAddress").style.display = "flex";
          document.querySelector("#recivedIpAddress").value =
            "The Domain Name is incorrect.";
        }
      })
      .catch((error) => {
        console.error(error);
        document.querySelector(".recivedIpAddress").style.display = "flex";
        document.querySelector("#recivedIpAddress").value =
          "There is an error Encountered";
      });
  }
}

function isPortReachable(events) {
  document.querySelector(".recivedStatus").style.display = "none";
  events.preventDefault();
  var port = document.getElementById("userInputedPort").value;
  const hostName = document.getElementById("userInputedHostName").value;

  console.log(`${hostName}:${port}`);

  axios
    .get(
      `/portScanner/isPortReachable?port=${encodeURIComponent(
        port
      )}&host=${encodeURIComponent(hostName)}`
    )
    .then((response) => {
      document.querySelector(".recivedStatus").style.display = "flex";
      document.getElementById("recivedStatus").value = response.data.status;
    })
    .catch((error) => {
      console.log(error);
      document.querySelector(".recivedStatus").style.display = "flex";
      document.getElementById("recivedStatus").value =
        "An error was Encountered/";
    });
}
