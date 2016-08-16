import ko from 'knockout';
// import places from '../models/places.js';

const mapLocation = (jsonObj) => {
    const self = this;
    self.name = dataObj.name;
};

export default function appViewModel() {
    const self = this;
    self.stations = ko.observableArray([]);
    self.places = [
        {
            name: 'Bovine Sex Club', lat: 43.6476403, lon: -79.4049726
        },
        {
            name: 'TIFF Bell Lightbox', lat: 43.6467232, lon: -79.3925429
        },
        {
            name: 'Kensington Market', lat: 43.6547861, lon: -79.4023693
        },
        {
            name: 'Sneaky Dee\'s', lat: 43.656333, lon: -79.4096757
        },
        {
            name: 'Pomegranate Restaurant', lat: 43.656333, lon: -79.4096757
        },
    ];

    const jsonUrl = 'http://wx.toronto.ca/inter/culture/doorsopen.nsf/DoorsOpenBuildingJSON.xsp';

    $.ajax({
        url: jsonUrl,
        dataType: 'jsonp',
        jsonpCallback: 'jsonBuildingsCallBack',
        type: 'GET',
        success: function(data) {
            console.log(data);
        }
    });
}
