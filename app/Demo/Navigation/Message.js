import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet'
import WebView from 'react-native-webview'
import {
  Text,
  View,
  Alert,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';

class Message extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <TouchableHighlight
        underlayColor='transparent'
      >
        <>
          <Text allowFontScaling={false} numberOfLines={1} style={{
            fontSize: 17,
            fontWeight: '600',
            color: 'rgba(0, 0, 0, .9)',
            textAlign: 'center',
            marginHorizontal: 16
          }}>消息</Text>
        </>
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerStyle: {
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      data: [],
      rows: [
        {
          text: '系统消息',
          color: '#FFF',
          style: {
            backgroundColor: '#4b98fe',
          },
          name: 'notifications',
          category: 0
        },
        {
          text: '订单信息',
          color: '#FFF',
          style: {
            backgroundColor: '#20c160',
          },
          name: 'card',
          category: 1
        },
        {
          text: '交易物流',
          color: '#FFF',
          style: {
            backgroundColor: '#ffb000',
          },
          name: 'albums',
          category: 2
        },
        {
          text: '抢购消息',
          color: '#FFF',
          style: {
            backgroundColor: '#894bfe',
          },
          name: 'gift',
          category: 3
        },
      ]
    };

    AsyncStorage.getItem('user')
    .then((response) => {
      this.setState({
        user: JSON.parse(response)
      })

      this.fetchData();
    })
    .catch((error) => {
      console.log(error);
    })
    .done();

  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      AsyncStorage.getItem('user')
      .then((response) => {
        this.setState({
          user: JSON.parse(response)
        })

        this.fetchData();
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
    })
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  fetchData() {
    fetch(`https://taupd.ferer.net/v1/api/message?sign=${ this.state.user.token }`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        data: responseData
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  render() {
    return (
      <>
        <View style={styles.iconApps}>
          {
            this.state.rows.map((item, key) => {
              return (
                <TouchableHighlight
                  keys={key}
                  underlayColor="none"
                  style={styles.iconContainer}
                  onPress={() => {
                      this.props.navigation.navigate('MessageCategory', { title: item.text, category: item.category })
                    }
                  }
                >
                  <>
                    <Ionicons style={[styles.icon, {...item.style}]} name={item.name} size={20} color={'#FFF'} />
                    <Text style={styles.text} allowFontScaling={false}>{item.text}</Text>
                  </>
                </TouchableHighlight>
              )
            })
          }
        </View>
        <ScrollView>
          <View style={styles.lists}>
            {
              this.state.data && this.state.data.map((item, key) => {
                return (
                  <TouchableHighlight
                    key={key}
                    underlayColor="none"
                    onPress={() => {
                      this.props.navigation.navigate('Web', { title: '消息详细', uri: `https://taupd.ferer.net/mobile/messages/${ item.id }?sign=` + this.state.user.token })
                    }}
                  >
                    <View style={styles.list}>
                      <View style={styles.body}>
                        <View style={[styles.flexBetween, styles.head]}>
                          <Text style={styles.title} allowFontScaling={false}>{ item.title }</Text>
                          <View style={styles.status}></View>
                        </View>
                        <Text style={styles.text} allowFontScaling={false} numberOfLines={2}>{ item.content }</Text>
                      </View>
                      <View style={[styles.foot, styles.flexBetween]}>
                        <Text style={[styles.text, { fontSize: 13 }]} allowFontScaling={false}>{ item.created_at }</Text>
                        <Text style={[styles.text, { fontSize: 13 }]} allowFontScaling={false}>{ item.category }</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              })
            }
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = {
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconApps: {
    backgroundColor: '#FFF',
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    lineHeight: 40,
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: '#999999'
  },
  // lists
  lists: {
    marginTop: 10
  },
  list: {
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: 'rgba(204, 204, 204, 0.4)'
  },
  foot: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderColor: 'rgba(204, 204, 204, 0.4)'
  },
  text: {
    color: '#333',
    fontSize: 14
  },
  title: {
    fontWeight: '600',
    fontSize: 15
  },
  head: {
    marginBottom: 10
  },
  status: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#ff1c1c',
    marginRight: 5
  }
}

export default Message;
