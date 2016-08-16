import map from './utils/maps.js';
import ko from 'knockout';
import appViewModel from './viewmodel/viewmodel.js';
import './materialize.js';
import css from '../style/main.scss';

google.maps.event.addDomListener(window, 'load', map);
ko.applyBindings(new appViewModel);
