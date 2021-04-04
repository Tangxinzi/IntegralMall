import React, { Component } from 'react';
import iconStyle from '../../Styles/Icon'
import ViewSwiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from './assets/Icons';
import faker from 'faker';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
  SectionList,
  RefreshControl,
  AsyncStorage,
  DeviceEventEmitter,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      user: null,
      number: [
        {
          text: '金币'
        },
        {
          text: '积分'
        },
        {
          text: '收藏'
        },
        {
          text: '喜欢'
        },
        {
          text: '浏览'
        }
      ],
      order: {
        payment: [
          {
            text: '待付款',
            img: Icon.waitPayment,
            uri: 'https://taupd.ferer.net/mobile/user/order?status=1&sign='
          },
          {
            text: '待发货',
            img: Icon.sendGoods,
            uri: 'https://taupd.ferer.net/mobile/user/order?status2&sign='
          },
          {
            text: '待收货',
            img: Icon.deliveryGoods,
            uri: 'https://taupd.ferer.net/mobile/user/order?status=3&sign='
          },
          {
            text: '售后',
            img: Icon.service,
            uri: 'https://taupd.ferer.net/mobile/user/order?status=4&sign='
          }
        ],
        lottery: [
          {
            text: '积分记录',
            img: Icon.integral,
            uri: 'https://taupd.ferer.net/mobile/user/lottery/lists?sign='
          },
          {
            text: '抢购记录',
            img: Icon.purchase,
            uri: 'https://taupd.ferer.net/mobile/user/lottery/purchase?sign='
          },
          {
            text: '购中记录',
            img: Icon.winning,
            uri: 'https://taupd.ferer.net/mobile/user/lottery/winning?sign='
          },
          {
            text: '全部抢购',
            img: Icon.all,
            uri: 'https://taupd.ferer.net/mobile/user/lottery/all?sign='
          }
        ]
      },
      rows: [
        {
          type: 'navigate',
          text: '积分商城',
          color: '#FFF',
          style: { left: 1 },
          backgroundColor: '#894bfe',
          name: 'gift',
          uri: 'Integral'
        },
        {
          type: 'web',
          text: '我的地址',
          color: '#FFF',
          backgroundColor: '#4b98fe',
          name: 'location-sharp',
          uri: 'https://taupd.ferer.net/mobile/user/address'
        },
        {
          type: 'web',
          text: '我的收藏',
          color: '#FFF',
          backgroundColor: '#ffb000',
          name: 'star',
          uri: 'https://taupd.ferer.net/mobile/user/collections'
        },
        {
          type: 'web',
          text: '反馈联络',
          color: '#FFF',
          backgroundColor: '#20c160',
          name: 'chatbubbles',
          uri: 'https://taupd.ferer.net/mobile/user/feedback'
        },
        // {
        //   type: 'web',
        //   text: '分享下载',
        //   color: '#FFF',
        //   style: { top: -1 },
        //   backgroundColor: '#fe4b52',
        //   name: 'arrow-redo',
        //   uri: ''
        // },
        {
          type: 'web',
          text: '常见问题',
          color: '#FFF',
          style: { top: 0 },
          backgroundColor: '#2095c1',
          name: 'help-circle',
          size: 25,
          uri: 'https://taupd.ferer.net/mobile/pages/254'
        },
        {
          type: 'web',
          text: '用户协议',
          color: '#FFF',
          style: { top: 0 },
          backgroundColor: '#ff6b00',
          name: 'shield-checkmark',
          uri: 'https://taupd.ferer.net/mobile/pages/268'
        },
        {
          type: 'navigate',
          text: '设置',
          color: '#FFF',
          style: { top: 0 },
          backgroundColor: '#666666',
          name: 'settings-sharp',
          uri: 'Setting'
        },
        {}
      ],
    };

    this.fetchLoginfo()
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('Change', () => {
      this.fetchLoginfo()
    })

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.fetchLoginfo()
    })
  }

  componentWillUnmount() {
    this.listener.remove();
    this._navListener.remove();
  }

  fetchLoginfo() {
    AsyncStorage.getItem('user')
    .then((response) => {
      const parse = JSON.parse(response)
      if (parse.id) {
        this.setState({
          user: parse
        })
        console.log(parse);

        // fetch(`https://taupd.ferer.net/v1/api/user/auth?sign=` + parse.token, {
        //   method: 'GET',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //   }
        // })
        // .then(response => response.json())
        // .then(responseData => {
        //   if (responseData.user) {
        //     AsyncStorage.setItem('user', JSON.stringify(responseData.user));
        //     this.setState({
        //       user: responseData.user,
        //       // rows: responseData.rows
        //     })
        //   } else {
        //     // this.logout()
        //   }
        // })
        // .catch((error) => {
        //   this.logout()
        //   console.log('err: ', error)
        // })
        // .done()
      } else {
        this.logout()
      }
    })
    .catch((error) => {
      this.logout()
    })
    .done();
  }

  logout () {
    this.setState({
      user: null
    })
    AsyncStorage.removeItem('user');
  }

  render() {
    if (!this.state.user) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableHighlight
            underlayColor="rgba(255, 255, 255, 0.85)"
            activeOpacity={0.85}
            onPress={() => {
              this.props.navigation.navigate('Login')
            }}
          >
            <>
              <Text allowFontScaling={false}>登录</Text>
            </>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <View style={styles.backgroundSwiper}></View>
          <View style={styles.userContainer}>
            <TouchableHighlight
              style={styles.userAvatarTouch}
              underlayColor="none"
              onPress={() => {
                this.props.navigation.navigate('Web', { title: '编辑个人信息', uri: `https://taupd.ferer.net/mobile/user/profile/${ this.state.user.id }/edit?sign=` + this.state.user.token })
              }}
            >
              <Image resizeMode='cover' style={styles.userAvatar} source={{uri: this.state.user.avator || 'https://taupd.ferer.net/uploads/sources/2021/03/28/VCbIisXyGT9lgg97Ohcq4tiWACr766fy.png'}} />
            </TouchableHighlight>
            <View style={styles.userInfo}>
              <Text style={styles.userInfotext}>{this.state.user.user_nickname}</Text>
              <View style={styles.userInfoSub}>
                <Text style={styles.userInfoSubtext}>{this.state.user.user_phone}</Text>
                <Text style={styles.userInfoSubtext}>普通账号</Text>
              </View>
            </View>
          </View>
          <View style={iconStyle.iconContainer}>
            <View style={iconStyle.iconApps}>
              {
                this.state.number.map((item, key) => {
                  return (
                    <TouchableHighlight
                      key={key}
                      underlayColor="none"
                    >
                      <>
                        <Text style={iconStyle.number}>{key}</Text>
                        <Text style={iconStyle.numberText}>{item.text}</Text>
                      </>
                    </TouchableHighlight>
                  )
                })
              }
            </View>
          </View>
          <View style={iconStyle.iconContainer}>
            <View style={iconStyle.iconHeader}>
              <Text style={iconStyle.iconHeaderText}>支付订单</Text>
              <TouchableHighlight
                style={styles.textArrow}
                underlayColor="none"
                onPress={() => {
                  this.props.navigation.navigate('Web', { title: '订单状态', uri: 'https://taupd.ferer.net/mobile/user/order?status=0&sign=' + this.state.user.token })
                }}
              >
                <>
                  <Text style={iconStyle.iconHeaderTextMore}>查看全部</Text>
                  <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
                </>
              </TouchableHighlight>
            </View>
            <View style={iconStyle.iconApps}>
              {
                this.state.order.payment.map((item, key) => {
                  return (
                    <TouchableHighlight
                      key={key}
                      underlayColor="none"
                      onPress={() => {
                        this.props.navigation.navigate('Web', { title: '订单状态', uri: item.uri + this.state.user.token })
                      }}
                    >
                      <>
                        <View style={iconStyle.iconCon}>
                          <Image resizeMode='cover' style={iconStyle.icon} source={{uri: item.img}} />
                        </View>
                        <Text style={iconStyle.iconText}>{item.text}</Text>
                      </>
                    </TouchableHighlight>
                  )
                })
              }
            </View>
          </View>
          <View style={iconStyle.iconContainer}>
            <View style={iconStyle.iconHeader}>
              <Text style={iconStyle.iconHeaderText}>抢购订单</Text>
            </View>
            <View style={iconStyle.iconApps}>
              {
                this.state.order.lottery.map((item, key) => {
                  return (
                    <TouchableHighlight
                      key={key}
                      underlayColor="none"
                      onPress={() => {
                        this.props.navigation.navigate('Web', { title: item.text, uri: item.uri + this.state.user.token })
                      }}
                    >
                      <>
                        <View style={iconStyle.iconCon}>
                          <Image resizeMode='cover' style={iconStyle.icon} source={{uri: item.img}} />
                        </View>
                        <Text style={iconStyle.iconText}>{item.text}</Text>
                      </>
                    </TouchableHighlight>
                  )
                })
              }
            </View>
          </View>
          <View style={iconStyle.iconContainer}>
            <View style={iconStyle.iconHeader}>
              <Text style={iconStyle.iconHeaderText}>其他服务</Text>
            </View>
            <View style={iconStyle.iconApps}>
              {
                this.state.rows.map((item, key) => {
                  if (key >= 0 && key <= 3) {
                    return (
                      <TouchableHighlight
                        key={key}
                        underlayColor="none"
                        onPress={() => {
                          switch (item.type) {
                            case 'navigate':
                              this.props.navigation.navigate(item.uri)
                              break;
                            case 'web':
                              this.props.navigation.navigate('Web', { title: item.text, uri: item.uri + '?sign=' + this.state.user.token })
                              break;
                          }
                        }}
                      >
                        <>
                          <View style={[iconStyle.iconGround, {backgroundColor: item.backgroundColor}]}>
                            <Ionicons name={item.name} size={20} color={item.color} style={item.style} />
                          </View>
                          <Text style={iconStyle.iconText}>{item.text}</Text>
                        </>
                      </TouchableHighlight>
                    )
                  }
                })
              }
            </View>
            <View style={iconStyle.iconApps}>
              {
                this.state.rows.map((item, key) => {
                  if (key >= 4 && key <= 7) {
                    return (
                      <TouchableHighlight
                        key={key}
                        underlayColor="none"
                        onPress={() => {
                          switch (item.type) {
                            case 'navigate':
                              this.props.navigation.navigate(item.uri)
                              break;
                            case 'web':
                              this.props.navigation.navigate('Web', { title: item.text, uri: item.uri + '?sign=' + this.state.user.token })
                              break;
                          }
                        }}
                      >
                        <>
                          <View style={[iconStyle.iconGround, {backgroundColor: item.backgroundColor}]}>
                            <Ionicons name={item.name} size={20} color={item.color} style={item.style} />
                          </View>
                          <Text style={iconStyle.iconText}>{item.text}</Text>
                        </>
                      </TouchableHighlight>
                    )
                  }
                })
              }
            </View>
            <View style={[iconStyle.iconApps, {display: this.state.rows.length > 8 ? '' : 'none'}]}>
              {
                this.state.rows.map((item, key) => {
                  if (key >= 8 && key <= 11) {
                    return (
                      <TouchableHighlight
                        key={key}
                        underlayColor="none"
                        onPress={() => {
                          switch (item.type) {
                            case 'navigate':
                              this.props.navigation.navigate(item.uri)
                              break;
                            case 'web':
                              this.props.navigation.navigate('Web', { title: item.text, uri: item.uri + '?sign=' + this.state.user.token })
                              break;
                          }
                        }}
                      >
                        <>
                          <View style={[iconStyle.iconGround, {backgroundColor: item.backgroundColor}]}>
                            <Ionicons name={item.name} size={20} color={item.color} style={item.style} />
                          </View>
                          <Text style={iconStyle.iconText}>{item.text}</Text>
                        </>
                      </TouchableHighlight>
                    )
                  }
                })
              }
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = {
  container: {
    position: 'relative'
  },
  containerScrollView: {
    position: 'relative',
    flex: 1
  },
  backgroundSwiper: {
    position: 'absolute',
    backgroundColor: '#ffd600',
    top: -Dimensions.get('window').width * 1.45,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 1.8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginTop: 0
  },
  userAvatarTouch: {

  },
  userAvatar: {
    marginRight: 10,
    height: 60,
    width: 60,
    borderRadius: 60
  },
  userInfo: {
    height: 50,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  userInfotext: {
    // marginTop: 8,
    // marginBottom: 8,
    fontSize: 20,
    fontWeight: '600'
  },
  userInfoSub: {
    flexDirection: 'row'
  },
  userInfoSubtext: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: '400'
  },
  textArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}

module.exports = User;
