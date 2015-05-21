import React from "react";
import component from "../../index.js";
import InfoText from "./InfoText.js";

const getInitialState = () => ({buttonPushes: 0});

const incrementPushes = ({state}, setState) => {
	setState({buttonPushes: state.buttonPushes + 1});
}

const render = ({state}, handler) => {
	return (
		<div>
			<InfoText buttonPushes={state.buttonPushes}/>
			<button onClick={handler(incrementPushes)}>Push Me</button>
		</div>
	);
}

export default component({render, getInitialState});
