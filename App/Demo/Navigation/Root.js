import React from 'react';
import {
  Button,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';
import Home from './Home'
import Classify from './Classify'
import Web from './Web'
import Life from './Life'
import Cart from './Cart'
import CartManage from './CartManage'
import User from './User'
import Login from './Login'
import Setting from './Setting'
import Message from './Message'
import Integral from './Integral'
import IntegralDetail from './IntegralDetail'
import ConfirmOrder from './ConfirmOrder'
import LotteryDetails from './LotteryDetails';
import AnimatedTurnTableDraw from './AnimatedTurnTableDraw';
class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('DetailsScreen')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <TouchableHighlight
        underlayColor='transparent'
      >
        <View>
          <TextInput
            inlineImageLeft='search_icon'
            style={{ marginLeft: 10, paddingLeft: 15, height: 33, width: Dimensions.get('window').width - 20, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 0 }}
            placeholder=''
          />
        </View>
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerTitleStyle: {color: '#000000'},
    headerStyle: {
      backgroundColor: '#ffd600',
      borderBottomWidth: 0,
      elevation: 0
    },
  });

  render() {
    return (
      <Home {...this.props} />
    );
  }
}

class LifeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 1)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>消息</Text>
    ),
    tabBarVisible: false,
    headerTitleStyle: {color: '#000000'},
    headerStyle: {
      backgroundColor: '#ffd600',
      borderBottomWidth: 0,
      elevation: 0
    },
  });

  render() {
    return (
      <Message />
    );
  }
}

class CartScreen extends React.Component {
  static navigationOptions ({ navigation }) {
    const { params } = navigation.state;

    return {
      headerTitle: (
        <Text allowFontScaling={false} style={{
          fontSize: 17,
          fontWeight: '600',
          color: 'rgba(0, 0, 0, 1)',
          textAlign: 'center',
          marginHorizontal: 16
        }}>购物车</Text>
      ),
      headerRight: (
        <TouchableHighlight
          style={{padding: 10}}
          activeOpacity={0.85}
          underlayColor="none"
          onPress={() => {
            navigation.setParams({
              manage: !navigation.state.params.manage
            })

            navigation.state.params.navigatePress()
          }}
        >
          <Text allowFontScaling={false}>管理</Text>
        </TouchableHighlight>
      ),
      tabBarVisible: false,
      headerTitleStyle: {color: '#000000'},
      headerStyle: {
        backgroundColor: '#ffd600',
        borderBottomWidth: 0,
        elevation: 0
      },
    }
  };

  navigatePress = ()=> {
    this.setState({
      manage: this.props.navigation.state.params.manage
    })
  }

  constructor(props) {
    super(props);

    this.state = {
      manage: false
    };
  }

  componentDidMount() {
    // static 中设置 this 方法
    this.props.navigation.setParams({
      navigatePress: this.navigatePress,
      manage: false
    })
  }

  render() {
    if (!this.state.manage) {
      return (
        <Cart { ...this.props } />
      );
    } else {
      return (
        <CartManage { ...this.props } />
      );
    }
  }
}

class UserScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: null,
    headerRight: null,
    tabBarVisible: false,
    headerTitleStyle: {color: '#000000'},
    headerStyle: {
      backgroundColor: '#ffd600',
      borderBottomWidth: 0,
      elevation: 0
    },
  });

  render() {
    return (
      <User {...this.props} />
    );
  }
}

class ClassifyScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <TouchableHighlight
        underlayColor='transparent'
      >
        <View>
          <TextInput
            inlineImageLeft='search_icon'
            style={{ marginLeft: 10, paddingLeft: 15, height: 33, width: Dimensions.get('window').width - 20, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 0 }}
            placeholder=''
          />
        </View>
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerTitleStyle: {color: '#000000'},
    headerStyle: {
      backgroundColor: '#ffd600',
      borderBottomWidth: 0,
      elevation: 0
    },
  });

  render() {
    return (
      <Classify {...this.props} />
    );
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen
});

const CardStack = createStackNavigator({
  Card: CartScreen
});

const LifeStack = createStackNavigator({
  Life: LifeScreen
});

const ClassifyStack = createStackNavigator({
  Classify: ClassifyScreen
});

const UserStack = createStackNavigator({
  User: UserScreen,
});

const BottomNavigatorScreen = createBottomTabNavigator({
  Home: {
     screen: HomeStack,
     navigationOptions: {
        tabBarLabel: '首页',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'md-home' : 'md-home'}
            size={25}
            style={{color: tintColor}}
          />
        ),
     },
  },
  Classify: {
     screen: ClassifyStack,
     navigationOptions: {
        tabBarLabel: '分类',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'md-list' : 'md-list'}
            size={25}
            style={{color: tintColor}}
          />
        ),
     },
  },
  Life: {
     screen: LifeStack,
     navigationOptions: {
        tabBarLabel: '发现',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'earth' : 'earth'}
            size={25}
            style={{color: tintColor}}
          />
        ),
     },
  },
  Cart: {
     screen: CardStack,
     navigationOptions: {
        tabBarLabel: '购物车',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'md-cart' : 'md-cart'}
            size={25}
            style={{color: tintColor}}
          />
        ),
     },
  },
  User: {
     screen: UserStack,
     navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'md-person' : 'md-person'}
            size={25}
            style={{color: tintColor}}
          />
        ),
     },
  },
}, {
  mode: 'card',
  headerMode: 'none',
  initialRouteName: 'Home'
});

const stackNavigator = createStackNavigator({
  BottomNavigatorScreen: {
    screen: BottomNavigatorScreen,
    navigationOptions: {
      header: null
    }
  },
  DetailsScreen: { screen: DetailsScreen },
  Web: { screen: Web },
  Login: { screen: Login },
  Setting: { screen: Setting },
  Message: { screen: Message },
  Integral: { screen: Integral },
  IntegralDetail: { screen: IntegralDetail },
  ConfirmOrder: { screen: ConfirmOrder },
  LotteryDetails: { screen: LotteryDetails },
  AnimatedTurnTableDraw: { screen: AnimatedTurnTableDraw },
})

module.exports = stackNavigator;
