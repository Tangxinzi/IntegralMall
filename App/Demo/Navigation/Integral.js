import React, { Component, useRef } from 'react';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import faker from 'faker';
import {
  Text,
  View,
  Image,
  Alert,
  StatusBar,
  ScrollView,
  TextInput,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

class Integral extends React.PureComponent {
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
          }}>积分商城</Text>
        </>
      </TouchableHighlight>
    ),
    headerRight: (
      <TouchableHighlight
        style={{right: 10}}
        underlayColor='transparent'
        onPress={() => {
          AsyncStorage.getItem('user')
          .then((response) => {
            const parse = JSON.parse(response)
            navigation.navigate('Web', { title: '积分记录', uri: `https://taupd.ferer.net/mobile/user/lottery/lists?sign=` + parse.token })
          })
          .catch((error) => {
            console.log(error);
          })
          .done();
        }}
      >
        <Ionicons
          name={'time-outline'}
          size={26}
        />
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerTitleStyle: {color: '#000000'},
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: true,
      date: null,
      user: null,
      lottery: []
    };

    AsyncStorage.getItem('user')
    .then((response) => {
      this.setState({
        user: JSON.parse(response)
      })
      this.fetch()
    })
    .catch((error) => {
      this.setState({
        user: null
      })
    })
    .done();
  }

  onRefresh() {
    // setTimeout(() => {
    //   this.setState({
    //     isRefreshing: true
    //   })
    // }, 1000)

    setTimeout(() => {
      this.fetch()
    }, 1000)
  }

  fetch() {
    fetch(`https://taupd.ferer.net/v1/api/user/auth/${ this.state.user.id }?sign=${ this.state.user.token }`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        date: responseData
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done()

    fetch(`https://taupd.ferer.net/v1/api/products?type=lottery`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        lottery: responseData.data,
        isRefreshing: false
      });
    })
    .catch((error) => {
      console.log('err: ', error)
    })
    .done()
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
        <Text style={s.content__heading}>获取积分</Text>
        <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>
        <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>
        <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>

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

  render() {
    if (this.state.isRefreshing) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            size="small"
          />
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.header}>
            {
              this.state.date && this.state.date.map((item, key) => {
                if (item.type == 'integral') {
                  return (
                    <Text style={styles.headerSum}>{ item.num }</Text>
                  )
                }
              })
            }
            <TouchableHighlight
              style={styles.flexBetween}
              underlayColor="none"
              onPress={() => {
                // this.openModal()
                this.props.navigation.navigate('Web', { title: '商城积分', uri: `https://taupd.ferer.net/mobile/user/integral?sign=` + this.state.user.token })
              }}
            >
              <View style={styles.flexBetween}>
                <Text style={styles.headerText}>获取积分</Text>
                <Ionicons name={'chevron-forward-outline'} style={{top: 5.8, left: -1}} size={16} color='#666' />
              </View>
            </TouchableHighlight>
          </View>
          <Modalize handlePosition="inside" withHandle={true} ref={this.modal} adjustToContentHeight scrollViewProps={{
              showsVerticalScrollIndicator: false,
              // stickyHeaderIndices: [0],
            }} style={{backgroundColor: '#FFF'}}>
            {this.renderContent()}
          </Modalize>
          <ScrollView
            withHandle={false}
            automaticallyAdjustContentInsets={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
                tintColor="#000"
                title="下拉刷新"
              />
            }
          >
            {
              this.state.lottery.map((item, key) => {
                return (
                  <TouchableHighlight
                    keys={key}
                    underlayColor='transparent'
                    style={styles.cartbox}
                    onPress={() => {
                      this.props.navigation.navigate('IntegralDetail', { title: item.product_name, uri: 'https://taupd.ferer.net/mobile/user/lottery/detail/' + item.id + '?sign=' + this.state.user.token })
                    }}
                    underlayColor="rgba(255, 255, 255, 0.85)"
                    activeOpacity={0.9}
                  >
                    <>
                      <View style={styles.cartboxImageCon}>
                        <View style={styles.multiple}>
                          <Text allowFontScaling={false} style={{fontSize: 8.35, color: '#FFF'}}>{item.product_lottery_number}</Text>
                        </View>
                        <Image resizeMode='cover' style={styles.cartboxImage} source={{uri: item.product_image}} />
                      </View>
                      <View style={styles.cartboxCon}>
                        <View style={styles.cartboxConHead}>
                          <Text allowFontScaling={false} style={styles.cartboxConTitle} numberOfLines={2}>{item.product_name} {item.id}</Text>
                          <Text allowFontScaling={false} style={styles.conDetailMeta} numberOfLines={1}></Text>
                        </View>
                        <>
                          <View style={styles.cartboxConFoot}>
                            <Text allowFontScaling={false} style={styles.conDetailMeta} numberOfLines={1}>总需人次 {item.product_lottery_count}</Text>
                            <Text allowFontScaling={false} style={styles.conDetailMeta} numberOfLines={1}>当前进度 {item.progress || 0}</Text>
                          </View>
                          <View style={[styles.cartboxConFoot, {marginTop: 4}]}>
                            <View style={styles.progress}></View>
                            <View style={[styles.progressActive, {width: item.progress}]}></View>
                          </View>
                        </>
                      </View>
                    </>
                  </TouchableHighlight>
                )
              })
            }
          </ScrollView>
        </>
      );
    }
  }
}

const styles = {
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    width: '100%'
  },
  flexBetween: {
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  // header
  header: {
    paddingTop: 30,
    paddingBottom: 35,
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  headerSum: {
    fontSize: 30,
    fontWeight: '600'
  },
  headerText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '400'
  },
  // address
  address: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginBottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    overflow: 'hidden'
  },
  // cartbox
  cartbox: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    overflow: 'hidden'
  },
  cartboxImageCon: {
    // elevation: 0.1,
    // shadowColor: 'rgba(0, 0, 0, 0.1)',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cartboxImage: {
    width: 85,
    height: 85,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'rgba(204, 204, 204, 0.3)',
  },
  cartboxCon: {
    flex: 1,
    height: 85,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cartboxConHead: {
    flex: 1
  },
  cartboxConTitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  conDetailMeta: {
    fontSize: 12,
    marginTop: 5,
    color: '#666'
  },
  cartboxConPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red'
  },
  cartboxConFoot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  // progress
  progress: {
    height: 5,
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'rgba(85, 116, 249, 0.3)'
  },
  progressActive: {
    height: 5,
    width: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 5,
    backgroundColor: 'rgb(107, 135, 255)'
  },
  multiple: {
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    zIndex: 1,
    width: 23,
    height: 23,
    backgroundColor: 'rgba(100, 53, 201, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderTopLeftRadius: 1
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
    marginBottom: 10
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

module.exports = Integral;
