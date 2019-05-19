import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { axiosInstance } from '../../utils/axiosSettings';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem, ITodoListResponse } from '../../utils/definitions';
import './TodoListItem.css';

interface ITodoListItemProps {
	todoStore?: ITodoStore,
	todoItem: ITodoItem
}
interface ITodoListItemState { }

@inject('todoStore')
@observer
class TodoListItem extends Component<ITodoListItemProps, ITodoListItemState> {
	constructor(props: ITodoListItemProps) {
		super(props);
	}

	render() {
		const { todoItem } = this.props;
		return (
			<div className="container">
				<div className="row">
					<div className="d-flex justify-content-center">
						<button type="button" className="btn btn-primary btn-circle">hi</button>
					</div>
					<div>
						<h5 className="mt-3">제목: {todoItem.title}</h5>
						<p>{todoItem.content}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default TodoListItem;