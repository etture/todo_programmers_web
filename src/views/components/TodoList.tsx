import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { axiosInstance } from '../../utils/axiosSettings';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem, ITodoListResponse } from '../../utils/definitions';
import TodoListItem from './TodoIListItem';
import log from '../../utils/devLog';

interface ITodoListProps {
	todoStore?: ITodoStore
}
interface ITodoListState { }

@inject('todoStore')
@observer
class TodoList extends Component<ITodoListProps, ITodoListState> {
	constructor(props: ITodoListProps) {
		super(props);
	}

	componentDidMount() {
		this.fetchAllTodos();
	}

	fetchAllTodos = () => {
		// 모든 TODO 항목들 가져오기
		axiosInstance.post('/get/all', {})
			.then((todos) => {
				const todoListRes: ITodoListResponse = todos.data;
				// Store에 TODO 항목들 저장
				this.props.todoStore!.setTodoList(todoListRes.todoList);
			})
			.catch(error => {
				log('todoList error: ', error);
			});
	}

	renderTodoList = (): JSX.Element[] => {
		let todoList: Array<JSX.Element> = [];
		this.props.todoStore!.todoList.forEach(todo => {
			todoList.push(
				<li key={`${todo.id}`} className="list-group-item">
					<TodoListItem todoItem={todo}/>
				</li>
			)
		});
		return todoList;
	}

	render() {
		return (
			<div className="container">
				<ul className="list-group list-group-flush my-3">
					{this.renderTodoList()}
				</ul>
			</div>
		);
	}
}

export default TodoList;