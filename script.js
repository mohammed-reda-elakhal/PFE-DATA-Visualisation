mapboxgl.accessToken = 'pk.eyJ1IjoicmVkYWVsYWtoYWwyMDIiLCJhIjoiY2xkdWN5NXNoMDA4cDN1cnp0aDlzNmIzbCJ9.DIS3t0wC_vtuIPf-RoaD5w';

const map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/redaelakhal202/cle4hhss7002901qmumoq0jzv',
  center:    [-74.0059, 40.7128] ,//  this form city fes morocco [-4.629472,33.993861 ] initial map center in [lon, lat]
  zoom: 13
})

// slide bar 
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('.sidebar-toggle');

toggleButton.addEventListener('click', function() {
  sidebar.classList.toggle('active');
  toggleButton.classList.toggle('active');
});






map.on('load', function(){
    map.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: './collisions1601.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Casualty']],
          0,
          4,
          5,
          24
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Casualty']],
          1,
          '#00e1ff',
          2,
          '#669ec4',
          3,
          '#d17171',
          4,
          '#ff09da',
          5,
          '#ff0059'
        ],
        'circle-opacity': 0.8
      }
      /*
      This code is defining a paint style for a circle symbol layer in a Mapbox GL JS map.

        The 'circle-radius' property is using the 'interpolate' expression to set the size of the circle based on the 'Casualty' property of the data. The size of the circle will be 4 when 'Casualty' is 0 and 24 when 'Casualty' is 5.

        The 'circle-color' property is also using the 'interpolate' expression to set the color of the circle based on the 'Casualty' property of the data. The color of the circle will be green when 'Casualty' is 0, and gradually transition to blue, light blue, gray, red, and finally pink as 'Casualty' increases to 5.

        The 'circle-opacity' property is setting the opacity of the circle to 0.8.
      */ 
    });
  });

 // this code pour slide bar .
  document.getElementById('slider').addEventListener('input', (event) => {
    const hour = parseInt(event.target.value);
    // update the map
    map.setFilter('collisions', ['==', ['number', ['get', 'Hour']], hour]);
  
    // converting 0-23 hour to AMPM format
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 ? hour % 12 : 12;
  
    // update text in the UI
    document.getElementById('active-hour').innerText = hour12 + ampm;
  });
  

  document.getElementById('filters').addEventListener('change', (event) => {
    const day = event.target.value;
    // update the map filter
    if (day === 'all') {
      filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
    } else if (day === 'weekday') {
      filterDay = ['match', ['get', 'Day'], ['Sat', 'Sun'], false, true];
    } else if (day === 'weekend') {
      filterDay = ['match', ['get', 'Day'], ['Sat', 'Sun'], true, false];
    } else {
      console.log('error');
    }
    map.setFilter('collisions', ['all', filterDay]);
  });


document.getElementById('filters').addEventListener('change', (event) => {
    const day = event.target.value;
    if (day === 'all') {
      // `null` would not work for combining filters
      filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
    }
    /* the rest of the if statement */
    map.setFilter('collisions', ['all', filterHour, filterDay]);
  });



  // Set the initial filter to show all casualties
  let filterCasualties = null;

  // Add an event listener to the filters element
  document.getElementById('filter_c').addEventListener('change', (event) => {
    const casualties = parseInt(event.target.value);

    if (casualties === 1) {
      filterCasualties = ['==', ['get', 'Casualty'], 1];
    } else if (casualties === 2) {
      filterCasualties = ['==', ['get', 'Casualty'], 2];
    } else if (casualties === 3) {
      filterCasualties = ['==', ['get', 'Casualty'], 3];
    } else if (casualties === 4) {
      filterCasualties = ['==', ['get', 'Casualty'], 4];
    } else if (casualties === 5){
      filterCasualties = ['>=', ['get', 'Casualty'], 5];
    }else {
      filterCasualties = null;
    }

    map.setFilter('collisions', ['all', filterCasualties]);})


    const animationButton = document.getElementById('animation-button');
let animationInterval = null;

animationButton.onclick = () => {
  if (animationInterval) {
    // Stop the animation
    clearInterval(animationInterval);
    animationInterval = null;
    animationButton.innerText = 'Start';
  } else {
    // Start the animation
    let currentHour = parseInt(document.getElementById('slider').value);
    animationInterval = setInterval(() => {
      currentHour = (currentHour + 1) % 24;
      document.getElementById('slider').value = currentHour;
      document.getElementById('active-hour').innerText = formatHour(currentHour);
      map.setFilter('collisions', ['==', ['number', ['get', 'Hour']], currentHour]);
    }, 500);
    animationButton.innerText = 'Stop';
  }
}

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 ? hour % 12 : 12;
  return hour12 + ampm;
}


document.querySelectorAll('#filters input[type=radio]').forEach((input) => {
  input.addEventListener('change', (event) => {
    const day = event.target.value;
    // update the map filter
    if (day === 'all') {
      filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
    } else {
      filterDay = ['==', ['string', ['get', 'Day']], day];
    }
    map.setFilter('collisions', ['all', filterDay]);
  });
});
