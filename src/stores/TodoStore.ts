import { observable, action, computed } from 'mobx';
import { axiosInstance } from '../utils/axiosSettings';
import log from '../utils/devLog';
import { ITodoItem, ITodoListResponse, IPreDBTodoItem } from '../utils/definitions';
import moment from 'moment';

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
		axiosInstance.post('/get/all', { userid: this.userid })
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
		// Delete element locally first, for fast rendering
		this.todoList = this.todoList.filter(todo => { return todo.id !== todoId; });

		// Delete from server
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
		log('now: ', moment().format());

		// Complete todo locally for fast rendering
		this.todoList = this.todoList.map(originalTodo => {
			if (originalTodo.id === todoItem.id) {
				return {...originalTodo, completed};
			} else return originalTodo;
		});

		// Complete todo on server
		const newTodoItem = { ...todoItem, completed };
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
		// Add a new element locally for fast rendering
		const tempNewTodo: ITodoItem = {
			...preDBTodoItem,
			id: 0, completed: false, createdAt: moment().subtract(9, 'hours').format()
		};
		this.todoList.push(tempNewTodo);

		// Add on server
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
		// Edit the element locally for fast rendering
		this.todoList = this.todoList.map(originalTodo => {
			if (originalTodo.id === todoItem.id) {
				return {...todoItem, deadline: moment(todoItem.deadline).subtract(9, 'hours').format()};
			} else return originalTodo;
		});

		// Edit on server
		axiosInstance.put('/edit/content', todoItem)
			.then(() => {
				this.fetchAllTodos();
			})
			.catch(error => {
				log('editTodo error: ', error);
			});
	}
}