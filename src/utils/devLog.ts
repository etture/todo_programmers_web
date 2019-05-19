/**
 * NODE_ENV가 'development'일때만 로그가 찍히도록 하는 로그 코드
 */

const log = (...msgs: any) => {
	if(process.env.NODE_ENV === 'development') console.log(...msgs)
}

export default log;