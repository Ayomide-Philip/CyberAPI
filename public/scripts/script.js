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
