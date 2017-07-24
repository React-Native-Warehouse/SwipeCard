import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	PanResponder,
} from 'react-native';



export default class Ball extends Component {

	constructor(props){
		super(props)
		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				position.setValue({ x: gesture.dx, y: gesture.dy })
			},
			onPanResponderRelease: () => {}
		})

		this.state = { panResponder, position }
	}

	AnimateBall = () => {
		Animated.spring(this.position, {
			toValue: { x: 200, y: 500 }
		}).start()
	}

	render(){
		return (
			<Animated.View
				{...this.state.panResponder.panHandlers}
				style={[this.state.position.getLayout(), styles.BallStyle]}
			>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({

	BallStyle: {
		width: 30,
		borderRadius: 30,
		borderWidth: 30,
		borderColor: 'black',
	}

})
