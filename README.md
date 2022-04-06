# 김서연

[4월 6일]
## 1. useState 힘수 사용
``` java 
const [isLoggedIn, setIsLoggedIn] = useState(faluse); 
```
- 'isLoggedIn'은 단순 변수가 아닌, 관리하는 상태로 취급함
- 'setIsLoggedIn'은  변수가 아닌, 'isLoggedIn'을 변경할 때 사용하는 함수

``` java
 return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
```
- AppRouter 컴포넌트에 isLoggedIn 이름의 props 전달

``` java
const AppRouter = ({isLoggedIn}) => {}
```
- AppRouter에서 state 값을 받아 가져옴

## 2. 절대 경로 적용하기
``` java
import AppRouter from "components/Router";
```
- 현재 import문을 사용하여 상대 경로 사용
- 상대경로는 가독성이 좋지 않음
- 깔끔한 경로를 사용하기 위해 './jsconfig.json' 파일 생성
- 코드 작성 후 절대 경로로 작성하여 사용 가능 (서버 재시작)


[3월 30일]
## 1. 파이어베이스 생성
- 구글 Firebase  아이디 생성 후 새 프로젝트 클릭 > nwitter 생성
- Firebase SDK 코드 복사 후 firebase.js 파일 생성

## 2. .env 파일을 이용한 암호화
- 변수를 이용해서 암호화 가능
- 하지만 사용자로부터 완전히 보호할 수 없음 (github에는 firebase key가 보이지 않음)
- .env  파일 생성 > "REACT_APP_변수이름"으로 등록

## 3. 서버 종료 단축키
- Ctrl + C

## 4. react 용어 

### 1) props 
- 부모 컴포넌트에서 자식 컴포넌트에 값을 전달할 때 사용 (읽기 전용)

### 2) state 
- 컴포넌트 자신이 가지고 있는 값
- 클래스에서만 사용 가능

### 3) 생명 주기(Life Cycle)
- 함수형에서는 사용 불가하여 React Hook을 사용하여 구현함
- 클래스형에서는 render() 메소드로 사용 가능함

## 5. 라우저 적용하기

### 1) 라우터 
- 어떤 화면을 보여줄지 관리해줌
- 어떤 컴포넌트를 렌더링할지 결정함
- 화면을 표현하기 위한 조각

### 2) Hooks
- 함수형 컴포넌트에서 상태 관리를 하기 위해 사용함
- useState 함수의 인자로 [상태, 상태 관리 함수 이름]의 배열을 입력받음


[3월 23일]
## 1. Git 최초 설정 (사용자 이름, 이메일 설정)

### 1) 로컬 pc에서 push하기
- git config --global user.name "name"
- git config --global user.email "email@example.com"

### 2) 확인 방법
- git config --global user.name
- git config --global user.email

## 2. Github에 파일 올리기
- git add . : 변경된 파일 등록
- git commit -m "message" : 등록된 파일에 메세지 첨부
- git push origin master : 저장소로 파일, 메세지 업로드


