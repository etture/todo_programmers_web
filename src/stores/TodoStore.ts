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
	editTodo(todoItem: ITodoItem, deadlineEdited: boolean): void
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
	count = 0;
	pendingReqCount = 0;

	@action
	setTodoList = (list: ITodoItem[]) => {
		this.todoList = list;
		log('TodoStore setTodoList, todoList: ', JSON.stringify(this.todoList));
	}

	@action
	fetchAllTodos = () => {
		this.count++;
		log('fetchAllTodos start, cnt: ', this.count);
		log(`moment().format(): ${moment().format()}, moment().format('YYYY-MM-DD HH:mm:SS'): ${moment().format('YYYY-MM-DD HH:mm:SS')}`);
		// 모든 TODO 항목들 가져오기
		axiosInstance.post('/get/all', { userid: this.userid })
			.then((todos) => {
				const todoListRes: ITodoListResponse = todos.data;
				// Store에 TODO 항목들 저장
				this.setTodoList(todoListRes.todoList);
				log('fetchAllTodos end, cnt: ', this.count);
			})
			.catch(error => {
				log('fetchAllTodos error: ', error);
			});
	}

	@action
	fetchAllTodosInternal = () => {
		this.count++;
		log(`fetchAllTodos start, cnt: ${this.count}, pendingReqCount: ${this.pendingReqCount}`);
		log(`moment().format(): ${moment().format()}, moment().format('YYYY-MM-DD HH:mm:SS'): ${moment().format('YYYY-MM-DD HH:mm:SS')}`);
		log(`TEST-> moment('2019-05-21 11:00:00').format('YYYY-MM-DD HH:mm:SS'): ${moment('2019-05-21 11:00:00').format('YYYY-MM-DD HH:mm:SS')}, moment('2019-05-21 13:00:00): ${moment('2019-05-21 13:00:00')}`);
		// 모든 TODO 항목들 가져오기
		axiosInstance.post('/get/all', { userid: this.userid })
			.then((todos) => {
				const todoListRes: ITodoListResponse = todos.data;
				// Store에 TODO 항목들 저장
				// setTimeout(() => {
				// 	this.setTodoList(todoListRes.todoList);
				// 	log('fetchAllTodos end, cnt: ', this.count);
				// }, 3000);
				this.pendingReqCount--;
				log(`fetchAllTodos end, cnt: ${this.count}, pendingReqCount: ${this.pendingReqCount}`);
				if (this.pendingReqCount === 0) {
					this.setTodoList(todoListRes.todoList)
				}
			})
			.catch(error => {
				log('fetchAllTodos error: ', error);
			});
	}

	@action
	deleteTodo = (todoId: number) => {
		this.pendingReqCount++;

		// Delete element locally first, for fast rendering
		this.todoList = this.todoList.filter(todo => { return todo.id !== todoId; });

		// Delete from server
		axiosInstance.delete('/delete', { data: { id: todoId, userid: this.userid } })
			.then(() => {
				this.fetchAllTodosInternal();
			})
			.catch(error => {
				log('deleteTodo error: ', error);
			});
	}

	@action
	completeTodo = (todoItem: ITodoItem, completed: boolean) => {
		this.pendingReqCount++;
		log('now: ', moment().format());

		// Complete todo locally for fast rendering
		this.todoList = this.todoList.map(originalTodo => {
			if (originalTodo.id === todoItem.id) {
				return { ...originalTodo, completed };
			} else return originalTodo;
		});

		// Complete todo on server
		const newTodoItem = { ...todoItem, completed };
		axiosInstance.put('/edit/completed', newTodoItem)
			.then(() => {
				this.fetchAllTodosInternal();
			})
			.catch(error => {
				log('completeTodo error: ', error);
			});
	}

	@action
	createNewTodo = (preDBTodoItem: IPreDBTodoItem) => {
		this.pendingReqCount++;

		// Add a new element locally for fast rendering
		const tempNewTodo: ITodoItem = {
			...preDBTodoItem,
			id: 0, completed: false, createdAt: moment().format()
		};
		this.todoList.push(tempNewTodo);

		// Add on server
		axiosInstance.post('/new', preDBTodoItem)
			.then(() => {
				this.fetchAllTodosInternal();
			})
			.catch(error => {
				log('createNewTodo error: ', error);
			});
	}

	editedDeadline = false;

	@action
	editTodo = (todoItem: ITodoItem, deadlineEdited: boolean) => {
		this.pendingReqCount++;

		// Edit the element locally for fast rendering
		this.todoList = this.todoList.map(originalTodo => {
			if (originalTodo.id === todoItem.id) {
				if (todoItem.deadline === undefined || todoItem.deadline === null) {
					return { ...todoItem };
				} else {
					log(`moment(deadline).format(): ${moment(todoItem.deadline).format()}, moment(deadline).format('YYYY-MM-DD HH:mm:SS'): ${moment(todoItem.deadline).format('YYYY-MM-DD HH:mm:SS')}`)
					if (deadlineEdited) {
						return { ...todoItem, deadline: moment(todoItem.deadline).format() };
					} else {
						return { ...todoItem, deadline: moment(todoItem.deadline).format() };
					}
				}
			} else return originalTodo;
		});

		// Edit on server
		axiosInstance.put('/edit/content', todoItem)
			.then(() => {
				this.fetchAllTodosInternal();
			})
			.catch(error => {
				log('editTodo error: ', error);
			});
	}
}