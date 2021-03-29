/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
// import Root from './app/Modalize/app';
// import Root from './app/Modalize/react-navigation/app';
// import Root from './Main';
import Root from './app/Demo/Navigation/Root';

AppRegistry.registerComponent(appName, () => Root);
