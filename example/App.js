/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    SectionList,
    Animated,
    ScrollView,
    RefreshControl,
} from 'react-native';


import StickyHeader from 'react-native-stickyheader';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            loadMore: false,
            list: [...new Array(20)].map((v, i) => i),
        };
    }

    renderItem = (item, index) => (
        <View
            key={index}
            style={{
                height: 50,
                backgroundColor: '#fff',
                borderBottomColor: '#ccc',
                borderBottomWidth: 0.3
            }}>
            <Text style={{ textAlign: 'center' }}>{index}</Text>
        </View>
    )

    onScroll = e => {
        if (this.state.loadMore) return;
        if (this.state.list.length > 200) {
            this.setState({ loadMore: false });
            return;
        }

        const data = e.nativeEvent;
        const y = data.contentOffset.y;
        const height = data.layoutMeasurement.height;
        const contentHeight = data.contentSize.height;

        // 滚动到底部，触发加载更多
        if (y + height >= contentHeight - 20) {
            this.setState({ loadMore: true });
            setTimeout(() => {
                this.setState({
                    loadMore: false,
                    list: [...this.state.list, ...this.state.list],
                });
            }, 1000 * 2);
        }
    }

    render() {
        const { scrollY, loadMore, list = [] } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ height: 64, backgroundColor: '#f6f6f6' }}></View>
                <Animated.ScrollView
                    scrollEventThrottle={1}
                    refreshControl={<RefreshControl refreshing={false} />}
                    onScroll={
                        Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true, listener: this.onScroll }
                        )
                    }>
                    <Text>文字</Text>
                    <Text>文字</Text>
                    <Text>文字</Text>
                    <Text>文字</Text>

                    <StickyHeader
                        stickyHeaderY={60} // 滑动到多少悬浮
                        stickyScrollY={scrollY}>
                        <View style={{ height: 60, backgroundColor: '#39f' }} />
                    </StickyHeader>

                    {list.map(this.renderItem)}

                    {loadMore &&
                        <View style={{ backgroundColor: '#39f', height: 50 }}>
                            <Text>加载更多</Text>
                        </View>
                    }

                </Animated.ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
});
