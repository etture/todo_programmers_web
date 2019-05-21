import React, { Component } from 'react';
import { ITodoStore } from '../../stores/TodoStore';
import { withRouter, RouteComponentProps, Switch, Route } from 'react-router-dom';
import SigninPage from './SigninPage';
import SignupPage from './SignupPage';

interface IAuthPageProps extends RouteComponentProps<{}> {
	todoStore?: ITodoStore
}
interface IAuthPageState { }

class AuthPage extends Component<IAuthPageProps, IAuthPageState> {
	constructor(props: IAuthPageProps) {
		super(props);
	}

	render() {
		return (
			<Switch>
				<Route path='/auth/signin' component={SigninPage} />
				<Route path='/auth/signup' component={SignupPage} />
			</Switch>
		);
	}
}

export default withRouter(AuthPage);