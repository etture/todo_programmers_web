import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { IPreDBTodoItem } from '../../utils/definitions';
import log from '../../utils/devLog';
import Datetime from 'react-datetime';
import moment, { Moment } from 'moment';
import { Modal } from 'react-bootstrap';

import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ko';

interface INewTodoModalProps {
	todoStore?: ITodoStore,
	show: boolean,
	handleClose(): void
}
interface INewTodoModalState {
	title: string,
	content: string,
	titleEmpty: boolean,
	contentEmpty: boolean,
	addBtnClicked: boolean,
	priority: number,
	deadline?: string
}

@inject('todoStore')
@observer
class NewTodoModal extends Component<INewTodoModalProps, INewTodoModalState> {
	constructor(props: INewTodoModalProps) {
		super(props);
		this.state = {
			title: '',
			content: '',
			titleEmpty: false,
			contentEmpty: false,
			addBtnClicked: false,
			priority: 3,
			deadline: undefined
		}
	}

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let titleEmpty = false;
		let contentEmpty = false;
		if (this.state.title === '' || this.state.content === '') {
			if (this.state.title === '') titleEmpty = true;
			if (this.state.content === '') contentEmpty = true;
			this.setState({
				titleEmpty, contentEmpty, addBtnClicked: true
			});
		} else {
			const preDBTodoItem: IPreDBTodoItem = {
				userid: this.props.todoStore!.userid,
				title: this.state.title,
				content: this.state.content,
				priority: this.state.priority,
				deadline: this.state.deadline
			}
			this.props.todoStore!.createNewTodo(preDBTodoItem);
			this.handleClose();
		}
	}

	renderTitleWarning = (): JSX.Element => {
		if (this.state.titleEmpty && this.state.addBtnClicked) {
			return (
				<div className="alert mt-1 mb-0 p-2 d-inline-flex" role="alert" style={{ color: 'red' }}>제목을 입력해주세요</div>
			);
		} else {
			return (<div></div>);
		}
	}

	renderContentWarning = (): JSX.Element => {
		if (this.state.contentEmpty && this.state.addBtnClicked) {
			return (
				<div className="alert mt-0 mb-0 p-2 d-inline-flex" role="alert" style={{ color: 'red' }}>내용을 입력해주세요</div>
			);
		} else {
			return (<div></div>);
		}
	}

	handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ title: e.target.value });
	}

	handleContent = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ content: e.target.value });
	}

	handlePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
		log('priority: ', e.currentTarget.value);
		this.setState({ priority: Number(e.currentTarget.value) });
	}

	handleDeadline = (datetime: Moment | string) => {
		const deadline = moment(datetime.valueOf());
		log('deadline: ', datetime.toString(), deadline.month(), deadline.date(), deadline.toISOString());
		this.setState({ deadline: deadline.toISOString() });
	}

	handleClose = () => {
		this.props.handleClose();
		this.setState({
			title: '',
			content: '',
			titleEmpty: false,
			contentEmpty: false,
			addBtnClicked: false,
			priority: 3,
			deadline: undefined
		});
	}

	render() {
		return (
			<Modal show={this.props.show} onHide={() => this.handleClose()}>
				<Modal.Header closeButton>
					<Modal.Title>새 할 일 추가</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
						<div className="modal-body">
							<div className="form-group">
								<label htmlFor="todoTitle">제목 <small>(필수)</small></label>
								<input type="text" className="form-control" id="todoTitle"
									value={this.state.title}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleTitle(e)} />
								{this.renderTitleWarning()}
							</div>
							<div className="form-group">
								<label htmlFor="todoContent">내용 <small>(필수)</small></label>
								<input type="text" className="form-control" id="todoContent"
									value={this.state.content}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleContent(e)} />
								{this.renderContentWarning()}
							</div>
							<div className="form-group">
								<label htmlFor="prioritySelect">우선 순위 <small>(선택)</small></label>
								<select className="form-control" id="prioritySelect"
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handlePriority(e)} >
									<option value={3}>없음</option>
									<option value={2}>낮음</option>
									<option value={1}>중간</option>
									<option value={0}>높음</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="deadlinePicker">마감 기한 <small>(선택)</small></label>
								<Datetime onChange={(datetime) => this.handleDeadline(datetime)} locale="ko"/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.handleClose()}>취소</button>
							<button type="submit" className="btn btn-primary">추가하기</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default NewTodoModal;