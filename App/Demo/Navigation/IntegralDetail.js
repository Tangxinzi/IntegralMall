import React, { Component } from 'react';
import {
  Text,
  Alert,
  StatusBar,
  TouchableHighlight
} from 'react-native';
import WebView from 'react-native-webview'

class IntegralDetail extends React.Component {
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
  });

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <WebView
          startInLoadingState={true}
          automaticallyAdjustContentInsets={true}
          source={{uri: this.props.navigation.state.params.uri ? this.props.navigation.state.params.uri : ''}}
        />
      </>
    );
  }
}

module.exports = IntegralDetail;
