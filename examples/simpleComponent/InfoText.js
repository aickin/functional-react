import React from "react";
import component from "../../index.js";


const render = ({props}) => {
	return <div>The button has been pushed {props.buttonPushes} time(s)</div>;
}

export default component({render});
