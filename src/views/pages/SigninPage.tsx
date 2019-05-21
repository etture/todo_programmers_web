import React, { Component } from 'react';
import { axiosInstance } from '../../utils/axiosConfig';
import log from '../../utils/devLog';
import { inject, observer } from 'mobx-react';
import { ITodoStore } from '../../stores/TodoStore';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

interface ISigninPageProps extends RouteComponentProps<{}> {
	todoStore?: ITodoStore
}
interface ISigninPageState {
	nickname: string,
	password: string,
	nicknameError: boolean,
	passwordError: boolean,
	errorMessage: string
}

@inject('todoStore')
@observer
class SigninPage extends Component<ISigninPageProps, ISigninPageState> {
	constructor(props: ISigninPageProps) {
		super(props);
		this.state = {
			nickname: '',
			password: '',
			nicknameError: false,
			passwordError: false,
			errorMessage: ''
		};
	}

	handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ nickname: e.target.value });
	}

	handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ password: e.target.value });
	}

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		axiosInstance.post('/auth/signin', { nickname: this.state.nickname, password: this.state.password })
			.then((result) => {
				log('signin result: ', result.data.success, result.data.userId);
				if (result.data.success) {
					this.props.todoStore!.setUser(result.data.userId, result.data.nickname);
					localStorage.setItem('todo_userid', result.data.userId);
					localStorage.setItem('todo_nickname', result.data.nickname);
					this.props.history.push('/todo');
				} else {
					if (result.data.target === 'nickname') {
						this.setState({ nicknameError: true, passwordError: false });
					} else if (result.data.target === 'password') {
						this.setState({ passwordError: true, nicknameError: false });
					} else {
						this.setState({ nicknameError: true, passwordError: true });
					}
					this.setState({ errorMessage: result.data.errorMessage });
				}
			})
			.catch(error => {
				log('signin error: ', error);
			});
	}

	nicknameErrorMessage = () => {
		if (this.state.nicknameError) {
			return (
				<div className={`alert alert-danger p-1 mt-2`}>{this.state.errorMessage}</div>
			);
		} else {
			return (<div></div>)
		}
	}

	passwordErrorMessage = () => {
		if (this.state.passwordError) {
			return (
				<div className={`alert alert-danger p-1 mt-2`}>{this.state.errorMessage}</div>
			);
		} else {
			return (<div></div>)
		}
	}

	render() {
		return (
			<div className="container mt-5 col-6">
				<div className="card">
					<div className="card-header">
						<h4 className="d-flex align-content-center">TODO 로그인</h4>
					</div>
					<div className="card-body">
						<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
							<div className="form-group">
								<label htmlFor="nickname">닉네임</label>
								<input id="nickname" className="form-control"
									type="text" placeholder="닉네임"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleNickname(e)}
								/>
								{this.nicknameErrorMessage()}
							</div>
							<div className="form-group">
								<label htmlFor="pwd">비밀번호</label>
								<input id="pwd" className="form-control"
									type="password" placeholder="비밀번호"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handlePassword(e)}
								/>
								{this.passwordErrorMessage()}
							</div>
							<button type="submit" className="btn btn-primary">로그인</button>
							<Link className="ml-3" to='/auth/signup'>회원가입</Link>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(SigninPage);