export interface ITodoItem {
	id: number,
	title: string,
	content: string,
	createdAt: string,
	completed: boolean,
	priority?: number,
	deadline?: string
}

export interface ITodoListResponse {
	success: boolean,
	todoList: Array<ITodoItem>
}