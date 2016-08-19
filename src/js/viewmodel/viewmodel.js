import ko from 'knockout';

// Google map initialization
const mapCenter = new google.maps.LatLng(43.7181557,-79.5181427);

const mapOptions = {
    disableDefaultUI: true,
    center: mapCenter,
    zoom: 10,
};

const map = new google.maps.Map(document.getElementById('map'),
	mapOptions);

// Map location object
function MapLocation(jsonObj) {
    const self = this;
    self.name = jsonObj.dot_buildingName;
    self.latitude = parseFloat(jsonObj.dot_Address.dot_Latitude);
    self.longitude = parseFloat(jsonObj.dot_Address.dot_Longitude);
    self.description = jsonObj.dot_FullDescription[0];

    self.mapMarker = new google.maps.Marker({
        position: {
            lat: self.latitude,
            lng: self.longitude
        },
        map: map,
        title: self.name
    });

    self.infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    self.showInfoWindow = () => {
        if (!self.infoWindow.getContent()) {
            self.infoWindow.setContent('Loading content...');
            const content = `
            <div class="info-window">
            <h3 class="info-title">${self.name}</h3>
            <p class="info-description">${self.description}</p>
            </div>`;
            self.infoWindow.setContent(content);
        }

        self.infoWindow.open(map, self.mapMarker);
    };

    self.activate = () => {
        if (MapLocation.prototype.active) {
            if (MapLocation.prototype.active !== self) {
                MapLocation.prototype.active.deactivate();
            }
        }

        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        self.showInfoWindow();

        MapLocation.prototype.active = self;
    };

    self.deactivate = () => {
        self.mapMarker.setAnimation(null);
        self.infoWindow.close();

        MapLocation.prototype.active = null;
    };

    self.focus = () => {
        map.panTo({
            lat: self.latitude,
            lng: self.longitude
        });
        self.activate();
    };

    self.mapMarkerClickHandler = () => {
        if (MapLocation.prototype.active === self) {
            self.deactivate();
        }
        else {
            self.activate();
        }
    };

    self.infoWindowCloseClickHandler = () => {
        self.deactivate();
    };

    self.mapMarker.addListener('click', self.mapMarkerClickHandler);
    self.infoWindow.addListener('closeclick', self.infoWindowCloseClickHandler);
}

MapLocation.prototype.active = null;

// Knockout view model
export default function appViewModel() {
    const self = this;
    self.locations = ko.observableArray([]);
    self.filter = ko.observable('');
    self.loadingMsg = ko.observable('Loading locations...');
    self.isVisible = ko.observable(true);

    // Function that toggles location list visibility
    self.toggleVisibility = () => {
        self.isVisible(!self.isVisible());
    };

    // Focus on clicked location
    self.clickHandler = (location) => {
        location.focus();
    };

    self.searchResults = ko.computed(() => {
        const results = [];

        const re = new RegExp(self.filter(), 'i');
        self.locations().forEach((location) => {
            if (location.name.search(re) !== -1) {
                results.push(location);
                location.mapMarker.setVisible(true);
            }
            else {
                location.mapMarker.setVisible(false);

                if (MapLocation.prototype.active === location) {
                    location.deactivate();
                }
            }
        });

        return results;
    });

    const jsonUrl = 'http://wx.toronto.ca/inter/culture/doorsopen.nsf/DoorsOpenBuildingJSON.xsp';
    $.ajax({
        url: jsonUrl,
        dataType: 'jsonp',
        jsonpCallback: 'jsonBuildingsCallBack',
        type: 'GET'
    }).done((data) => {
        const locations = [];
        let location = null;
        const bounds = new google.maps.LatLngBounds();

        data.forEach((object) => {
            location = new MapLocation(object);
            locations.push(location);

            // Extend map bounds
            bounds.extend(location.mapMarker.position);
        });

        // Update observableArray
        self.locations(locations);

        // Resize map to fit all locations
        map.fitBounds(bounds);

        self.loadingMsg(null);
    }).fail(() => {
        self.loadingMsg('Cannot load data');
        console.log('ERROR: Cannot load location data');
    });
}
