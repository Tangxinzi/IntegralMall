import React, { Component } from 'react';
import iconStyle from '../../Styles/Icon'
import ViewSwiper from 'react-native-swiper';
import StickyHeader from 'react-native-stickyheader';
import LotteryDetails from './LotteryDetails';
import AnimatedTurnTableDraw from './AnimatedTurnTableDraw';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
  Animated,
  SectionList,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      data: [],
      business: [],
      icons: [
        {
          text: '每日签到',
          img: 'https://m.360buyimg.com/mobilecms/s80x80_jfs/t19510/99/1997173036/5986/e640aaee/5ae06136N2f38f602.png'
        },
        {
          text: '兑换商城',
          img: 'https://m.360buyimg.com/mobilecms/s80x80_jfs/t1/72208/35/9347/2600/5d70c50eE77b85cdb/7b6a9fec1067db06.png'
        },
        {
          text: '欢喜电影',
          img: 'https://m.360buyimg.com/mobilecms/s80x80_jfs/t17422/194/2017793180/12782/83f66fd3/5ae13830N1e98ef9c.png'
        },
        {
          text: '幸运转盘',
          route: 'AnimatedTurnTableDraw',
          img: 'https://m.360buyimg.com/mobilecms/s80x80_jfs/t17722/111/1521695125/7007/bc139a6f/5acdb918N430b92ab.png'
        },
        {
          text: '百币夺宝',
          img: 'https://m.360buyimg.com/mobilecms/s80x80_jfs/t19948/66/3191014/6800/7429b1fd/5ae0629dN6ea95c15.png'
        },
      ]
    };

    this.fetchData();
    this.fetchDataLottery();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.fetchData();
      this.fetchDataLottery();
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  fetchData() {
    fetch(`https://taupd.ferer.net/v1/api/catalog?data=pages&page_catalog_id=267`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        data: responseData.data
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  fetchDataLottery() {
    fetch(`https://taupd.ferer.net/v1/api/products?type=business`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        business: responseData.data
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  render() {
    if (this.state.data.length) {
      return (
        <ScrollView>
          <View style={styles.backgroundSwiper}></View>
          <View style={styles.swiperContainer}>
            <ViewSwiper
              autoplay
              autoplayTimeout={6}
              dot={<View style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', width: 20, height: 3}} />}
              activeDot={<View style={{backgroundColor: '#ffffff', width: 20, height: 3}} />}
              paginationStyle={{bottom: 10}}
            >
              {
                this.state.data.map((item, key) => {
                  return (
                    <TouchableHighlight
                      key={key}
                      style={styles.swiperTouch}
                      activeOpacity={0.9}
                    >
                      <Image resizeMode='cover' style={styles.swiperImage} source={{uri: item.page_main_img}} />
                    </TouchableHighlight>
                  )
                })
              }
            </ViewSwiper>
          </View>
          <View style={[iconStyle.iconContainer, {marginTop: 15, paddingTop: 10}]}>
            <View style={iconStyle.iconApps}>
              {
                this.state.icons.map((item, key) => {
                  return (
                    <TouchableHighlight
                      key={key}
                      style={iconStyle.iconTouch}
                      underlayColor="rgba(255, 255, 255, 0.85)"
                      activeOpacity={0.85}
                      onPress={() => {
                        this.props.navigation.navigate(item.route)
                      }}
                    >
                      <>
                        <Image resizeMode='cover' style={[iconStyle.icon, { marginLeft: 8, marginRight: 8 }]} source={{uri: item.img}} />
                        <Text allowFontScaling={false} style={iconStyle.iconText}>{item.text}</Text>
                      </>
                    </TouchableHighlight>
                  )
                })
              }
            </View>
          </View>
          <FlatList
            data={this.state.business}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={styles.columnStyle}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) =>
              <TouchableHighlight
                underlayColor='transparent'
                style={[styles.lotteryTouch, index % 2 ? styles.lotteryTouchmarginLeft10 : '']}
                onPress={() => {
                  this.props.navigation.navigate('LotteryDetails', { id: item.id, title: item.product_name })
                }}
                underlayColor="rgba(255, 255, 255, 0.85)"
                activeOpacity={0.9}
              >
                <>
                  <Image resizeMode='cover' style={styles.lotteryLottery_img} source={{uri: item.product_image}} />
                  <View style={styles.lotteryFoot}>
                    <Text allowFontScaling={false} style={styles.lotteryLottery_name} numberOfLines={2}>{item.product_name}</Text>
                    <Text allowFontScaling={false} style={styles.lotteryLottery_description} numberOfLines={1}>{item.product_business_description}</Text>
                    <View style={styles.lotteryFooter}>
                      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text allowFontScaling={false} style={styles.lotteryFinish_quantity}>{'¥' + (item.product_business_discount ? item.product_business_discount : item.product_business_price)}</Text>
                        <Text allowFontScaling={false} style={styles.lotteryFinish_price}>{item.product_business_discount ? '¥' + item.product_business_price : ''}</Text>
                      </View>
                      <View style={styles.lotteryBuy}>
                        <Text allowFontScaling={false} style={styles.lotteryBuyText}>＋</Text>
                      </View>
                    </View>
                  </View>
                </>
              </TouchableHighlight>
            }
          />
        </ScrollView>
      );
    }

    if (!this.state.data.length) {
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
  swiperContainer: {
    height: Dimensions.get('window').width / 2.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  swiperTouch: {
    borderRadius: 10,
  },
  swiperImage: {
    width: '100%',
    borderRadius: 10,
    height: Dimensions.get('window').width / 2.2
  },
  columnStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  lotteryTouch: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    width: (Dimensions.get('window').width - 30) / 2,
  },
  lotteryTouchmarginLeft10: {
    marginLeft: 10
  },
  lotteryLottery_img: {
    borderRadius: 10,
    backgroundColor: '#fbfbfb',
    width: (Dimensions.get('window').width - 30) / 2,
    height: (Dimensions.get('window').width - 30) / 2,
  },
  lotteryLottery_name: {
    fontSize: 17,
    marginBottom: 5
  },
  lotteryLottery_description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  lotteryFoot: {
    padding: 10
  },
  lotteryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotteryFinish_quantity: {
    fontSize: 19,
    color: '#ff1b4b',
    fontWeight: '600'
  },
  lotteryFinish_price: {
    marginLeft: 8,
    marginBottom: 1,
    fontSize: 14,
    color: '#a3a3a3',
    fontWeight: '400',
    textDecorationLine: 'line-through'
  },
  lotteryBuy: {
    // padding: 6,
    color: '#ff1b4b',
    borderRadius: 16,
    backgroundColor: '#ffe6eb',
  },
  lotteryBuyText: {
    width: 25,
    height: 25,
    lineHeight: 25,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#ff1b4b'
  },
  listContainer: {
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#FFF',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  listContainerDidWill: {
    backgroundColor: '#ffd600',
    borderRadius: 0,
    marginLeft: 0,
    width: Dimensions.get('window').width
  },
  listTouch: {
    margin: 10
  },
  listTouchActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#555',
    marginBottom: 5
  },
  listName: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center'
  },
  listNameActive: {
    fontWeight: '800'
  }
}

module.exports = Home;
