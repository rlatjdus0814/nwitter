# 김서연

## [5월 4일]

### 1. 소셜 로그인
#### 1) Provider
- 소셜 로그인 서비스 제공 업체로 비유
```java
  if(name === 'google') {
    // 구글 소셜 로그인 서비스 제공
    provider = new firebaseInstance.auth.GoogleAuthProvider();
  } else if (name === 'github') {
    // 깃허브 소셜 로그인 서비스 제공
    provider = new firebaseInstance.auth.GithubAuthProvider();
  }
```

#### 2) 소셜 로그인 완성
- signInWithPopup() : 실제 소셜 로그인 진행하는 비동기 함수
- provider를 함수 인자로 넘겨 소셜 로그인 시도
- 실행 후 팝업창에서 로그인 기능 생성 확인 가능

### 2. Navigation 컴포넌트
- 네이게이션 컴포넌트로 라우터 제어
- 컴포넌트 생성 후 Router.js 파일에 연동
#### 1) Switch
- Switch를 이용해 isLoggedIn이 true인 경우에만 Navigation이 보이도록 출력
```java
  {isLoggedIn && <Navigation />}
```
#### 2) 링크 추가
- Home 컴포넌트와 Profile 컴포넌트를 링크(<Link>)를 통해 이동 가능 
- 링크만 수정되고 실제로 컴포넌트 렌더링하지 않음
- 컴포넌트는 대문자(Profile), path에는 소문자(profile)로 구성되어 있으니 확인!
```java
  import {Link} from "react-router-dom";
  ...

  <li>
    <Link to="/">Home</Link>
  </li>
  <li>
    <Link to="/profile">My Profile</Link>
  </li> 
```

### 3. 로그아웃
- Profile.js 파일에서 로그아웃 버튼 생성
- authServise의 함수 중 SignOut 함수 실행 > 로그아웃
- 로그아웃 > IndexedDB에 있는 정보를 알아서 비우고 로그아웃 처리 > 주소 표시줄은 여전히 /profile

#### 1) Redirect로 로그아웃 후 주소 이동
- Switch 내부에 있는 Route 조건이 불충분 > Redirect가 지정한 주소로 이동
- 'from' props에 있는 값 > 조건
- 'to' props에 있는 값으로 주소 이동 
```java
  import { Redirect } from "react-router-dom";
  ...
  // 어떤 주소든(from) /루트로 변경(to)
  <Redirect from="*" to="/" />
```
- 로그아웃 버튼 클릭 후 > 주소는 여젼히(/profile) > Redirect 동작

#### 2) useHistoy로 로그아웃 후 주소 이동
- 로그아웃을 처리하는 자바스크립트 코드로 주소 이동
- 
```java
  import { useHistory } from 'react-router-dom';
  ...
  const histoy = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    histoy.push("/");
  };
```



## [4월 27일]

### 1. async await
- 비동기 처리 방식
- 코드가 간결해지고, 가독성 높아짐
- try {} catch {} 로 에러 확인 가능
```java
  const onSubmit = async(event) => { // async
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(email, password); //await 
      }
      else { 
        data = await authService.signInWithEmailAndPassword(email,password); 
      }
      console.log(data);
    } catch (error) { // try/catch로 에러 확인
      console.log(error);
    }
  }
```

### 2. setPersistence
- 로그인 상태를 지속시키는 함수
- 상태 지속을 3가지로 나눠서 관리 
> 1) local : 웹 브라우저를 종료해도 로그인 유지
    - 웹 브라우저를 종료해도 사용자의 정보를 기억하는 옵션
> 2) session : 웹 브라우저의 탭 종료 시 로그아웃
    - 기본적으로 많이 사용함
> 3) none : 새로고침하면 로그아웃 

### 3. 로그인, 로그아웃
#### 1) 로그인 후 currentUser 가 null 인 이유
- 파이어베이스에서 로그인 처리를 마치고 누이터에서 신호를 받기까지 시간이 생기는데
그 사이에 누이터가 값을 확인하면 null이 출력됨

#### 2) 딜레이 시간 확인
- 로그인 처리 완료까지 걸리는 시간 확인
```java
  setInterval(() => console.log(authService.currentUser), 2000)
```

### 4. useEffect() 함수
- 특정한 시점에 실행되는 함수
- 파이어베이스가 초기화되는 시점에 실행됨
- 두번째 인자에 중괄호({})를 작성해야 초기에 한 번만 실행됨
```java
  useEffect (() => {
    authService.onAuthStateChanged((user) => console.log(user))
  },[]);
```
### 5. 로그인, 회원가입 토글 버튼
- 로그인 여부에 따라 로그인, 회원가입이 전환되는 버튼
- 삼항연산자를 이용하여 로그인 여부 판단
```java
  const toggleAccount = () => setNewAccount((prev) => !prev);

  ...

  <span onClick={toggleAccount}>
    {newAccount ? "Sign in" : "Create Account"}
  </span>
```

### 6. 소셜 로그인
#### 1) firebaseInstance 추가
- 소셜 로그인에 필요한 provider가 없어서 firebase 전체 import하기
- firebaseInstance 이름으로 import하기


## [4월 13일]

### 1. 파이어베이스 서비스
 - 필요한 서비스를 각각 import 시켜야 사용 가능함

### 2. 파이어베이스 로그인 설정
 - Authentication > Sign-in method > 이메일/비밀번호, 구글에서 설정 후 저장
 - 이메일/비밀번호, 구글에서 데이터를 지원해줌
 - 깃허브 : 승인 콜백 복사 > 마이페이지 > Setting > Developer Settings > OAuth Apps > 'Authorization callback URL에 붙여넣기

### 3. JSX문법
  - 컴포넌트에 여러 요소가 있으면 부모 요소 하나로 감싸야 함

### 4. Auth 함수
 - class에서는 {key : value}였다면, 컴포넌트에서는 [key, function] 로 구성됨
 ``` java
  const [email, setEmail] = useState("");
  const [passowrd, setPassword] = useState("");
 ```
 - onChange 함수를 통해 input 엘리먼트의 name속성에 지정한 값을 출력함
 - onChange 함수에서 'event.target.name'으로 input 엘리먼트에서 입력한 값을 알 수 있음
 ``` java
  const onChange = (event) => {
    console.log(event.target.name)
  }

  ...

  <input name="email" type="email" placeholder="Email" required value="email" onChange={onChange} />
 ```

 ### 5. event.preventDefault();
  - submit 이벤트로 새로고침을 하는 문제 발생
  - onSubmit 함수에서 이벤트의 기본값과 새로고침 현상을 막기 위해 사용
  ``` java
    const onSubmit = (event) => {
      event.preventDefault();
    }
  ```
### 6. 삼항 연산자
  - { 조건 ? '참' : '거짓' }으로 이우어져있음
  - 새로운 account 면 'Create Account', 이미 정보가 있으면 'Log In'
  ``` java
  { newAccount ? 'Create Account' : 'Log In' }
  ```


## [4월 6일]
## 1. useState 함수 사용
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



## [3월 30일]
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


## [3월 23일]
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