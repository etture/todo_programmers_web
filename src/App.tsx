import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import './App.css';
import { extendObservable } from 'mobx';
import TodoPage from './views/pages/TodoPage';
import AuthPage from './views/pages/AuthPage';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from './stores/TodoStore';

interface IAppProps extends RouteComponentProps<{}> {
	todoStore?: ITodoStore
}
interface IAppState { }

@inject('todoStore')
@observer
class App extends Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);
		extendObservable(this, {});
		if(localStorage.getItem('todo_userid') && localStorage.getItem('todo_nickname')) {
			this.props.todoStore!.setUser(Number(localStorage.getItem('todo_userid')), localStorage.getItem('todo_nickname')!);
		}
	}

	componentDidMount() {
		if (this.props.todoStore!.userAuthorized) {
			this.props.history.push('/todo');
		} else {
			this.props.history.push('/auth/signin');
		}
	}

	render() {
		return (
			<Switch>
				<Route path="/auth" component={AuthPage} />
				<Route path="/todo" component={TodoPage} />
			</Switch>
		);
	}
}

export default withRouter(App);