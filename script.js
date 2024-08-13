let map = L.map('map').setView([28.7041, 77.1025], 10);  // Centered on Delhi

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let startMarker, endMarker;
let vehicleMarker;
let routePolyline;
let routePath = [];
let journeyStarted = false;

// Event listener to set the start and end points
map.on('click', function(e) {
    if (!startMarker) {
        startMarker = L.marker(e.latlng, { draggable: true }).addTo(map)
            .bindPopup("Start Location").openPopup();
        routePath[0] = [e.latlng.lat, e.latlng.lng];
    } else if (!endMarker) {
        endMarker = L.marker(e.latlng, { draggable: true }).addTo(map)
            .bindPopup("End Location").openPopup();
        routePath[1] = [e.latlng.lat, e.latlng.lng];
        drawRoute();
    }
});

// Function to draw the route
function drawRoute() {
    if (routePath.length === 2) {
        // Create a polyline for the route
        routePolyline = L.polyline(routePath, {
            color: 'blue',
            weight: 4,
        }).addTo(map);

        // Add vehicle marker at start position
        vehicleMarker = L.marker(routePath[0], {
            icon: L.icon({
                iconUrl: 'https://img.icons8.com/doodle/48/car--v1.png',
                iconSize: [50, 50],
            })
        }).addTo(map);
    }
}

// Function to smoothly move the vehicle
function moveVehicle() {
    if (routePath.length === 2 && journeyStarted) {
        const [startLat, startLng] = routePath[0];
        const [endLat, endLng] = routePath[1];

        let lat = startLat, lng = startLng;
        const steps = 100; // Number of steps for smooth movement
        const latStep = (endLat - startLat) / steps;
        const lngStep = (endLng - startLng) / steps;
        let currentStep = 0;

        const intervalId = setInterval(() => {
            if (currentStep < steps) {
                lat += latStep;
                lng += lngStep;
                vehicleMarker.setLatLng([lat, lng]);
                currentStep++;
            } else {
                clearInterval(intervalId);
                journeyStarted = false;  // Journey ends
            }
        }, 50); // Adjust speed by changing the interval duration
    }
}

// Start Journey button click event
document.getElementById('startJourney').addEventListener('click', function() {
    if (routePath.length === 2) {
        journeyStarted = true;
        moveVehicle();
    } else {
        alert('Please select both start and end points.');
    }
});

// Reset Map button click event
document.getElementById('resetMap').addEventListener('click', function() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    startMarker = null;
    endMarker = null;
    vehicleMarker = null;
    routePolyline = null;
    routePath = [];
    journeyStarted = false;
});

