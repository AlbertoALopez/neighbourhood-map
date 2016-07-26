const jQuery = require('jquery');
import map from './utils/maps.js';
import './materialize.js';

import css from '../style/main.scss';

google.maps.event.addDomListener(window, 'load', map);
