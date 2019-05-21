# 프로그래머스 썸머코딩 2019 2차 개발과제 
## 이진우 (etture@gmail.com)
## TODO list 만들기 -- 프론트엔드
## 실행 URL: https://todo-programmers-web.firebaseapp.com

### 개발 스택
- React.js, MobX
- TypeScript
- Firebase Hosting (배포)

### 실행 방법
- `Git repo clone` 후 `npm install`
- 개발 환경에서 실행 커맨드는 `npm run start`
- 기본적으로 local API에 접근은 http://localhost:3080/api
  - 서버 포트 변경 시 `src/utils/axiosSettings.ts` 파일 내 `BASE_URL` 변수를 변경해줘야 함
- 원격 배포 시 `npm run build` 커맨드로 `/dist` 디렉토리에 배포용 빌드 컴파일

### 특징
- '현재 할 일'과 '완료된 할 일'일 두 부분으로 나뉘어져있다
- 할 일들은 '우선 순위', '마감 기한', '만든 시간'의 순서로 역순으로 정렬되어 있다
