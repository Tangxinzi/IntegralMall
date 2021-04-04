import React, { Component, useRef } from 'react';
import iconStyle from '../../Styles/Icon'
import ViewSwiper from 'react-native-swiper';
import HTMLView from 'react-native-htmlview';
import RenderHtml from "react-native-render-html";
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-tiny-toast'
import { NavigationActions } from 'react-navigation'

import faker from 'faker';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Dimensions,
  FlatList,
  PixelRatio,
  SectionList,
  Platform,
  Navigator,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  useWindowDimensions
} from 'react-native';

// function renderNode(node, index) {
//   if (node.name == 'iframe') {
//     return (
//       <View key={index}>
//         <Text>{node.attribs.src}</Text>
//       </View>
//     );
//   }
// }

function isIphoneX() {
  let screenW = Dimensions.get('window').width;
  let screenH = Dimensions.get('window').height;
  // iPhoneX
  const X_WIDTH = 375;
  const X_HEIGHT = 812;

  return Platform.OS === 'ios' && ((screenH === X_HEIGHT && screenW === X_WIDTH) || (screenH === X_WIDTH && screenW === X_HEIGHT))
}

class LotteryDetails extends React.Component {
  static navigationOptions ({ navigation, screenProps }) {
    const { params } = navigation.state;

    return {
      headerTitle: (
        <Text allowFontScaling={false} numberOfLines={1} style={{
          fontSize: 17,
          fontWeight: '600',
          color: 'rgba(0, 0, 0, 1)',
          textAlign: 'center',
          marginHorizontal: 16
        }}>{ params.title }</Text>
      ),
      tabBarVisible: false,
      headerStyle: {
        elevation: 0,
      },
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      collection: null,
      details: null,
      user: [],
      image: {}
    }

    AsyncStorage.getItem('user')
    .then((response) => {
      this.setState({
        user: JSON.parse(response)
      })

      fetch(`https://taupd.ferer.net/v1/api/collections/${ this.state.id }?sign=${ this.state.user.token }`)
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
          this.setState({
            collection: responseData[0]['count']
          });
        })
        .catch((error) => {
          console.log('err: ', error)
        })
        .done();
    })
    .catch((error) => {
      console.log(error);
    })
    .done();

    this.fetchData(this.state.id);
  }

  fetchData(id) {
    fetch(`https://taupd.ferer.net/v1/api/products/${ id }?type=business`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        details: responseData.data
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done();
  }

  carts(id, product_number) {
    fetch(`https://taupd.ferer.net/v1/api/carts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submit: 'create',
        product_type: 'business',
        id,
        product_number,
        sign: this.state.user.token
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);
      Toast.showSuccess('商品添加成功')
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done()
  }

  orderAccount (id) {
    this.props.navigation.navigate('ConfirmOrder', { now: 1, product_id: id })
  }


  modal = React.createRef();

  openModal = () => {
    if (this.modal.current) {
      this.modal.current.open();
    }
  }

  closeModal = () => {
    if (this.modal.current) {
      this.modal.current.close();
    }
  }

  renderContent = () => {
    return (
      <View style={s.content}>
        <Text style={s.content__heading}>产品参数</Text>
        {
          this.state.details.product_field.parameters && this.state.details.product_field.parameters.map((item, key) => {
            return (
              <TouchableHighlight
                style={[styles.list, {paddingLeft: 0, paddingRight: 0, marginTop: 0.5, }]}
                underlayColor="rgba(255, 255, 255, 1)"
                activeOpacity={1}
              >
                <View style={styles.listRows}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.text}>{item.parameter_name}</Text>
                  <Text allowFontScaling={false} numberOfLines={1} style={[styles.textArrow, styles.textDesc]}>{item.parameter_value}</Text>
                </View>
              </TouchableHighlight>
            )
          })
        }

        <TouchableOpacity
          style={s.content__button}
          activeOpacity={0.9}
          onPress={this.closeModal}
        >
          <Text style={s.content__buttonText}>完成</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderHTMLView = () => {
    if (this.state.details.product_detail) {
      return (
        <ScrollView>
          <RenderHtml
            html={ this.state.details.product_detail }
            // renderers={renderers}
            // computeEmbeddedMaxWidth={(availableWidth) => {
            //   return Math.max(availableWidth, 50)
            // }}
            ptSize='5pt'
            contentWidth={Dimensions.get('window').width}
            imagesMaxWidth={Dimensions.get('window').width}
          />
        </ScrollView>
      );
    } else {
      return (<></>);
    }
  }

  render() {
    if (this.state.details) {
      return (
        <>
          <ScrollView style={styles.container}>
            <View style={styles.swiperContainer}>
              <ViewSwiper
                autoplay
                autoplayTimeout={6}
                dot={<View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', width: 20, height: 3}} />}
                activeDot={<View style={{backgroundColor: 'rgba(0, 0, 0, 1)', width: 20, height: 3}} />}
                paginationStyle={{bottom: 10}}
              >
                {
                  this.state.details.product_image_gallerys.map((item, key) => {
                    return (
                      <TouchableHighlight
                        key={key}
                        style={styles.swiperTouch}
                        underlayColor="rgba(34, 26, 38, 0.5)"
                      >
                        <Image resizeMode='cover' style={styles.swiperImage} source={{uri: item}} />
                      </TouchableHighlight>
                    )
                  })
                }
              </ViewSwiper>
            </View>
            <View style={styles.productHeaderContainer}>
              <View style={[styles.productHeader, {paddingBottom: 0, paddingRight: 15, marginTop: 1, alignItems: 'flex-end'}]}>
                {
                  this.state.details.product_business_discount ?
                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text allowFontScaling={false} style={styles.productHeaderDiscount} numberOfLines={1}>¥{this.state.details.product_business_discount}</Text>
                      <Text allowFontScaling={false} style={styles.productHeaderPrice} numberOfLines={1}>¥{this.state.details.product_business_price}</Text>
                    </View>
                  :
                    <Text allowFontScaling={false} style={styles.productHeaderDiscount} numberOfLines={1}>¥{this.state.details.product_business_price}</Text>
                }
                {
                  this.state.details.product_business_quantity ? (
                    <Text allowFontScaling={false} style={styles.productHeaderQuantity} numberOfLines={1}>限购{this.state.details.product_business_quantity}份</Text>
                  ) : (<></>)
                }
              </View>
              <View style={styles.productHeader}>
                <View style={styles.productHeaderTitle}>
                  <Text allowFontScaling={false} style={styles.productHeaderName} numberOfLines={2}>{this.state.details.product_name}</Text>
                  <Text allowFontScaling={false} style={styles.productHeaderDescription} numberOfLines={1}>{this.state.details.product_business_description}</Text>
                </View>
                <View style={styles.productHeaderShare}>
                  <Text allowFontScaling={false} style={{fontSize: 12, marginRight: 5}} numberOfLines={2}>分享</Text>
                  <Ionicons name={'arrow-redo'} size={14} />
                </View>
              </View>
              {
                this.state.details.pages.length && this.state.details.pages.map((item, key) => {
                  return (
                    <TouchableHighlight
                      style={[styles.list, {marginTop: 1}]}
                      underlayColor="rgba(255, 255, 255, 0.85)"
                      activeOpacity={0.85}
                      onPress={() => {
                        this.props.navigation.navigate('Web', { title: item.title, uri: 'https://taupd.ferer.net/mobile/pages/' + item.id })
                      }}
                    >
                      <View style={styles.listRows}>
                        <Text allowFontScaling={false} style={styles.text}>{item.title}</Text>
                        <View style={styles.textArrow}>
                          <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
                        </View>
                      </View>
                    </TouchableHighlight>
                  )
                })
              }
            </View>
            <View style={styles.productHeaderContainer}>
              <View style={styles.decorationLine}>
                <Text allowFontScaling={false} style={styles.decorationLineText} numberOfLines={1}>———  </Text>
                <Text allowFontScaling={false} style={styles.decorationLineText} numberOfLines={1}>详细资料</Text>
                <Text allowFontScaling={false} style={styles.decorationLineText} numberOfLines={1}>  ———</Text>
              </View>
              <TouchableHighlight
                style={[styles.productHeader, {marginTop: 10, paddingRight: 15}]}
                underlayColor="rgba(255, 255, 255, 0.85)"
                activeOpacity={0.85}
                onPress={this.openModal}
              >
                <>
                  <Text allowFontScaling={false} style={styles.text} numberOfLines={2}>产品参数</Text>
                  <View style={styles.textArrow}>
                    <Text allowFontScaling={false} style={styles.textDesc} numberOfLines={1}></Text>
                    <Ionicons name={'chevron-forward-outline'} size={20} color='#AAA' />
                  </View>
                </>
              </TouchableHighlight>
              <View>
                {this.renderHTMLView()}
              </View>
            </View>
          </ScrollView>
          <View style={[bottomStyle.bottomButtons, {display: !this.state.user ? 'none' : null}]}>
            <View style={[bottomStyle.button, {flex: 1, justifyContent: 'space-around' }]}>
              <MaterialIcons name={'storefront'} size={27} underlayColor="rgba(255, 255, 255, 0.85)" activeOpacity={0.85} onPress={() => {
                this.props.navigation.navigate('Home')
              }} />
              <Ionicons name={'cart-outline'} size={27} underlayColor="rgba(255, 255, 255, 0.85)" activeOpacity={0.85} onPress={() => {
                this.props.navigation.navigate('Cart')
              }} />
              <MaterialIcons name={this.state.collection ? 'star' : 'star-border'} color={this.state.collection ? '#ffb000' : '#000'} size={27} onPress={() => {
                console.log(`https://taupd.ferer.net/v1/api/collections/${ this.state.id }?type=products&state=${ this.state.collection ? 0 : 1 }&sign=${ this.state.user.token }`);
                fetch(`https://taupd.ferer.net/v1/api/collections/${ this.state.id }?type=products&state=${ this.state.collection ? 0 : 1 }&sign=${ this.state.user.token }`)
                  .then(response => response.json())
                  .then(responseData => {
                    console.log(responseData);
                    this.setState({
                      collection: responseData
                    })
                    if (responseData) {
                      Toast.show('商品收藏成功')
                    } else {
                      Toast.show('商品取消收藏')
                    }
                  })
                  .catch((error) => {
                    console.log('err: ', error)
                  })
                  .done();
              }} />
            </View>
            <View style={bottomStyle.button}>
              <TouchableHighlight
                style={{width: 110, padding: 13, backgroundColor: '#f97433'}}
                underlayColor="none"
                onPress={() => {
                  this.carts(this.state.id, 1)
                }}
              >
                <Text allowFontScaling={false} style={{textAlign: 'center', color: '#FFF'}}>加入购物车</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{width: 110, padding: 13, backgroundColor: '#f93333'}}
                underlayColor="none"
                onPress={() => {
                  this.orderAccount(this.state.id)
                }}
              >
                <Text allowFontScaling={false} style={{textAlign: 'center', color: '#FFF'}}>立即购买</Text>
              </TouchableHighlight>
            </View>
          </View>
          <Modalize ref={this.modal} adjustToContentHeight handlePosition="inside">
            {this.renderContent()}
          </Modalize>
        </>
      );
    }

    if (!this.state.details) {
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

const renderers = {
  img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
    var image = {
      width: PixelRatio.getPixelSizeForLayoutSize(htmlAttribs.width),
      height: PixelRatio.getPixelSizeForLayoutSize(htmlAttribs.height),
    }
    console.log(htmlAttribs.width, htmlAttribs.height);
    console.log(image)
    console.log(1/PixelRatio.get())

    var height = Dimensions.get('window').width * htmlAttribs.height / htmlAttribs.width
    return (
      <Image style={{ width: Dimensions.get('window').width, height }} source={{uri: htmlAttribs.src}} />
      // <Image style={{ width: htmlAttribs.width, height: htmlAttribs.height }} source={{uri: htmlAttribs.src}} />
    )
  }
}

