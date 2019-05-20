import {TodoStore} from './TodoStore';
import {StateStore} from './StateStore';

export const stores = {
	todoStore: new TodoStore(),
	stateStore: new StateStore()
};