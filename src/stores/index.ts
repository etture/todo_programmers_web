import {TodoStore} from './TodoStore';
import {StateStore} from './StateStore';
import {UserStore} from './UserStore';

export const stores = {
	todoStore: new TodoStore(),
	stateStore: new StateStore(),
	userStore: new UserStore()
};