const styles = {
  container: {
    position: 'relative',
  },
  swiperContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    backgroundColor: '#FFF'
  },
  swiperImage: {
    width: '100%',
    height: Dimensions.get('window').width
  },
  productHeader: {
    padding: 15,
    paddingRight: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productHeaderTitle: {
    width: '78%'
  },
  productHeaderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productHeaderDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginTop: 5
  },
  productHeaderShare: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D5D5D5',
    padding: 5,
    paddingLeft: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  productHeaderPrice: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 24,
    color: '#a3a3a3',
    fontWeight: '400',
    textDecorationLine: 'line-through'
  },
  productHeaderQuantity: {
    marginLeft: 8,
    lineHeight: 24,
    color: '#a3a3a3',
    fontWeight: '400',
    letterSpacing: 0.5
  },
  productHeaderDiscount: {
    fontSize: 24,
    lineHeight: 24,
    color: '#ff6300',
    fontWeight: '600'
  },
  decorationLine: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  decorationLineText: {
    color: '#BBB'
  },
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

const bottomStyle = {
  bottomButtons: {
    zIndex: 1,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(143, 143, 143, 0.33)',
    bottom: 0,
    left: 0,
    padding: 0,
    paddingBottom: isIphoneX() ? 20 : 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#CCC'
  }
}

const s = {
  content: {
    padding: 20,
  },

  content__icon: {
    width: 32,
    height: 32,

    marginBottom: 20,
  },

  content__subheading: {
    marginBottom: 2,

    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },

  content__heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20
  },

  content__description: {
    paddingTop: 10,
    paddingBottom: 10,

    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 20,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },

  content__button: {
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 15,
  },

  content__buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
};

module.exports = LotteryDetails;
