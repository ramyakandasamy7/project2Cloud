var map;
var geocoder;
var address = 'San Jose, CA'
function myMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('myMap'), {
        center: {lat:-34.397, lng:150.644}, zoom: 8
    })
}