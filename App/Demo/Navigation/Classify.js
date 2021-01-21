import React, { Component } from 'react';
import iconStyle from '../../Styles/Icon'
import ViewSwiper from 'react-native-swiper';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  SectionList,
  Platform,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      details: [],
      catalogs: {},
      id: 274
    };
    this.fetchDataList();
    this.fetchDataDetail(this.state.id);
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.fetchDataList();
      this.fetchDataDetail(this.state.id);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  fetchDataList() {
    // 买卖产品目录
    fetch(`https://taupd.ferer.net/v1/api/catalog?data=catalogs&catalog_group_id=272`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        list: responseData.data
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  fetchDataDetail(id) {
    fetch(`https://taupd.ferer.net/v1/api/catalog?data=products&product_type=business&product_business_catalog=${ id }`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        id,
        details: responseData.data,
        catalogs: responseData.data.catalogs
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  render() {
    if (this.state.list.length) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.list}
            style={styles.listContainer}
            horizontal={false}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) =>
              <TouchableHighlight
                style={[styles.listTouch, this.state.id === item.id ? styles.listTouchActive : '']}
                underlayColor="rgba(34, 26, 38, 0.5)"
                onPress={() => this.fetchDataDetail(item.id)}
              >
                <Text style={[styles.listName, this.state.id == item.id ? styles.listNameActive : '']}>{item.catalog_name}</Text>
              </TouchableHighlight>
            }
          />
          <ScrollView style={styles.detailContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{this.state.catalogs.catalog_detail}</Text>
            </View>
            <FlatList
              data={this.state.details.products}
              horizontal={false}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) =>
                <TouchableHighlight
                  style={[iconStyle.iconTouch3, styles.iconTouch3, iconStyle.iconTouchBottom20]}
                  onPress={() => {
                    this.props.navigation.navigate('LotteryDetails', { id: item.id, title: item.product_name })
                  }}
                  underlayColor="rgba(255, 255, 255, 0.85)"
                  activeOpacity={0.9}
                >
                  <>
                    <Image resizeMode='cover' style={[iconStyle.icon, styles.icon]} source={{uri: item.product_image}} />
                    <Text style={[iconStyle.iconText, styles.iconText]} allowFontScaling={false} numberOfLines={1}>{item.product_name}</Text>
                  </>
                </TouchableHighlight>
              }
            />
          </ScrollView>
        </View>
      );
    }

    if (!this.state.list.length) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            size="small"
          />
        </View>
      );
    }
  }
}

const styles = {
  container: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  listContainer: {
    width: Dimensions.get('window').width * 0.25,
    borderWidth: 0.5,
    borderColor: '#CCC'
  },
  listTouch: {
    margin: 10,
    borderRadius: 15,
  },
  listTouchActive: {
    backgroundColor: 'linear-gradient(to right, rgb(223, 20, 15), rgb(241, 83, 56))'
  },
  listName: {
    fontSize: 14,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#000',
    textAlign: 'center'
  },
  listNameActive: {
    color: '#FFF'
  },
  detailContainer: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').height,
    padding: 10
  },
  detailBannerUrl: {
    width: Dimensions.get('window').width * 0.75 - 20,
    height: 80,
    borderRadius: 10,
    margin: 10
  },
  iconTouch3: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: (Dimensions.get('window').width * 0.75 - 20) / 3
  },
  icon: {
    backgroundColor: '#FFF',
    width: (Dimensions.get('window').width * 0.75 - 20) / 3 - 30,
    height: (Dimensions.get('window').width * 0.75 - 20) / 3 - 30
  },
  iconText: {
    textAlign: 'center',
    width: (Dimensions.get('window').width * 0.75 - 20) / 3
  },
  headerText: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 10
  }
}

module.exports = User;
