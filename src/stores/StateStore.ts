import { observable, action } from 'mobx';
import { ITodoItem } from '../utils/definitions';
import log from '../utils/devLog';

export interface IStateStore {
	editTodoModalItem: ITodoItem,
	setEditTodoModalItem(todo: ITodoItem): void,
	resetEditTodoModalItem(): void,
	handleTitle(title: string): void,
	handleContent(content: string): void,
	handlePriority(priority: number): void,
	handleDeadline(deadline: string): void,
	editTodoModalShown: boolean,
	setEditTodoModalShown(): void
}

export class StateStore implements IStateStore {
	@observable editTodoModalItem: ITodoItem = {
		id: 0,
		title: '',
		content: '',
		createdAt: '',
		completed: false,
		priority: 3,
		deadline: ''
	};

	@action
	setEditTodoModalItem = (todo: ITodoItem) => {
		this.editTodoModalItem = todo;
		log('stateStore editTodoModalItem: ', this.editTodoModalItem.title);
	}

	@action
	resetEditTodoModalItem = () => {
		this.editTodoModalItem = {
			id: 0,
			title: '',
			content: '',
			createdAt: '',
			completed: false,
			priority: 3,
			deadline: ''
		};
	}

	@action
	handleTitle = (title: string) => {
		this.editTodoModalItem.title = title;
	}

	@action
	handleContent = (content: string) => {
		this.editTodoModalItem.content = content;
	}

	@action
	handlePriority = (priority: number) => {
		this.editTodoModalItem.priority = priority;
	}

	@action
	handleDeadline = (deadline: string) => {
		this.editTodoModalItem.deadline = deadline;
	}

	@observable editTodoModalShown = false;

	@action
	setEditTodoModalShown = () => {
		this.editTodoModalShown = !this.editTodoModalShown;
		log('setEditTodoModalShown: ', this.editTodoModalShown);
	}

}