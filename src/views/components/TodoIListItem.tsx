import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem } from '../../utils/definitions';
import { IoMdCheckmark } from 'react-icons/io';
import moment from 'moment';
import _ from 'lodash';
import './TodoListItem.css';
import log from '../../utils/devLog';
import { IStateStore } from '../../stores/StateStore';

import 'moment/locale/ko';

interface ITodoListItemProps {
	todoStore?: ITodoStore,
	stateStore?: IStateStore,
	todoItem: ITodoItem,
	deadlinePassed: boolean
}
interface ITodoListItemState {}

@inject('todoStore')
@inject('stateStore')
@observer
class TodoListItem extends Component<ITodoListItemProps, ITodoListItemState> {
	constructor(props: ITodoListItemProps) {
		super(props);
	}

	checked = () => {
		this.props.todoStore!.completeTodo(this.props.todoItem, !this.props.todoItem.completed);
	}

	deleteTodo = () => {
		this.props.todoStore!.deleteTodo(this.props.todoItem.id);
	}

	// 완료된 할 일은 제목/내용에 줄이 쳐져있고 연한 회색으로 렌더링
	conditionalRenderContent = (): JSX.Element => {
		const { todoItem } = this.props;
		let content: JSX.Element;
		if (todoItem.completed) {
			content = (
				<div className="ml-3 align-self-start" style={{ color: '#adadad' }}>
					<h5 className="mt-3" data-container="body"
						data-toggle="popover" data-placement="top" data-content="hello">
						<del>{todoItem.title}</del>
					</h5>
					<p><del>{todoItem.content}</del></p>
				</div>
			);
			console.log('conditionalRenderContent, todoItem: ', todoItem);
		} else {
			content = (
				<div className="ml-3 align-self-start">
					<h5 className="mt-3" data-container="body"
						data-toggle="popover" data-placement="top" data-content="hello">
						{todoItem.title}
					</h5>
					<p>{todoItem.content}</p>
				</div>
			);
			console.log('conditionalRenderContent, todoItem: ', todoItem.title);
		}
		return (
			<div onClick={() => this.handleEditTodoModalShow()}>
				{content}
			</div>
		);
	}

	conditionalRenderEditClick = (): JSX.Element => {
		const { todoItem } = this.props;
		if (todoItem.completed) {
			return (<div></div>)
		} else {
			return (
				<div className="d-flex flex-fill"
						onClick={() => this.handleEditTodoModalShow()} />
			);
		}
	}

	conditionalRenderDeadline = (): JSX.Element => {
		const { deadlinePassed, todoItem } = this.props;
		const deadline = moment(todoItem.deadline!);
		log('deadline: ', deadline);
		if (deadlinePassed) {
			return (
				<div className="d-flex justify-content-start">
					<p className="m-0" style={{ color: 'red' }}><strong>마감 기한{todoItem.deadline ? `: ${deadline.year()}년 ${deadline.month() + 1}월 ${deadline.date()}일 ${deadline.hour()}시 ${deadline.minute()}분` : ' 없음'}</strong></p>
				</div>
			);
		} else {
			return (
				<div className="d-flex justify-content-start">
					<p className="m-0">마감 기한{todoItem.deadline ? `: ${deadline.year()}년 ${deadline.month() + 1}월 ${deadline.date()}일 ${deadline.hour()}시 ${deadline.minute()}분` : ' 없음'}</p>
				</div>
			);
		}
	}

	printPriority = () => {
		const { priority } = this.props.todoItem;
		log('printPriority: ', priority);
		switch (priority) {
			case 3:
				return <span style={{ color: 'blue' }}>없음</span>;
			case 2:
				return <span style={{ color: 'green' }}>낮음</span>;
			case 1:
				return <span style={{ color: 'chocolate' }}>중간</span>;
			case 0:
				return <span style={{ color: 'red' }}>높음</span>;
		}
	}

	handleEditTodoModalShow = () => {
		const todoClone = _.clone(this.props.todoItem);
		this.props.stateStore!.setEditTodoModalItem(todoClone);
		this.props.stateStore!.setEditTodoModalShown();
		log('edit modal show, ', this.state);
	}

	handleEditTodoModalClose = () => {
		this.props.stateStore!.setEditTodoModalShown();
		log('edit modal close, ', this.state);
	}

	render() {
		const { todoItem } = this.props;
		log('todoItem.createdAt:, ', todoItem.createdAt);
		const createdAt = moment(todoItem.createdAt).add(9, 'hours');
		return (
			<div className="container" >
				<div className="d-flex flex-row justify-content-between">
					<div className="d-flex flex-row align-self-start">
						<div className="d-flex align-self-center mr-2">
							<button type="button"
								className={`btn btn-circle ${todoItem.completed ? 'btn-primary' : 'btn-outline-primary'}`}
								onClick={() => this.checked()}
							>
								<IoMdCheckmark />
							</button>
						</div>
						{this.conditionalRenderContent()}
					</div>
					{this.conditionalRenderEditClick()}
					<div className="d-flex flex-column">
						<div className="d-flex flex-row justify-content-between">
							<div className="d-flex justify-content-end">
								<p className="m-0">우선 순위: {this.printPriority()}</p>
							</div>
							<button type="button" className="close d-flex justify-content-end" aria-label="Close" onClick={() => this.deleteTodo()}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="mt-3 d-flex flex-column">
							<p className="m-0 justify-content-end">만든 시간: {createdAt.year()}년 {createdAt.month() + 1}월 {createdAt.date()}일 {createdAt.hour()}시 {createdAt.minute()}분</p>
							{this.conditionalRenderDeadline()}
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default TodoListItem;