# functional-react
An experiment in making a functional API for React components

This is an experimental library to see what it would be like to code React components in a completely functional way, inspired by [Deku](https://github.com/dekujs/deku).

To define a React component in functional-react, you define your render and lifecycle methods as pure functions (without using a this pointer) and then pass them to functional-react, which returns a React component. In the simplest case, a component that reads out a single string looks like this:

```javascript
import component from "functional-react";

const render = ({props}) => {
	return <div>Hello, {props.name}!</div>;
} 

export default component({render});
```

Lifecycle methods can be used, too:

```javascript
import component from "functional-react";

const shouldComponentUpdate = ({props}, {props: nextProps}) => {
	return props !== nextProps;
}

const render = ({props}) => {
	return <div>Hello, {props.name}!</div>;
} 

export default component({render, shouldComponentUpdate});
```

One wrinkle occurs when you want to render a component with an event handler, as binding the event handler is problematic. For this, there is a second argument passed to `render` which should wrap all event handlers; it makes sure that the event handlers receive the correct props, state, and setState.

```javascript
import component from "functional-react";

const alertMyName = ({props}, setState) => {
	alert(`Hey there, ${props.name}!`);
}

const render = ({props}, handler) => {
	// note that we wrap alertMyName so that it gets bound to the correct data.
	return <div onClick={handler(alertMyName)}>Hello, {props.name}!</div>;
} 

export default component({render});
```

## Component API

The Component API maps very directly onto the React component API. All of the "instance" methods are passed in the current props and state as the first argument, so they use that rather than using `this.props` or `this.state`. In methods where it is appropriate to call `this.setState`, that method is passed in as well.

#### render({props, state}, handler) : ReactElement
The first argument is the current props/state, which should be all that the component needs to render. Note that the second argument is a function that will wrap an event handler function and return a handler that is always bound correctly to the current state. See the Event API below for event handler signatures.

#### getInitialState() : object

#### getDefaultProps() : object

#### propTypes : object

#### displayName : String
This is just passed through to React as the component's displayName

#### componentWillMount({props, state}, setState) : void

#### componentDidMount({props, state})


#### componentWillReceiveProps({props, state}, nextProps, setState)
The first argument is the current props/state, the second argument is the new props that the component will have, and the third argument is the setState function that can change this component's state if necessary. 

#### shouldComponentUpdate({props, state}, ({props, state}) : boolean  
The first argument is the current props/state, and the second arg is the next props/state.

#### componentWillUpdate({props, state}, ({props, state})
The first argument is the current props/state, and the second arg is the next props/state.

#### componentDidUpdate({props, state}, ({props, state})
The first argument is the current props/state, and the second arg is the previous props/state.

#### componentWillUnmount({props, state})

## Event Handler API

When an event handler is passed to `handler` in the `render` method, it guarantees that the event handler will always be called with the following arguments:

#### eventHandler({props, state}, setState)
The first argument is the current props/state, the second argument is the setState function that can change this component's state if necessary.

