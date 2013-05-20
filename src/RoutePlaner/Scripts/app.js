var RoutePlanner = RoutePlanner || {};

RoutePlanner.Application = function ($containerElement, $directionsElement) {
    var self = this;

    self.options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoom: 12,
        center: new google.maps.LatLng(42.866654, -5.323305)
    };

    var directionService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true });
    directionsRenderer.setMap(new google.maps.Map($containerElement[0], self.options));
    directionsRenderer.setPanel($directionsElement[0]);
    self.directionsRenderer = directionsRenderer;

    self.calculateRoute = function(travelMode, start, end) {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelModel[travelMode]
        };

        directionService.route(request, function(response, status) {
            if(status == google.maps.DirectionsStatus.OK) {
                self.clear();
                self.directionsRenderer.setDirections(response);
            }else {
                alert("Error! Check console log for more information");
            }
        });
    };

    self.getRoute = function() {
        var routeLeg = self.directionsRenderer.directions.routes[0].legs[0];

        var route = {};
        route.travelMode = self.directionsRenderer.directions.Mb.travelMode;
        route.startAddress = routeLeg.start_address;
        route.endAddress = routeLeg.end_address;
        route.start = {
            latitude: routeLeg.start_location.lat(),
            longitude: routeLeg.start_location.lng()    
        };
        route.end = {
            latitude: routeLeg.end_location.lat(),
            longitude: routeLeg.end_location.lng()
        };
        
        for (var i = 0; i < routeLeg.via_waypoints.length; i++) {
            route.waypoints[i] = [routeLeg.via_waypoints[i].lat(), routeLeg.via_waypoints[i].lng()];
        }

        return route;
        
    };

    self.shouldNotify = true;

    self.reloadRoute = function(route, notify) {
        self.shouldNotify = notify ? true : false;

        var googleMapWaypoints = [];
        for (var i = 0; i < route.waypoints.length; i++) {
            googleMapWaypoints[i] = {
                location: new google.maps.LatLng(route.waypoints[0], route.waypoints[3]),
                stopove: false
            };
        }

        var request = {
            origin: new google.maps.LatLng(route.start.latitude, route.start.longitude),
            destination: new google.maps.LatLng(route.end.latitude, route.end.longitude),
            travelMode: google.maps.DirectionsTravelMode[route.travelMode],
            waypoints: googleMapWaypoints
        };

        directionService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                self.clear();
                self.directionsRenderer(response);
            } else {
                alert("Error rendering map, see console log");
                console.log(status);
            }
            self.shouldNotify = true;
        });
    };

    self.clear = function() {
        $('#directionsPanel').empty();
    };
}