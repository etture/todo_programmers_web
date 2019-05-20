import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { ITodoItem, IPreDBTodoItem } from '../../utils/definitions';
import log from '../../utils/devLog';
import Datetime from 'react-datetime';
import moment, { Moment } from 'moment';
import { Modal } from 'react-bootstrap';

import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ko';
import { IStateStore } from '../../stores/StateStore';

interface IEditTodoModalProps {
	todoStore?: ITodoStore,
	stateStore?: IStateStore,
	show: boolean,
	handleClose(): void
}
interface IEditTodoModalState {
	title: string,
	content: string,
	titleEmpty: boolean,
	contentEmpty: boolean,
	editBtnClicked: boolean,
	priority: number,
	deadline?: string
}

@inject('todoStore')
@inject('stateStore')
@observer
class EditTodoModal extends Component<IEditTodoModalProps, IEditTodoModalState> {
	constructor(props: IEditTodoModalProps) {
		super(props);
		// const { todoItem } = this.props;
		// this.state = {
		// 	title: todoItem.title,
		// 	content: todoItem.content,
		// 	titleEmpty: false,
		// 	contentEmpty: false,
		// 	editBtnClicked: false,
		// 	priority: todoItem.priority,
		// 	deadline: todoItem.deadline
		// }
		const { editTodoModalItem } = this.props.stateStore!
		this.state = {
			title: editTodoModalItem.title,
			content: editTodoModalItem.content,
			titleEmpty: false,
			contentEmpty: false,
			editBtnClicked: false,
			priority: editTodoModalItem.priority,
			deadline: editTodoModalItem.deadline
		}
	}

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { editTodoModalItem } = this.props.stateStore!;
		let titleEmpty = false;
		let contentEmpty = false;
		if (editTodoModalItem.title === '' || editTodoModalItem.content === '') {
			if (editTodoModalItem.title === '') titleEmpty = true;
			if (editTodoModalItem.content === '') contentEmpty = true;
			this.setState({
				titleEmpty, contentEmpty, editBtnClicked: true
			});
		} else {
			const editedTodoItem: ITodoItem = {
				...editTodoModalItem,
				title: editTodoModalItem.title, content: editTodoModalItem.content,
				priority: editTodoModalItem.priority, deadline: editTodoModalItem.deadline
			}
			this.props.todoStore!.editTodo(editedTodoItem);
			this.props.handleClose();
		}
	}

	renderTitleWarning = (): JSX.Element => {
		if (this.state.titleEmpty && this.state.editBtnClicked) {
			return (
				<div className="alert mt-1 mb-0 p-2 d-inline-flex" role="alert" style={{ color: 'red' }}>제목을 입력해주세요</div>
			);
		} else {
			return (<div></div>);
		}
	}

	renderContentWarning = (): JSX.Element => {
		if (this.state.contentEmpty && this.state.editBtnClicked) {
			return (
				<div className="alert mt-0 mb-0 p-2 d-inline-flex" role="alert" style={{ color: 'red' }}>내용을 입력해주세요</div>
			);
		} else {
			return (<div></div>);
		}
	}

	handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		// this.setState({ title: e.target.value });
		this.props.stateStore!.handleTitle(e.target.value);
	}

	handleContent = (e: React.ChangeEvent<HTMLInputElement>) => {
		// this.setState({ content: e.target.value });
		this.props.stateStore!.handleContent(e.target.value);
	}

	handlePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
		log('priority: ', e.currentTarget.value);
		// this.setState({ priority: Number(e.currentTarget.value) });
		this.props.stateStore!.handlePriority(Number(e.currentTarget.value));
	}

	handleDeadline = (datetime: Moment | string) => {
		const deadline = moment(datetime.valueOf());
		log('deadline: ', datetime.toString(), deadline.month(), deadline.date(), deadline.toISOString());
		// this.setState({ deadline: deadline.toISOString() });
		this.props.stateStore!.handleDeadline(deadline.toISOString());
	}

	handleClose = () => {
		this.props.handleClose();
		this.setState({
			titleEmpty: false,
			contentEmpty: false,
			editBtnClicked: false
		});
		this.props.stateStore!.resetEditTodoModalItem();
	}

	render() {
		const { editTodoModalItem } = this.props.stateStore!;
		log('this.state.title: ', this.state.title);
		return (
			<Modal show={this.props.show} onHide={() => this.handleClose()}>
				<Modal.Header closeButton>
					<Modal.Title>할 일 수정</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
						<div className="modal-body">
							<div className="form-group">
								<label htmlFor="todoTitle">제목 <small>(필수)</small></label>
								<input type="text" className="form-control" id="todoTitle"
									value={editTodoModalItem.title}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleTitle(e)} />
								{this.renderTitleWarning()}
							</div>
							<div className="form-group">
								<label htmlFor="todoContent">내용 <small>(필수)</small></label>
								<input type="text" className="form-control" id="todoContent"
									value={editTodoModalItem.content}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContent(e)} />
								{this.renderContentWarning()}
							</div>
							<div className="form-group">
								<label htmlFor="prioritySelect">우선 순위 <small>(선택)</small></label>
								<select className="form-control" id="prioritySelect"
									value={editTodoModalItem.priority}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handlePriority(e)} >
									<option value={3}>없음</option>
									<option value={2}>낮음</option>
									<option value={1}>중간</option>
									<option value={0}>높음</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="deadlinePicker">마감 기한 <small>(선택)</small></label>
								<Datetime
									value={editTodoModalItem.deadline}
									onChange={(datetime) => this.handleDeadline(datetime)} locale="ko" />
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.handleClose()}>취소</button>
							<button type="submit" className="btn btn-primary">수정하기</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default EditTodoModal;