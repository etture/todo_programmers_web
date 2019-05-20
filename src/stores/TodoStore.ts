import { observable, action, computed } from 'mobx';
import { axiosInstance } from '../utils/axiosSettings';
import log from '../utils/devLog';
import { ITodoItem, ITodoListResponse, IPreDBTodoItem } from '../utils/definitions';

export interface ITodoStore {
	userid: number,
	setUserid(uid: number): void,
	signout(): void,
	userAuthorized: boolean,
	todoList: Array<ITodoItem>,
	setTodoList(list: ITodoItem[]): void,
	fetchAllTodos(): void,
	deleteTodo(todoId: number): void,
	completeTodo(todoItem: ITodoItem, completed: boolean): void,
	createNewTodo(preDBTodoItem: IPreDBTodoItem): void,
	editTodo(todoItem: ITodoItem): void
}

export class TodoStore implements ITodoStore {
	@observable userid = 0;

	@action
	setUserid = (uid: number) => {
		this.userid = uid;
	}

	@action
	signout = () => {
		this.userid = 0;
	}

	@computed
	get userAuthorized(): boolean {
		return this.userid !== 0;
	}

	@observable todoList = Array<ITodoItem>();

	@action
	setTodoList = (list: ITodoItem[]) => {
		this.todoList = list;
		log('TodoStore setTodoList, todoList: ', JSON.stringify(this.todoList));
	}

	@action
	fetchAllTodos = () => {
		// 모든 TODO 항목들 가져오기
		axiosInstance.post('/get/all', { userid: this.userid})
			.then((todos) => {
				const todoListRes: ITodoListResponse = todos.data;
				// Store에 TODO 항목들 저장
				this.setTodoList(todoListRes.todoList);
			})
			.catch(error => {
				log('fetchAllTodos error: ', error);
			});
	}

	@action
	deleteTodo = (todoId: number) => {
		axiosInstance.delete('/delete', { data: { id: todoId, userid: this.userid } })
			.then(() => {
				this.fetchAllTodos();
			})
			.catch(error => {
				log('deleteTodo error: ', error);
			});
	}

	@action
	completeTodo = (todoItem: ITodoItem, completed: boolean) => {
		const newTodoItem = { ...todoItem, completed };
		log('newTodoItem: ', newTodoItem);
		axiosInstance.put('/edit/completed', newTodoItem)
			.then(() => {
				this.fetchAllTodos();
			})
			.catch(error => {
				log('completeTodo error: ', error);
			});
	}

	@action
	createNewTodo = (preDBTodoItem: IPreDBTodoItem) => {
		axiosInstance.post('/new', preDBTodoItem)
			.then(() => {
				this.fetchAllTodos();
			})
			.catch(error => {
				log('createNewTodo error: ', error);
			});
	}

	@action
	editTodo = (todoItem: ITodoItem) => {
		axiosInstance.put('/edit/content', todoItem)
			.then(() => {
				this.fetchAllTodos();
			})
			.catch(error => {
				log('editTodo error: ', error);
			});
	}
}