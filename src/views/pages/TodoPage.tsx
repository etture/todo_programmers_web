import React, { Component } from 'react';
import TodoList from '../components/TodoList';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { RouteComponentProps } from 'react-router-dom'

interface ITodoPageProps extends RouteComponentProps<{}> {
	todoStore?: ITodoStore
}
interface ITodoPageState { }

@inject('todoStore')
@observer
class TodoPage extends Component<ITodoPageProps, ITodoPageState> {
	constructor(props: ITodoPageProps) {
		super(props);
	}

	signout = () => {
		this.props.todoStore!.signout();
		localStorage.clear();
		this.props.history.push('/auth/signin');
	}

	render() {
		return (
			<div className="container mt-3 col-9">
				<div className="container d-flex flex-row justify-content-between">
					<h3><span className="badge badge-secondary py-2">TODO (user: {this.props.todoStore!.nickname})</span></h3>
					<button className="btn btn-outline-primary btn-md"
						onClick={() => this.signout()}
					>로그아웃</button>
				</div>
				<TodoList />
			</div>
		);
	}
}

export default TodoPage;