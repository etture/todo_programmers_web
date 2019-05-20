import { observable, action, computed } from 'mobx';
import { axiosInstance } from '../utils/axiosSettings';
import log from '../utils/devLog';

export interface IUserStore {
	userid: number,
	setUserid(uid: number): void,
	userAuthorized: boolean
};

export class UserStore implements IUserStore {
	@observable userid = 0;

	@action
	setUserid = (uid: number) => {
		this.userid = uid;
	}

	@computed
	get userAuthorized(): boolean {
		return this.userid !== 0;
	}

}