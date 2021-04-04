import React, { Component } from 'react';
import {
  Text,
  Alert,
  StatusBar,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import WebView from 'react-native-webview'

class IntegralDetail extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} numberOfLines={1} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>{navigation.state.params.title}</Text>
    ),
    headerRight: (
      <>
      {
        navigation.state.params.save != null ? (
          <TouchableHighlight
            style={{padding: 10}}
            onPress={() => {

            }}
          >
            <Text allowFontScaling={false}>保存</Text>
          </TouchableHighlight>
        ) : null
      }
      </>
    ),
    headerStyle: {
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    AsyncStorage.getItem('user')
    .then((response) => {
      this.setState({
        user: JSON.parse(response)
      })
    })
    .catch((error) => {
      this.setState({
        user: null
      })
    })
    .done();
  }

  onMessage = (e) => {
    let params = e.nativeEvent.data;
    params = JSON.parse(params);
    // console.log("WebView onMessage ", params);
    switch (params.dataset.type) {
      case 'native':
        this.props.navigation.push('IntegralDetail', { title: params.dataset.title, uri: params.dataset.data + '?sign=' + this.state.user.token })
        break;
      case 'html':
        this.props.navigation.push('Html', { title: params.dataset.title, data: params.dataset.data })
        break;
      default:

    }
  };

  onLoadEnd = (e) => {
    console.log("WebView onLoadEnd e：", e.nativeEvent);
    let data = {
      source: "from rn",
    };
    this.web && this.web.postMessage(JSON.stringify(data)); //发送消息到H5
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <WebView
          ref={(webview) => {
            this.web = webview
          }}
          startInLoadingState={true}
          onLoadEnd={this.onLoadEnd}
          automaticallyAdjustContentInsets={true}
          onMessage={this.onMessage}
          javaScriptEnabled={true}
          source={{uri: this.props.navigation.state.params.uri ? this.props.navigation.state.params.uri : ''}}
        />
      </>
    );
  }
}

module.exports = IntegralDetail;
