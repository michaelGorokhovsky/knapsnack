const mapKey = "***********************";

var map;
var globalPos;
var hasGeoLocation;
var markers = [];
var marker = null;
var directionsService = null;
 var directionsDisplay = null;
 var globalEndPos;
function initMap() {
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0.0, lng: 0.0},
        zoom: 15,
        styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "weight": 4.5
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "color": "#ecddda"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f1cbc7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
    });
    directionsDisplay.setMap(map);
    if (navigator.geolocation) {
    	navigator.geolocation.watchPosition(function(position) {
            var pos = {
            	lat: position.coords.latitude,
              	lng: position.coords.longitude
            };
	document.getElementById("longitude").value = position.coords.longitude;
	document.getElementById("latitude").value =  position.coords.latitude;

			globalPos = pos;
			
			if (marker != null){
				marker.setMap(null);
			}
			marker = new google.maps.Marker({
				position: globalPos,
				map: map,
				title: 'Current Location',
				icon: {
					url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
				}
			});

            map.setCenter(pos);
			hasGeoLocation = true;
			if (globalEndPos != null) {
				calcRoute(globalPos, globalEndPos);
			}
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    window.onload = function(){
      if (document.cookie != ""){
        var currHistory = JSON.parse(document.cookie)["history"];
        for (var i = 0; i < currHistory.length; i++){
          document.getElementById("historyMenu").options.add(new Option("Radius: " + currHistory[i][0] + " | Budget: " + currHistory[i][1] + ((currHistory[i][2] != "") ? (" | Keyword: " + currHistory[i][2]) : ""), currHistory[i]), 0);
        }
      }

      $("#historyMenu").change(function(e) {
          var args = e.currentTarget.value.split(",");

          document.getElementsByClassName("slidecontainer")[0].getElementsByTagName("input")[0].value = args[0]
          document.getElementById("keyword").value = args[2];
          document.getElementsByClassName("slidecontainer")[1].getElementsByTagName("input")[0].value = args[1]

          document.getElementById("radValue").innerHTML = args[0].toString() + "m";
          document.getElementById("priceValue").innerHTML = "$" + args[1].toString();

          findNearbyRestaraunts();
        });

    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    alert ("Geolocation failed. Please enable location services");
}

function updateHistory(inputRad, inputPrice, keyWord, expiryDate) {
    if(document.cookie == ""){
      document.cookie = JSON.stringify({"history": [[inputRad, inputPrice, keyWord]], "expires": expiryDate});
      var currHistory = JSON.parse(document.cookie)["history"];
      document.getElementById("historyMenu").options.add(new Option("Radius: " + currHistory[0][0] + " | Budget: " + currHistory[0][1] + ((currHistory[0][2] != "") ? (" | Keyword: " + currHistory[0][2]) : ""), currHistory[0]), 0);
    }

    else{
      var currHistory = JSON.parse(document.cookie)["history"];
      var match = false;
      for (var j=0; j<currHistory.length; j++){
        if (currHistory[j].toString() == [inputRad, inputPrice, keyWord].toString()) {
          match = true;
        }
      }

      if (!match){
        currHistory.push([inputRad, inputPrice, keyWord]);
        document.cookie = JSON.stringify({"history": currHistory, "expires": expiryDate});
        document.getElementById("historyMenu").innerHTML = "";
        for (var i = 0; i < currHistory.length; i++){
          document.getElementById("historyMenu").options.add(new Option("Radius: " + currHistory[i][0] + " | Budget: " + currHistory[i][1] + ((currHistory[i][2] != "") ? (" | Keyword: " + currHistory[i][2]) : ""), currHistory[i]), 0);
        }
      } 
    }
}

function findNearbyRestaraunts(){
  var inputRad = parseInt(document.getElementById("radValue").innerHTML.slice(0,document.getElementById("radValue").innerHTML.length-1));
  var keyWord = document.getElementById("keyword").value;
  var inputPrice = parseInt(document.getElementById("priceValue").innerHTML.split("$")[1]);
  var d = new Date();
  d.setTime(d.getTime() + (7*24*60*60*1000));
  var expiryDate = d.toUTCString();

  if (arguments.callee.caller.name.toString() == "onclick"){
    updateHistory(inputRad, inputPrice, keyWord, expiryDate);
  }

	var maxPrice = 0;
	if (inputPrice <= 10) {
		maxPrice = 1;
	} else if (inputPrice <= 20) {
		maxPrice = 2;
	} else if (inputPrice <= 30) {
		var maxPrice = 3;
	} else {
		maxPrice = 4;
	}

	if (isNaN(inputRad)) {
		alert("Radius must be a number!");
	} else if (maxPrice == 0) {
		alert("A price Range Must Be Selected!");
	} else if (hasGeoLocation != true){
		alert("Please turn on geolocation services");
	} else {
		// nearby restaraunt markers

		for (var i = 0; i<10; i++){
			var service = new google.maps.places.PlacesService(map);
	        	service.nearbySearch({
	            		location : globalPos,
	            		radius : inputRad - inputRad*(i/10),
	            		type : [ 'restaurant' ],
				minPriceLevel: maxPrice-1,
				maxPriceLevel: maxPrice,
				keyword: keyWord,
	        	}, callback);

		}
	}
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
	  if (markers.length){
    	deleteMarkers();
    }

		document.getElementById('resContainer').innerHTML = "";
    for (var i = 0; i < results.length; i++) {
  		// console.log(results[i]);
    	//if (i%5 == 0){
    		document.getElementById('resContainer').innerHTML += "<tr class=\"resText\"></tr>";
    	//}
    		createMarker(results[i]);
    }
    showMarkers();

    document.getElementById('leftContainer').style.display = "inline-block";
    document.getElementById('rightContainer').style.display = "inline-block";
    document.getElementById('mapContainer').style.display = "inline-block";
    document.getElementById('rightContainer').style.height = "87%";

  }
}

function createMarker(place) {
	  var infowindow = new google.maps.InfoWindow;
    var content = place.name + '<br />' + place.vicinity + '<br />' + "<img src=" + place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}) + "></img>";
    infowindow.setContent(content);

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map : map,
        position : place.geometry.location,
        infowindow : infowindow
    });
    markers.push(marker);

	  var type = '';
    for (var i = 0; i < place.types.length; i++){
    	if (place.types[i] === "point_of_interest"){
			type = type.slice(0, type.length - 2);
			type = type.replace(/_/g, " ");

			document.getElementById('resContainer').getElementsByTagName("tr")[document.getElementById('resContainer').getElementsByTagName("tr").length-1].innerHTML += "<td class=\"resInfo\"><div class=\"res-name\">" + place.name + "</div>"
				+ "<img class=\"res-img\" src=" + place.photos[0].getUrl({'maxWidth': 540, 'maxHeight': 540}) + "></img>"
				+ "<div class=\"res-type\">" + type + "</div>"
				+ "<div class=\"res-address\">" + place.vicinity + "</div>"
				+ "<div class=\"res-rating\">User Rating: " + place.rating + " / 5 out of " + place.user_ratings_total + " ratings</div>"
				+ ((place.opening_hours.open_now == true) ? "<div class=\"res-open\">Open Now</div>" : "<div class=\"res-open\">Closed Now</div>")
			+ "</td>"
        + "<td><input class=\"getDirections\" type=\"button\" value=\"Get Directions\"></td><br />";
    		break;
    	}
    	else {
    		type += place.types[i].charAt(0).toUpperCase() + place.types[i].slice(1) + ', ';
		  }

	  }

    google.maps.event.addListener(marker, 'click', function() {
        hideAllInfoWindows(map);
        marker.infowindow.open(map, this);

        $('.resText').each(function(){
          $(this).removeClass('highlight');
          $(this).removeClass('selected');
        });

        //var markername = marker.infowindow.content.split('<')[0];
        var address = place.vicinity;
        $('.res-address').each(function(i,obj){
          var $row = $(this).closest('tr');

          if (address == ($(this).text())) {
            $row.addClass('highlight');
            $row.addClass('selected');

            $('#rightContainer').animate({
              scrollTop: $row.offset().top - $('#rightContainer').offset().top + $('#rightContainer').scrollTop()
            });
          }
        });

    });

    $(".getDirections").click(function() {
      var res_address = $(this).closest('tr').find('.res-address').text();
      console.log(res_address);
      globalEndPos = res_address;
 	  calcRoute(globalPos,globalEndPos);
    });
}
function calcRoute(startPos, endPos) {

 	var request = {
 		origin: startPos,
 		destination: endPos,
 		travelMode: 'DRIVING'
 	};
 	directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    } 
  });
}
function hideAllInfoWindows(map) {
   markers.forEach(function(marker) {
     marker.infowindow.close(map, marker);
  });
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
	setMapOnAll(null);
}

function showMarkers() {
	setMapOnAll(map);
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

$( "#resContainer" ).on( "click", ".resInfo", function(e) {
    var res_address = $(event.target).closest('td').find('.res-address').text();

    markers.forEach(function(marker) {
      var temp = marker.infowindow.content.split('>')[1];
      var address = temp.slice(0,temp.length - 5);
      if (address == res_address) {
          hideAllInfoWindows(map);
          marker.infowindow.open(map, marker);
      }
  });

});

var bslider = document.getElementById("budgetRange");
var boutput = document.getElementById("priceValue");
boutput.innerHTML = "$" + bslider.value;

bslider.oninput = function() {
  boutput.innerHTML = "$" + this.value;
}


var rslider = document.getElementById("radiusRange");
var routput = document.getElementById("radValue");
routput.innerHTML = rslider.value + "m";

rslider.oninput = function() {
  routput.innerHTML = this.value + "m";
}
