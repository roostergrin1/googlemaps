var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var countryRestrict = { 'country': 'us' };
var spinner = document.getElementById("spinner-1");
var latlon;
var office;

var x = document.getElementById("map-status");
var el1 = document.getElementById('gmaps1');
	
var myLatlng1 = new google.maps.LatLng(37.779431, -122.418480);
var myLatlng2 = new google.maps.LatLng(37.781873, -122.413877);
var mapCenter = new google.maps.LatLng(37.780660, -122.415427);

function getLocation(office) {
	spinner.setAttribute('class', 'show spinner-1');
    if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position) {
			calcRoute((position.coords.latitude + ", " + position.coords.longitude).toString(), office);
		}, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function calcRoute(pos_str, office) {
	var selectedMode = document.getElementById('mode1').value;
	var desto = myLatlng1;

	    if (office == "office1") {
		    desto = myLatlng1;
	    }
	    else if (office == "office2") {
		    desto = myLatlng2;
	    }

		var request = {
			origin: pos_str,
			destination: desto,
			travelMode: google.maps.TravelMode[selectedMode]
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
						spinner.setAttribute('class', 'spinner-1');
			} else {
				spinner.setAttribute('class', 'spinner-1');
			}
		});
}

/* This function is run when one of the selection boxes is changed */
function directions(office) {
	getLocation(office, function(){
		calcRoute(latlon, office);
	})
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            spinner.setAttribute('class', '');
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            spinner.setAttribute('class', '');
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            spinner.setAttribute('class', '');
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
			spinner.setAttribute('class', '');
            break;
    }
}


function init() {		
	directionsDisplay = new google.maps.DirectionsRenderer();
   	
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions1 = {
		zoom: 16,
		center: mapCenter,
		styles: [
		    {
		        "featureType": "all",
		        "elementType": "all",
		        "stylers": [
		            {
		                "saturation": 0 //-100
		            },
		            {
		                "gamma": 0.5
		            }
		        ]
		    }
		]
	};
	
			
	// Create the Google Map using the elements and options defined above. Map should have id "gmaps1"
	var map1 = new google.maps.Map(document.getElementById('gmaps1'), mapOptions1);
	directionsDisplay.setMap(map1);

	/** Autocomplete addresses input**/
	var autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('autocomplete')),
		{
			componentRestrictions: countryRestrict
		}
	);
	
	places = new google.maps.places.PlacesService(map1);

  	google.maps.event.addListener(autocomplete, 'place_changed');
  	
  	google.maps.event.addDomListener(document.getElementById('go-button-1'), 'click', function () {
	  	 setLocation('office1');
	});
  	google.maps.event.addDomListener(document.getElementById('go-button-2'), 'click', function () {
	  	setLocation('office2');
	 });


  	function setLocation(office) {
	  	address = document.getElementById('autocomplete').value;
	  	var geocoder = new google.maps.Geocoder();
	  	geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	A = results[0].geometry.location.G;
		    	F = results[0].geometry.location.K;
		    	calcRoute(A+', '+F, office);
		    } else {
		    	alert('Geocode was not successful for the following reason: ' + status);
		    	spinner.setAttribute('class', '');
		    }
	});


	}
  	/** Add Markers to map **/

	marker1 = new google.maps.Marker({
   		position: myLatlng1,
   		map: map1,
   		title: 'Office2'
   	});
   	
    marker2 = new google.maps.Marker({
   		position: myLatlng2,
   		map: map1,
   		title: 'Office1'
   	});

   	
   	var contentString1 = '<div id="content">'+
   	  '<h5>Your Office1 HTML Here</h5>'+
      '</div>';
    var contentString2 = '<div id="content">'+
   	  '<h5>Your Office2 HTML Here</h5>'+
      '</div>';

    var	infowindow1 = new google.maps.InfoWindow({
      content: contentString1
  	});
  	var	infowindow2 = new google.maps.InfoWindow({
      content: contentString2
  	});
  	

   	google.maps.event.addListener(marker1, 'click', function() {
	   	infowindow1.open(map1, marker1);
   	});
   	google.maps.event.addListener(marker2, 'click', function() {
	   	infowindow2.open(map1, marker2);
   	});
   	
   	infowindow1.open(map1, marker1);
   	infowindow2.open(map1, marker2);
}


// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);