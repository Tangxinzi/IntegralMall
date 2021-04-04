import React, { Component } from 'react';
import {
  Text,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import RenderHtml from "react-native-render-html";

class Html extends React.Component {
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
    headerStyle: {
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.navigation.state.params.data
    }
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <ScrollView>
          <RenderHtml html={ this.state.data } renderers={renderers} contentWidth={Dimensions.get('window').width} imagesMaxWidth={Dimensions.get('window').width} />
        </ScrollView>
      </>
    );
  }
}

const renderers = {
  img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
    var height = Dimensions.get('window').width * htmlAttribs.height / htmlAttribs.width
    return (
      <Image style={{ width: Dimensions.get('window').width, height }} source={{uri: htmlAttribs.src}} />
    )
  }
}

module.exports = Html;
