RoutePlanner.StartPage = function() {
    var self = this;
    self.app = new RoutePlanner.Application();
    self.routes = ko.observableArray([]);
    self.travelMode = ko.observable('DRIVING');
    self.start = ko.observable('boñar, leon');
    self.end = ko.observable('La Vecilla, Leon');

    self.calculate = function() {
        self.app.calculateRoute(self.travelMode, self.start, self.end);
    };

    self.reload = function(route) {
        self.app.reload(route);
    };

    self.addRoute = function(route) {
        var routeMatch = ko.utils.arrayFirst(self.routes(), function (item) {
            return route.start.latitude == item.start.latitude && route.start.longitude == item.start.longitude &&
                  route.end.latitude == item.end.latitude && route.end.longitude == item.end.longitude && route.travelMode == item.travelMode;
        });

        if (!routeMatch) {
            self.routes.push(route);
        }
    };
    
};