let map;
let lat = parseFloat(document.getElementById("lat").getAttribute("value"));
let lng = parseFloat(document.getElementById("lng").getAttribute("value"));
let name = document.getElementById("restaurantName").textContent;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: lat, lng: lng},
        zoom: 12
    });

    const marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map,
        title: name
    });

    // content can be modified to add more stuff
    const infowindow = new google.maps.InfoWindow({
        content: name
    });

    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });

    infoWindow2 = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Move To Current Location";
    locationButton.classList.add("current-location");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow2.setPosition(pos);
          infoWindow2.setContent("Current Location");
          infoWindow2.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow2, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow2, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow2.open(map);
}