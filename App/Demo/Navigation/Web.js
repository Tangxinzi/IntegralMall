import React, { Component } from 'react';
import {
  Text,
  Alert,
  StatusBar,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import WebView from 'react-native-webview'

class Web extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <Text allowFontScaling={false} style={{
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        textAlign: 'center',
        marginHorizontal: 16
      }}>{navigation.state.params.title}</Text>
    ),
    headerStyle: {
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    // CameraRoll.saveToCameraRoll(this.props.navigation.state.params.save)
    //   .then(function(result) {
    //     this.refs.toast.show("图片已保存至相册")
    //   }).catch(function(error) {
    //     this.refs.toast.show("保存失败")
    //   })

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
    console.log("WebView onMessage ", params);
    switch (params.dataset.type) {
      case 'native':
        this.props.navigation.push(params.dataset.navigation, { title: params.dataset.title, uri: params.dataset.data + '?sign=' + this.state.user.token })
        break;
      case 'navigate':
        this.props.navigation.push(params.dataset.navigation, {id: params.dataset.id, title: params.dataset.title})
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

module.exports = Web;
