import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { axiosInstance } from '../../utils/axiosSettings';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem, ITodoListResponse } from '../../utils/definitions';
import { IoMdCheckmark } from 'react-icons/io';
import moment from 'moment';
import './TodoListItem.css';

interface ITodoListItemProps {
	todoStore?: ITodoStore,
	todoItem: ITodoItem
}
interface ITodoListItemState {
	checked: boolean
}

@inject('todoStore')
@observer
class TodoListItem extends Component<ITodoListItemProps, ITodoListItemState> {
	constructor(props: ITodoListItemProps) {
		super(props);
		this.state = {
			checked: false
		};
	}

	checked = () => {
		// this.setState({ checked: !this.state.checked });
		this.props.todoStore!.completeTodo(this.props.todoItem, !this.props.todoItem.completed);
	}

	deleteTodo = () => {
		this.props.todoStore!.deleteTodo(this.props.todoItem.id);
	}

	// 완료된 할 일은 제목/내용에 줄이 쳐져있고 연한 회색으로 렌더링
	conditionalRenderContent = (): JSX.Element => {
		const { todoItem } = this.props;
		if (todoItem.completed) {
			return (
				<div className="ml-3 align-self-start" style={{color: '#adadad'}}>
					<h5 className="mt-3" data-container="body"
						data-toggle="popover" data-placement="top" data-content="hello">
						<del>{todoItem.title}</del>
					</h5>
					<p><del>{todoItem.content}</del></p>
				</div>
			);
		} else {
			return (
				<div className="ml-3 align-self-start">
					<h5 className="mt-3" data-container="body"
						data-toggle="popover" data-placement="top" data-content="hello">
						{todoItem.title}
					</h5>
					<p>{todoItem.content}</p>
				</div>
			);
		}
	}

	render() {
		const { todoItem } = this.props;
		const createdAt = moment(todoItem.createdAt);
		const deadline = moment(todoItem.deadline!);
		return (
			<div className="container">
				<div className="d-flex flex-row justify-content-between">
					<div className="d-flex flex-row">
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
					<div className="d-flex flex-column">
						<div>
							<button type="button" className="close" aria-label="Close" onClick={() => this.deleteTodo()}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="mt-3 d-flex flex-column">
							<p className="m-0 justify-content-end">만든 시간: {createdAt.year()}년 {createdAt.month() + 1}월 {createdAt.date()}일 {createdAt.hour()}시 {createdAt.minute()}분</p>
							<div className="d-flex justify-content-end">
								<p className="m-0">마감 기한{todoItem.deadline ? `: ${deadline.year()}년 ${deadline.month() + 1}월 ${deadline.date()}일 ${deadline.hour()}시 ${deadline.minute()}분` : ' 없음'}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TodoListItem;