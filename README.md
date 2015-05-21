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
Returns the initial state of an instance of this component.

#### getDefaultProps() : object
Returns the default set of props for an instance of this component; note that the default props are shared amongst all instances.

#### propTypes : object
Used for validating props that are passed to this component.

#### displayName : String
This is just passed through to React as the component's displayName

#### componentWillMount({props, state}, setState) : void
Called before the component is mounted into the DOM, with the current props/state combo and the setState function.

#### componentDidMount({props, state})
Called after the component is mounted into the DOM, with the current props/state combo.

#### componentWillReceiveProps({props, state}, nextProps, setState)
The first argument is the current props/state, the second argument is the new props that the component will have, and the third argument is the setState function that can change this component's state if necessary. 

#### shouldComponentUpdate({props, state}, ({props, state}) : boolean  
The first argument is the current props/state, and the second arg is the next props/state.

#### componentWillUpdate({props, state}, ({props, state})
The first argument is the current props/state, and the second arg is the next props/state.

#### componentDidUpdate({props, state}, ({props, state})
The first argument is the current props/state, and the second arg is the previous props/state.

#### componentWillUnmount({props, state})
Called before the component is unmounted from the DOM.

## Event Handler API

When an event handler is passed to `handler` in the `render` method, it guarantees that the event handler will always be called with the following arguments:

#### eventHandler({props, state}, setState)
The first argument is the current props/state, the second argument is the setState function that can change this component's state if necessary.

## Is this a good idea?

I'm not really sure. There's a certain purity to it, for two reasons that I can see:

1. Components can't messily put attributes on the `this` object and expect them to be around later, which means that components have to be more rigorous about using props and state.
2. The API is clearer about when `setState` is allowed to be called and when it isn't.

Those seem better, but they seem like just marginal wins to me. 

One thing that I haven't fully groked is what this does to mixins. I think that in many cases mixins just become functions that you import. For example, imagine a component whose render only depends on props and state and therefore wants to implement a "pure" `shouldComponentUpdate` function:

```javascript
import component from "functional-react";
import {PureShouldComponentUpdate} from "should-component-update";

const render = ({props}) => {
	return <div>Hello, {props.name}!</div>;
} 

export default component({render, shouldComponentUpdate:PureShouldComponentUpdate});
```

You could also imagine composing library functions together into chains to implement a lifecycle method for your component. This seems to me a bit cleaner than the current mixin story, but I doubt I've considered all its contours.