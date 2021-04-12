import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet'
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

class Setting extends React.Component {
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
          }}>设置</Text>
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

    this.state = {};

    AsyncStorage.getItem('user')
    .then((response) => {
      const parse = JSON.parse(response)
      if (parse.id) {
        this.setState({
          user: parse
        })
      }
    })
    .catch((error) => {

    })
    .done();
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change');
  }

  logout () {
    AsyncStorage.removeItem('user');
    this.props.navigation.goBack();
    // this.props.navigation.state.params.refresh();
  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  render() {
    return (
      <ScrollView>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'确定退出登录吗？'}
          options={['退出登录', '取消']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={(index) => {
            switch (index) {
              case 0:
                this.logout()
                break;
            }
          }}
        />
        <TouchableHighlight
          style={[styles.list, {marginTop: 1}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
          onPress={() => {
            this.props.navigation.navigate('Web', { title: '修改密码', uri: `https://taupd.ferer.net/mobile/user/profile/password?sign=${ this.state.user.token }` })
          }}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>修改密码</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.list, {marginTop: 1}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
          onPress={() => {
            this.props.navigation.navigate('Web', { title: '更换手机号', uri: `https://taupd.ferer.net/mobile/user/profile/phone?sign=${ this.state.user.token }` })
          }}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>更换手机号</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.list, {marginTop: 1, marginBottom: 10}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>彻底注销账号</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.list, {marginTop: 1}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
          onPress={() => {
            this.props.navigation.navigate('Web', { title: '分享下载', uri: `https://taupd.ferer.net/mobile/pages/271` })
          }}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>分享下载</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.list, {marginTop: 1, marginBottom: 10}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
          onPress={() => {
            this.props.navigation.navigate('Web', { title: '关于商城', uri: `https://taupd.ferer.net/mobile/pages/272` })
          }}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>关于商城</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.list, {marginTop: 1}]}
          underlayColor="rgba(255, 255, 255, 0.85)"
          activeOpacity={0.85}
          onPress={this.showActionSheet}
        >
          <View style={styles.listRows}>
            <Text allowFontScaling={false} style={styles.text}>退出当前账号</Text>
            <View style={styles.textArrow}>
              <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
            </View>
          </View>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const styles = {
  lists: {
    marginTop: 10
  },
  listRows: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    position: 'relative',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(204, 204, 204, 0.25)',
    // marginBottom: -1,
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 14,
    overflow: 'hidden'
  },
  textArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textDesc: {
    fontSize: 14,
    color: '#aaa',
    marginRight: 0,
    textAlign: 'right'
  }
}

export default Setting;
