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
      rows: [
        {
          type: 'navigate',
          text: '系统消息',
          color: '#FFF',
          style: {
            backgroundColor: '#4b98fe',
          },
          name: 'notifications',
          uri: 'Integral'
        },
        {
          type: 'web',
          text: '订单信息',
          color: '#FFF',
          style: {
            backgroundColor: '#20c160',
          },
          name: 'card',
          uri: 'https://taupd.ferer.net/mobile/user/address'
        },
        {
          type: 'web',
          text: '交易物流',
          color: '#FFF',
          style: {
            backgroundColor: '#ffb000',
          },
          name: 'albums',
          uri: ''
        },
        {
          type: 'web',
          text: '抢购消息',
          color: '#FFF',
          style: {
            backgroundColor: '#894bfe',
          },
          name: 'gift',
          uri: 'https://taupd.ferer.net/mobile/user/feedback'
        },
      ]
    };
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
                      this.props.navigation.navigate('Web', { title: item.text, uri: item.uri + '?sign=' + this.state.user.token })
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
            <View style={styles.list}>
              <View style={styles.body}>
                <Text style={styles.title} allowFontScaling={false}>聊天素材用小程序打开功能灰度安卓用户</Text>
                <Text style={styles.text} allowFontScaling={false} numberOfLines={2}>开发者你好，微信聊天内的素材（图片、视频和webview）增加用小程序打开的能力，近日逐步灰度安卓用户。你可选择对该能力进行适配，适配方法详见《开发文档》。</Text>
              </View>
              <View style={[styles.foot, styles.flexBetween]}>
                <Text style={[styles.text, { fontSize: 13 }]} allowFontScaling={false}>2020-01-01</Text>
                <View style={styles.status}></View>
              </View>
            </View>
            <View style={styles.list}>
              <View style={styles.body}>
                <Text style={styles.title} allowFontScaling={false}>聊天素材用小程序打开功能灰度安卓用户</Text>
                <Text style={styles.text} allowFontScaling={false} numberOfLines={2}>开发者你好，微信聊天内的素材（图片、视频和webview）增加用小程序打开的能力，近日逐步灰度安卓用户。你可选择对该能力进行适配，适配方法详见《开发文档》。</Text>
              </View>
              <View style={[styles.foot, styles.flexBetween]}>
                <Text style={[styles.text, { fontSize: 13 }]} allowFontScaling={false}>2020-01-01</Text>
                <View style={styles.status}></View>
              </View>
            </View>
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
    borderTopWidth: 2,
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
    marginBottom: 10,
    fontSize: 15
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
