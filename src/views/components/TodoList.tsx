import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import arraySort from 'array-sort';
import moment from 'moment';
import { ITodoStore } from '../../stores/TodoStore';
import TodoListItem from './TodoIListItem';
import log from '../../utils/devLog';
import './TodoList.css';
import NewTodoModal from './NewTodoModal';
import EditTodoModal from './EditTodoModal';
import { IStateStore } from '../../stores/StateStore';

interface ITodoListProps {
	todoStore?: ITodoStore,
	stateStore?: IStateStore
}
interface ITodoListState {
	newTodoModalShown: boolean,
}

@inject('todoStore')
@inject('stateStore')
@observer
class TodoList extends Component<ITodoListProps, ITodoListState> {
	constructor(props: ITodoListProps) {
		super(props);
		this.state = {
			newTodoModalShown: false
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
		
		// TODO 리스트는 우선순위, 마김기한, 만든 시간 순으로 정렬
		arraySort(uncompletedTodoList, ['priority', 'deadline', 'createdAt'], { reverse: false });
		uncompletedTodoList.forEach(todo => {
			let deadlinePassed = false;
			if (todo.deadline && moment().toISOString() >= todo.deadline) {
				deadlinePassed = true;
			}

			let itemStyle = {};
			if (deadlinePassed) {
				itemStyle = { backgroundColor: '#ffcccc' };
			}

			todoList.push(
				<div key={`${todo.id}`} >
					<li className="list-group-item todo-item" style={itemStyle}>
						<TodoListItem todoItem={todo} deadlinePassed={deadlinePassed} />
					</li>
				</div>
			)
		});
		return todoList;
	}

	renderCompletedTodoList = (): JSX.Element[] => {
		let todoList: Array<JSX.Element> = [];
		const completedTodoList = this.props.todoStore!.todoList.filter(todo => todo.completed);

		// TODO 리스트는 우선순위, 마김기한, 만든 시간 순으로 정렬
		arraySort(completedTodoList, ['priority', 'deadline', 'createdAt'], { reverse: false });
		completedTodoList.forEach(todo => {
			todoList.push(
				<li key={`${todo.id}`} className="list-group-item todo-item" >
					<TodoListItem todoItem={todo} deadlinePassed={false} />
				</li>
			)
		});
		return todoList;
	}

	handleNewTodoModalShow = () => {
		this.setState({ newTodoModalShown: true });
		log('new modal show, ', this.state);
	}

	handleNewTodoModalClose = () => {
		this.setState({ newTodoModalShown: false });
		log('new modal close, ', this.state);
	}

	handleEditTodoModalClose = () => {
		this.props.stateStore!.setEditTodoModalShown();
		log('edit modal close, ', this.state);
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
									onClick={() => this.handleNewTodoModalShow()}
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
				<NewTodoModal show={this.state.newTodoModalShown} handleClose={() => this.handleNewTodoModalClose()} />
				<EditTodoModal show={this.props.stateStore!.editTodoModalShown} handleClose={this.handleEditTodoModalClose} />
			</div>
		);
	}
}

export default TodoList;