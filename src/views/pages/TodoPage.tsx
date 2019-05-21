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
			<div className="container mt-3">
				<div className="d-flex flex-row justify-content-between">
					<h3>Todo (user: {this.props.todoStore!.nickname})</h3>
					<button className="d-flex flex-wrap btn btn-outline-primary"
						onClick={() => this.signout()}
					>로그아웃</button>
				</div>
				<TodoList />
			</div>
		);
	}
}

export default TodoPage;