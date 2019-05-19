import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { axiosInstance } from '../../utils/axiosSettings';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem, ITodoListResponse } from '../../utils/definitions';
import TodoListItem from './TodoIListItem';
import log from '../../utils/devLog';
import './TodoList.css';
import NewTodoModal from './NewTodoModal';

interface ITodoListProps {
	todoStore?: ITodoStore
}
interface ITodoListState {
	modalShown: boolean
 }

@inject('todoStore')
@observer
class TodoList extends Component<ITodoListProps, ITodoListState> {
	constructor(props: ITodoListProps) {
		super(props);
		this.state = {
			modalShown: false
		};
	}

	componentDidMount() {
		this.fetchAllTodos();
	}

	fetchAllTodos = () => {
		// 모든 TODO 항목들 가져오기
		this.props.todoStore!.fetchAllTodos();
	}

	renderUncompletedTodoList = (): JSX.Element[] => {
		let todoList: Array<JSX.Element> = [];
		const uncompletedTodoList = this.props.todoStore!.todoList.filter(todo => !todo.completed);
		uncompletedTodoList.forEach(todo => {
			todoList.push(
				<li key={`${todo.id}`} className="list-group-item todo-item" >
					<TodoListItem todoItem={todo} />
				</li>
			)
		});
		return todoList;
	}

	renderCompletedTodoList = (): JSX.Element[] => {
		let todoList: Array<JSX.Element> = [];
		const completedTodoList = this.props.todoStore!.todoList.filter(todo => todo.completed);
		completedTodoList.forEach(todo => {
			todoList.push(
				<li key={`${todo.id}`} className="list-group-item todo-item" >
					<TodoListItem todoItem={todo} />
				</li>
			)
		});
		return todoList;
	}

	handleShow = () => {
		this.setState({modalShown: true});
	}

	handleClose = () => {
		this.setState({modalShown: false});
	}

	render() {
		return (
			<div className="container">
				<ul className="list-group list-group-flush my-3 card">
					<div className="card-header">
						<div className="d-flex flex-row justify-content-between">
							<h4 className="align-self-center">현재 할 일</h4>
							<div className="row d-flex justify-content-end">
								<button
									type="button"
									className="btn btn-primary mr-3"
									onClick={() => this.handleShow()}
								>
									할 일 추가
								</button>
							</div>
						</div>
					</div>
					<div className="card-body p-0">
						{this.renderUncompletedTodoList()}
					</div>
				</ul>
				<ul className="list-group list-group-flush my-3 card">
					<div className="card-header">
						<div className="d-flex flex-row justify-content-between">
							<h4 className="align-self-center">완료된 할 일</h4>
						</div>
					</div>
					<div className="card-body p-0">
						{this.renderCompletedTodoList()}
					</div>
				</ul>
				<NewTodoModal show={this.state.modalShown} handleClose={() => this.handleClose()} />
			</div>
		);
	}
}

export default TodoList;