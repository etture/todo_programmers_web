import React, { Component } from 'react';
import TodoList from '../components/TodoList';

interface ITodoPageProps { }
interface ITodoPageState { }

class TodoPage extends Component<ITodoPageProps, ITodoPageState> {
	constructor(props: ITodoPageProps) {
		super(props);
	}

	render() {
		return (
			<div className="container">
				<h1>Todo Page</h1>
				<TodoList />
			</div>
		);
	}
}

export default TodoPage;