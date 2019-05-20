import React, { Component } from 'react';
import TodoList from '../components/TodoList';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { withRouter, RouteComponentProps } from 'react-router-dom'

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
		this.props.history.push('/auth');
	}

	render() {
		return (
			<div className="container">
				<div className="d-flex flex-row justify-content-between">
					<h1>Todo</h1>
					<button className="d-flex flex-wrap btn btn-outline-primary py-0"
						onClick={() => this.signout()}
					>로그아웃</button>
				</div>
				<TodoList />
			</div>
		);
	}
}

export default TodoPage;