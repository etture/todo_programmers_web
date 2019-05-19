import { observable, action } from 'mobx';
import {ITodoItem} from '../utils/definitions';

export interface ITodoStore {
	todoList: Array<ITodoItem>,
	setTodoList(list: ITodoItem[]): void
}

export class TodoStore implements ITodoStore {
	@observable todoList = Array<ITodoItem>();

	@action	setTodoList(list: ITodoItem[]) {
		this.todoList = list;
	}
}