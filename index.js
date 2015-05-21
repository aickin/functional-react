
import React from "react";

export default function({
		render, 
		getInitialState, 
		getDefaultProps, 
		propTypes, 
		displayName, 
		componentWillMount,
		componentDidMount,
		componentWillReceiveProps,
		shouldComponentUpdate,
		componentWillUpdate,
		componentDidUpdate,
		componentWillUnmount,
	}) {

	let componentSpec = {};

	if (render) {
		componentSpec.render = function() {
			// this method will bind handlers to the correct this pointer;
			// could be problematic because this'll be called on every render.
			const handler = (impl) => {
				return (e) => {
					impl({props: this.props, state: this.state}, this.setState.bind(this));
				}
			}
			return render({props: this.props, state: this.state}, handler);
		}
	}

	if (getInitialState) {
		componentSpec.getInitialState = function() {
			return getInitialState();
		}
	}

	if (getDefaultProps) {
		componentSpec.getDefaultProps = function() {
			return getDefaultProps();
		}
	}

	if (propTypes) {
		componentSpec.propTypes = propTypes;
	}

	if (displayName) {
		componentSpec.displayName = displayName;
	}

	if (componentWillMount) {
		componentSpec.componentWillMount = function() {
			componentWillMount({props: this.props, state: this.state}, this.setState.bind(this));
		}
	}

	if (componentDidMount) {
		componentSpec.componentDidMount = function () {
			componentDidMount({props: this.props, state: this.state});
		}
	}

	if (componentWillReceiveProps) {
		componentSpec.componentWillReceiveProps = function(nextProps) {
			componentWillReceiveProps({props: this.props, state: this.state}, nextProps, this.setState.bind(this));
		}
	}

	if (shouldComponentUpdate) {
		componentSpec.shouldComponentUpdate = function(nextProps, nextState) {
			return shouldComponentUpdate({props: this.props, state: this.state}, {props: nextProps, state:nextState});
		}
	}

	if (componentWillUpdate) {
		componentSpec.componentWillUpdate = function(nextProps, nextState) {
			componentWillUpdate({props: this.props, state: this.state}, {props: nextProps, state:nextState});
		}
	}

	if (componentDidUpdate) {
		componentSpec.componentDidUpdate = function(prevProps, prevState) {
			componentDidUpdate({props: this.props, state: this.state}, {props: prevProps, state:prevState});
		}
	}

	if (componentWillUnmount) {
		componentSpec.componentWillUnmount = function() {
			componentWillUnmount({props: this.props, state: this.state});
		}
	}

	return React.createClass(componentSpec);
};
