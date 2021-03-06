# 김서연
## [6월 14일]
### 1. 프로필 기능 보완
- 프로필 업데이트 기능 추가
- 일반 회원가입으로 로그인해서 userObj 출력
- displayName 항목이 null이라고 되어있고, 네비게이션 화면에도 '의 Profile'로 되어있음

#### 1) 프로필 업데이트
- onChange함수를 이용해 setNewDisplayName에 input 엘리먼트의 입력값 전달
- onSubmit함수 작성 -> 실제로 프로필 업데이트 기능이 완성되지 않음
```java
  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setNewDisplayName(value); 
  }

  const onSubmit = (event) => {
    event.preventDefault();
  };

  ...

  <form onSubmit={onSubmit}>
    <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} />
  </form>
```

### 2. 프로필 실시간 업데이트
- 컴포넌트 리렌더링하는 방법으로 구현 가능
- 1) useState로 관리 중인 상태가 업데이트 되는 경우
- 2) props로 받은 요소가 업데이트 되는 경우

#### 1) refreshUser 함수 추가
- userObj는 스스로 업데이트 된 프로필 반영을 못함
- 새 프로필을 파이어베이스에서 받아 userObj에 반영
- userObj를 새로고침하는 함수
```java
  const refreshUser = () => {
    setUserObj(authService.currentUser);
  };
```

#### 2) 용량 줄이기
- 리액트는 상태나 props의 내용물이 너무 많으면 작은 변화를 제대로 인식하지 못함
- displayName을 리액트에서 인식하지 못함
- isLoggedIn 크기 줄이기 -> Boolean함수를 사용해서 userObj 여부 확인
```java
  <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
```

### 3. 코드 리팩토링
- 코드 깔끔하게 정리하기
- 컴포넌트로 나누면 재활용 가능

#### 1) Home 컴포넌트 나누기
- form 엘리먼트를 'NweetFactory.js' 컴포넌트로 나누기
- Home에서 <NweetsFactory> 컴포넌트 작성 및 엘리먼트 전달
- Home에서 불투명 처리된 함수 NweetsFatory 컴포넌트로 옮기기

### 4. 로그아웃 버그 고치기
- 새로고침을 해야 완벽한 로그아웃이 되는 버그가 생김
- 로그인/로그아웃 서비스는 authService에서 user의 상태로 userObj를 업데이트하는 방식임
```java
  setUserObj(false);
```
- isLoggdeIn 프롭스는 Boolean(userObj)에 의해 정해지므로 isLoggdeIn은 상태관리를 하지 않아도 됨


## [6월 8일]
### 1. 사진 저장 기능
#### 1) 파이어스토어 스토리지 
- 사진, 동영상 파일처럼 큰 파일을 저장했다가 필요할 때 사용 가능
- 서비스를 임포느할 때 관련 서비스를 따로 임포트 후 리액트 서버 재구동
- 파이어스토어와 다르게 문서에 아이디를 자동으로 만들지 않음
- 고유의 식별자를 만들어 스토리지에 저장해야 함

#### 2) UUID 라이브러리
- 고유 식별자를 만들어주는 라이브러리

#### 3) 스토리지에서 사진 불러오기
- response.ref.getDownloadURL() 함수 사용
- 트윗 업로드 코드를 스토리지에서 사진을 저장하는 코드보다 뒤쪽에 작성하기 
- if문 안에서 attachmentUrl을 정의하면 안됨
```java
  let attachmentUrl = "";
  if (attachment !== "") {
    const attachmentRef = storageService
      .ref()
      .child(`${userObj.uid}/${uuid4()}`);
    const response = await attachmentRef.putString(attachment, "data_url");
    attachmentUrl = await response.ref.getDownloadURL();
  }
  await dbService.collection("nweets").add({
    text: nweet,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    attachmentUrl,
  });
```

### 2. 트윗 삭제 시 스토리지에서 사진 삭제
- refFromURL() 함수를 사용해 attachmentUrl만으로 스토리지에서 해당 파일의 위치를 바로 찾아 삭제 가능
```java
  await storageService.refFromURL(nweetObj.attchmentUrl).delete();
```

### 3. 필터링한 트윗 목록 출력
- 파이어베이스에서 제공하는 함수 중 파이어베이스가 받아들일 준비가 되어 있지 않으면 사용할 수 없는 함수가 있음
- 색인 작업이 되어 있어야 orderBy 함수 사용 가능
```java
    const nweets = await dbService
      .collection("nweets")
      .where("createId", "==", userObj.uid)
      .orderBy("createAt", "asc")
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
```


## [5월 25일]
### 1. 트윗 수정 기능
#### 1) onChange 함수
- 입력할 때마다 value 인자로 키보드 값이 넘어감
- newNweet에 반영하기 때문에 입력한 텍스트가 바로 보임
```java
  <input onChange={onChange} value={newNweet} required />
```

#### 2) 파이어스토어에 입력값 반영
- 새 입력값을 반영하기 위해 form 엘리먼터 & onSubmit 함수 필요
- 문서 자체를 수정하기 때문에 'doc(...).update(...)'로 작성
- 업데이트를 하고 싶은 값을 {text:newNweet}와 같은 객체 형태로 전달해야 업데이트가 제대로 실행됨

