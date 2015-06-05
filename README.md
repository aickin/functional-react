# functional-react
An experiment in making a functional API for React components

This is an experimental library to see what it would be like to code React components in a completely functional way, inspired by [Deku](https://github.com/dekujs/deku).

To define a React component in functional-react, you define your render and lifecycle methods as pure functions (without using a `this` pointer) and then pass them to functional-react, which returns a React component. In the simplest case, a component that reads out a single string looks like this:

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
	// if the name hasn't changed, there's no reason to update.
	return props.name !== nextProps.name;
}

const render = ({props}) => {
	return <div>Hello, {props.name}!</div>;
} 

export default component({render, shouldComponentUpdate});
```

One wrinkle occurs when you want to render a component with an event handler, as binding the event handler is problematic; there is no `this` pointer to bind to at render time. For this, there is a second argument passed to `render` which should wrap all event handlers; it makes sure that the event handlers receive the correct props, state, and setState.

```javascript
import component from "functional-react";

const alertMyName = ({props}, setState) => {
	alert(`Hey there, ${props.name}!`);
}

const render = ({props}, handler) => {
	// note that we wrap alertMyName so that it gets bound to the correct 
	// component props & state.
	return <div onClick={handler(alertMyName)}>Hello, {props.name}!</div>;
} 

export default component({render});
```

## Component API

The Component API maps very directly onto the React component API. All of the existing React "instance" methods are passed in a simple object with the current props and state as the first argument, so they use that rather than using `this.props` or `this.state`. In methods where it would be appropriate to call `this.setState()`, that method is passed in as well.

When `setState` is passed in, it is a function with the same signature and behavior as React's `setState`.

#### render({props, state}, handler) : ReactElement
The first argument is the current props & state, which should be all that the component needs to render. Note that the second argument is a function that will wrap an event handler function and return a handler that is always bound correctly to the correct component props & state. See the Event API below for event handler signatures.

#### getInitialState() : object
Returns the initial state of an instance of this component. This method is *not* passed props & state, as the component has not yet been created.

#### getDefaultProps() : object
Returns the default set of props for an instance of this component; note that the default props are shared amongst all instances.

#### propTypes : object
Used for validating props that are passed to this component.

#### displayName : String
This is just passed through to React as the component's `displayName`.

#### componentWillMount({props, state}, setState) : void
Called before the component is mounted into the DOM, with the current props & state combo and the `setState` function.

#### componentDidMount({props, state})
Called after the component is mounted into the DOM, with the current props & state combo. Note that `setState` is not passed in, as it would not do anything meaningful to the component post-mounting.

#### componentWillReceiveProps({props, state}, nextProps, setState)
The first argument is the current props & state, the second argument is the new props that the component will have, and the third argument is the `setState` function that can change this component's state if necessary. 

#### shouldComponentUpdate({props, state}, ({props, state}) : boolean  
The first argument is the current props & state, and the second arg is the next props & state. Returns a boolean indicating whether React should re-render this component. 

#### componentWillUpdate({props, state}, ({props, state})
The first argument is the current props & state, and the second arg is the next props & state. Note that `setState` is not sent to this function, as [the React documentation states](https://facebook.github.io/react/docs/component-specs.html#updating-componentwillupdate): "You _cannot_ use `this.setState()` in this method. If you need to update state in response to a prop change, use `componentWillReceiveProps` instead."

#### componentDidUpdate({props, state}, ({props, state})
The first argument is the current props & state, and the second arg is the previous props & state. Note that, unlike `componentWillUpdate`, the second argument is the earlier props & state; this is because I decided to standardize on the idea that current props & state is always the first argument.

#### componentWillUnmount({props, state})
Called before the component is unmounted from the DOM.

## Event Handler API

When an event handler is passed to `handler` in the `render` method, it guarantees that the event handler will always be called with the following arguments:

#### eventHandler({props, state}, setState)
The first argument is the current props & state, the second argument is the setState function that can change this component's state if necessary.

## Is this a good idea?

I'm not really sure. There's a certain purity to it, and it helps developers make mistakes in the lifecycle, for two reasons that I can see:

1. Components can't messily put attributes on the `this` object and expect them to be around during later lifecycle calls. As a result, components have to be more rigorous about using props and state.
2. It's somewhat clearer that props and state can't be changed in place. Some developers try to change `this.props` or `this.state` directly, and that causes nothing but sadness.
3. The API is clearer about when `setState` is allowed to be called and when it isn't. In React, developers can sometimes shoot themselves in the foot calling `this.setState` in the wrong method.

Those seem better, especially for new developers, but frankly, they seem like just marginal wins to me. 

One thing that I haven't fully groked is what this does to mixins. I think that in many cases mixins just become functions that you import. For example, imagine a component whose render only depends on props and state and therefore wants to implement a "pure" `shouldComponentUpdate` function:

```javascript
import component from "functional-react";
import {PureShouldComponentUpdate} from "some-should-component-update-lib-of-your-choosing";

const render = ({props}) => {
	return <div>Hello, {props.name}!</div>;
} 

export default component({render, shouldComponentUpdate:PureShouldComponentUpdate});
```

You could also imagine composing library functions together into chains to implement a lifecycle method for your component. This seems to me a bit cleaner than the current mixin story, but I doubt I've considered all its contours.