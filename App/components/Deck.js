import React, { Component } from 'react';
import {
	View,
	Animated,
	ScrollView,
	PanResponder,
	Dimensions,
	StyleSheet,
	UIManager,
	LayoutAnimation
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


export default class Deck extends Component {

	static defaultProps = {
		onSwipeRight: () => {},
		onSwipeLeft: () => {},
		renderNoMoreCards: () => {}
	}

	constructor(props){
		super(props)

		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (event, gesture) => {
				if (gesture.dx > SWIPE_THRESHOLD){
					this.forceSwipe('right')
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					this.forceSwipe('left')
				} else {
				    this.resetPosition();
				}

			},
		});

		this.state = { panResponder, position, index: 0 }

	}

	resetPosition = () => {
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 }
		}).start()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.props.data){
			this.setState({ index: 0 })
		}
	}

	componentWillUpdate() {
		/*
		Compatiblity for android (I remember that LayoutAnimation now works on Android as well, (v0.45) but still doing it)
		*/
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
		LayoutAnimation.spring();
	}

	forceSwipe = (direction) => {
		const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
		Animated.timing(this.state.position, {
			toValue: { x: x*1.5, y: 0 },
			duration: SWIPE_OUT_DURATION,
		}).start(() => this.onSwipeComplete(direction));
	}


	onSwipeComplete = (direction) => {
		const { onSwipeLeft, onSwipeRight, data } = this.props;
		const item = data[this.state.index]

		direction === 'right' ? onSwipeRight() : onSwipeLeft();
		this.state.position.setValue({ x: 0, y: 0 })
		this.setState({ index: this.state.index + 1 })
	}


	getCardStyle = () => {

		const { position } = this.state;
		const rotate = position.x.interpolate({
			inputRange: [-SCREEN_WIDTH * 2, SCREEN_WIDTH * 2],
			outputRange: ['-120deg', '120deg']
		})


		return {
			...position.getLayout(),
			transform: [{ rotate }],
			zIndex: 99,
		}
	}

	renderCards() {

		if (this.state.index >= this.props.data.length ) {
			return this.props.renderNoMoreCards()
		}

		return this.props.data.map((item, idx) => {

			if (idx < this.state.index){
				return null
			}

			if (idx === this.state.index){
				return (
					<Animated.View
					    key={item.id}
					    {...this.state.panResponder.panHandlers}
						style={[this.getCardStyle(), styles.cardStyle ]}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				)
			}
			return (
				<Animated.View
				 	key={item.id}
					style={[styles.cardStyle, {top: 4 *(idx - this.state.index) }]}>
				    {this.props.renderCard(item)}
				</Animated.View>
			)
		}).reverse()
	}

	render() {
		return (
			<View
			>
				{this.renderCards()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	cardStyle: {
		position: 'absolute',
		width: SCREEN_WIDTH,
	}
})
