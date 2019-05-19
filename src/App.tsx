import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { extendObservable } from 'mobx';
import TodoPage from './views/pages/TodoPage';

interface IAppProps { }
interface IAppState { }

class App extends Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);
		extendObservable(this, {});
	}

	render() {
		return (
			<Switch>
				<Route path="/" component={TodoPage}/>
			</Switch>
		);
	}
}

export default App;