### 2. 사진 미리보기 기능
#### 1) 파일 첨부 양식
- 파일 업로드를 위해 'type="file"' 속성을 가진 input 엘리먼트 추가
- 퍼일 이벤트의 경우 event.target.value를 사용하면 파일 경로가 출력이 되지만 보안 정책 상 실제 경로를 표시하면 안되기 때문에 상세 경로가 숨겨진 상태로 출력됨
- event.target.files와 같이 files 배열 참고
```java
  const onFileChange = (event) => {
    const { target: {files}, } =event;
    const thdFile = files[0];
  };
```
- files가 배열인 이유는 input 엘리먼트의 multiple 속성에 대비하기 위함
- 여러 개의 이미지 파일 업로드 시 배열로 파일 정보를 보여주기 위해서

#### 2) 웹 브라우저에 사진 출력
- 브라우저 API인 FileReader 사용
- new FileReader()와 같이 new 키워드와 함께 사용
- onloadend : readAsDataURL 함수에 전달한 파일이 함수로 들어간 이후의 결과값이 나온 다음 상황 감지
```java
  const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
    }
    reader.readAsDataURL(theFile);
```

#### 3. 사진 미리보기 기능
- URL을 이용하여 파이어베이스에 사진을 저장하기 전 확인하는 기능
- URL 관리를 위한 상태 필요


## [5월 18일]
### 1. 사용자 정보 전달
- 로그인한 사람의 정보를 사용하기 위해 Home, Profile, EditProfile 컴포넌트에서 필요
- 중간 역할인 AppRouter 컴포넌트로 userObj 전달
```java
  const [userObj, setUserObj] = useState(null);
  ...

  setUserObj(user);
```
- Home 컴포넌트에서 트윗을 파이어스토어에 저장하는 로직에 userObj.id도 저장하는 로직 추가 -> 트윗 작성자 구분 가능

### 2. 리액트 사용 시 주의
- 리액트에서 props는 여러 개의 컴포넌트를 거치지 않고 최소한으로 전달하기 -> 유지 보수에 좋지 않음
- 변수 이름 한 번에 알 수 있도록 직관적이게 작성 -> 추후에 많이지면 헷갈리지 않게 어울리는 이름으로 작성

### 3. 실시간 트윗 목록 보여주기
- 실시간 데이터베이스를 이용해 실시간 트윗 목록 출력
- 실시간 데이터베이스 : 데이터베이스의 변화 감지 및 파이어베이스 라이브러리 함수 실행
- async-await문 사용하지 않아도 통신 가능
#### 1) onSnapshot 함수
- onSnapshot() 함수로 실시간 데이터베이스 도입 완료
- snapshot.docs.map : 문서 스냅샷에서 원하는 값 추출 가능
- map 함수 : 순회하면서 배열을 반환하고 반환한 배열을 setNweets 함수에 전달하기 때문에 코드 효율 증가
```java
  dbService.collection("nweets").onSnapshot((snapshot) => {
    const newArray = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    setNweets(newArray);
  });
```

### 4. 트윗 삭제 기능
- 개별 트윗 출력 부분 컴포넌트로 분리

#### 1) createId와 현재 로그인한 사람의 uid 비교 후 동일한 경우에만 삭제/수정버튼 노출
```java
// Home.js
  <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
```
- isOwner가 true 일 때만 버튼 노출
```java
// Nweet.js
  {isOwner && (
    <>
      <button>Delete Nweet</button>
      <button>Edit Nweet</button>
    </>
  )}
```

#### 2) 버튼에 삭제 기능 추가
- nweetObj에 있는 문서 아이디를 이용해 트윗 삭제
- 버튼 클릭 후 '삭제하시겠습니까?'와 같은 확인 메뉴 추가
- window.confirm : '확인' 클릭 시 true, '취소' 클릭 시 false 반환
```java
  const onDeleteClick = () => {
    const ok = window.confirm("삭제하시겠습니까?");
    console.log(ok);
  }
```
- 백틱을 사용하여 변수를 편리하게 작성
- `문자$value$입니다` == "문자" + value + "입니다"
```java
  const data = await dbService.doc(`nweets/${nweetObj.id}`).delete();
```

## [5월 11일]

### 1. 파이어스토어 문서 읽어오기 : Read
- 파이어스토어의 nweets 컬렉션과 문서 읽어오기
- 문서의 경우 get() 함수 사용
- 모든 컴포넌트가 마운트가 된 후 문서들을 가져오기 : useEffect
#### 1) useEffect
- async-await문을 쓰는 함수가 useEffect에 포함되어 있을 때 별도의 함수로 생성하여 실행
```java
  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    console.log(dbNweets);
  };

  useEffect(() => { // 별도의 함수 생성
    getNweets();
  }, []);
```

#### 2) 스냄샷
- 파이어스토어의 원본을 사진 찍듯이 보내준 데이터
- 데이터를 얻기위해 forEach() 함수 사용
- document = 문서
- 문서의 수만큼 스냅샷으로 읽음
```java
  dbNweets.forEach((document) => console.log(document.data()));
```

### 2. 게시물 목록
- 파이어스토어에서 받은 데이터는 상태(state)로 관리 > 화면에 노출 가능
- 초기화 상태(state) : nweets
- 데이터 저장 함수 : forEach(), setNweets
> (potato) => [document.data(), ...potato])
> - potato에 순회 이전의 상태(state)가 넘어옴
> - potato를 전개 구문으로 다시 풀어서 새 데이터와 배열로 저장
```java
  const [nweets, setNweets] = useState([]);

  dbNweets.forEach((document) => {
    setNweets((prev) => [document.data(), ...prev]) //전개 구문
  });

  console.log(nweets);
```



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