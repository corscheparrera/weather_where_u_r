
(function () {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/'
  var DARKSKY_API_KEY = '59025134cb9167fd1abd58424053050d'
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

  var GOOGLE_MAPS_API_KEY = 'AIzaSyAkwdah0aPc1vFabvDc_PAh1SPkb8uJrJA'
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

  var app = document.querySelector('#app')

  var cityweather = app.querySelector('.cityweather')
  var loadGif = document.querySelector('.load')
  var title = document.querySelector('.title')

    // This function returns a promise that will resolve with an object of lat/lng coordinates

  function getCoordinatesForGeoLocation () {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          var coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          resolve(coordinates)
        })
      } else {
        cityweather.innerHTML = 'Geolocation is not supported by this browser.'
        reject(new Error('Geolocation is not supported by this browser.'))
      }
    })
  }

  function getCurrentWeather (coordinates) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coordinates.lat},${coordinates.lng}?units=si`
    return (
            window.fetch(url)
                .then(response => response.json())
                .then(data => data.currently)
    )
  }

    //   cityForm.addEventListener('submit', function (event) {
    //     loadGif.classList.remove('hide')
    //     event.preventDefault() // prevent the form from submitting

  getCoordinatesForGeoLocation()
        .then(getCurrentWeather)
        .then(weather => {
          cityweather.innerHTML = 'temperature is currently ' + weather.temperature
        })
        .then(() => loadGif.classList.add('hide'))
    //   })

  function newGmap (coordinates) {
    return new Promise((resolve, reject) => {
      var latlng
      latlng = new google.maps.LatLng(coordinates.lat, coordinates.lng)
      resolve(latlng)
    })
  }

  function cityInfos (latlng) {
    return new Promise((resolve) => {
      new google.maps.Geocoder().geocode({ 'latLng': latlng }, results => {
        resolve(results[1].address_components[0].long_name)
      })
    })
  }

  getCoordinatesForGeoLocation()
    .then(newGmap)
    .then(cityInfos)
    .then(x => { title.innerHTML = x })
})()
