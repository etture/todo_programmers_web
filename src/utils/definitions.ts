export interface ITodoItem {
	id: number,
	userid: number,
	title: string,
	content: string,
	createdAt: string,
	completed: boolean,
	priority: number,
	deadline?: string
};

export interface IPreDBTodoItem {
	userid: number,
	title: string,
	content: string,
	priority: number,
	deadline?: string
};

export interface ITodoListResponse {
	success: boolean,
	todoList: Array<ITodoItem>
};
