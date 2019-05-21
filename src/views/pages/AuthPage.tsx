import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { withRouter, RouteComponentProps, Switch, Route } from 'react-router-dom';
import SigninPage from './SigninPage';
import SignupPage from './SignupPage';

interface IAuthPageProps extends RouteComponentProps<{}> {
	todoStore?: ITodoStore
}
interface IAuthPageState {
	nickname: string,
	password: string
}

@inject('todoStore')
@observer
class AuthPage extends Component<IAuthPageProps, IAuthPageState> {
	constructor(props: IAuthPageProps) {
		super(props);
		this.state = {
			nickname: '',
			password: ''
		};
	}

	componentDidMount() {
		// this.props.history.push('/auth/signin');
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