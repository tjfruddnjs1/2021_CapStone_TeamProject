# 2021_CapStone_TeamProject

## 프로젝트 명 : 키즈가든(kidsGarden)

> 프로젝트 주제 : 아동학대 방지를 위한 어린이집 리뷰 및 실시간 CCTV영상 제공 서비스

- 어린이집 리뷰 제공을 통해 실제 어린이집 구성원으로부터 얻을 수 있는 정확한 정보를 공유할 수 있도록 환경 조성
- 네트워크를 통한 실시간 CCTV를 제공하여 보호자가 언제든지 원생의 상태를 파악할 수 있음

> 프로젝트 팀원 및 역할

### Contributor

[<img alt="tjfruddnjs1" src="https://avatars.githubusercontent.com/u/41010744?v=4" width="110">](https://github.com/tjfruddnjs1) |[<img alt="unn04012" src="https://avatars.githubusercontent.com/u/57825856?v=4&s=11" width="110">](https://github.com/unn04012) |[<img alt="IOUIOU50" src="https://avatars.githubusercontent.com/u/57579709?v=4&s=117" width="110">](https://github.com/IOUIOU50) |
:---:|:---:|:---:| 
[tjfruddnjs1](https://github.com/tjfruddnjs1)|[unn04012](https://github.com/unn04012)|[IOUIOU50](https://github.com/IOUIOU50)|

### 역할


|이름|프로젝트관리 파트|서비스개발 파트|
|:---:|:---|:---|
|임종묵|-Scrum Master <br> -프로젝트 문서 관리 <br> -프로젝트 수행 관련 각종 신청|-CCTV 연동<br>-CCTV열람 페이지|
|문현호|-아이디어 세부조사<br>-Product Owner|-리뷰페이지<br>-어린이집/유치원검색<br>-API정보가공|
|설경원|-Develope Leader(PM)<br>-스프린트 관련 계획관리<br>-형상관리|-로그인/로그아웃<br>-마이페이지<br>-커뮤니티 게시판|

## 목차

- [템플릿,언어,프레임워크,모듈](#템플릿,-언어,-프레임워크-&-모듈)
- [개발 기능](#개발-기능)
- [개발 결과](#개발-결과)
- [데이터베이스 ERD](#데이터베이스-ERD)
- [개발 규칙](#개발-규칙)
- [회의록 요약](#회의록-요약)

## 템플릿, 언어, 프레임워크 & 모듈

> 템플릿

- https://www.free-css.com/free-css-templates/page261/yeinydd
- HTML + CSS + JavaScript & JQuery

> 언어

- Front End : HTML(EJS) + CSS + JavaScript
- Back End : Node JS

> 프레임워크 및 모듈(미들웨어) `추가 시 업데이트`

- Express : 내부에 http 모듈이 내장되어 서버 역할을 해주는 모듈
  - static : Express 내부에 내장되어 정적인 파일들을 제공하는 라우터 역할, 프로젝트에서 `public`폴더로 지정
  - body-parser : 요청의 본문에 있는 데이터를 해석하여 req.body 객체로 만들어주는 미들웨어, **Express 4.16.0**부터 내장되어 사용
  - express-session : 세션 관리용 미들웨어, 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장할때 유용 > 사용자별로 req.session 객체 안에 유지
- Sequelize : DataBase(MySQl, Maria DB 등)을 Node에서 쉽게 할 수 있도록 돕는 라이브러리
  - Sequelize-cli : 시퀄라이즈 명령어를 실행하기 위한 패키지
- Passport : 로그인을 구현하기 위해 세션과 쿠키 처리등 복잡한 작업을 위한 검증된 모듈
  - Passport-local : 로컬 로그인을 위한
  - Passport-kakao : 카카오 로그인을 위한
  - Passport-naver : 네이버 로그인을 위한
- bcrypt : 비밀번호를 암호화(hash)하기 위해 사용
- dotenv : `.env`파일로 유출되면 안되는 비밀키를 관리
- ejs : `embedded javascript templating`, HTML markup과 함께 자바스크립트 코드를 사용하여 서버와 클라이언트 간 데이터 상호작용을 편리하게 해줌
- multer : 이미지, 동영상 등을 비롯한 여러 파일들을 `멀티파트(multipart/form-data)` 형식으로 업로드할 때 사용하는 미들웨어
- nodemon : 소스 코드가 바뀔 때마다 노드를 재실행
- morgan : 사용시 기존 로그외에 추가적인 로그를 확인 가능 > [HTTP 메서드] [주소] [HTTP 상태 코드] [응답 속도]- [응답 바이트] > 요청과 응답을 한눈에 볼수 있어 편리  
- nodemailer : 회원가입/비밀번호 찾기 기능에 이메일 정보 인증을 위한 모듈 사용
- twilio : 마이페이지 > 핸드폰인증을 위한 모듈
- **[package.json](https://github.com/tjfruddnjs1/2021_CapStone_TeamProject/blob/main/package.json)** : 사용 모듈(미들웨어) json 파일
- axios : Promise를 사용하는 HTTP 비동기 통신 모듈로 공공 api와 통신하기 위함

## 개발 기능 

기능 분리 : header navigation를 정하고 해당 기능 구현 `추가 시 업데이트`

>  **header navigation 항목**  
- `연도-월-일` : header navigation 상태 & 이미지
- `2021-03-09` : header navigation 상태
  <br>
  비로그인 상태
  <img width=100% src="https://user-images.githubusercontent.com/41010744/111044832-35eed880-848e-11eb-882c-333a730962cc.png">
  
  로그인된 상태
  <img width=100% src="https://user-images.githubusercontent.com/41010744/111044963-f4126200-848e-11eb-8f6a-cd2595d0f4cf.png">
  <br>

- `2021-03-14` : header naviagtion 상태
  <br>
  <img width=100% src="https://user-images.githubusercontent.com/41010744/111051999-997f0300-849a-11eb-988b-aae6eb1c00f5.png">
  <br>

- `2021-03-18` : header navigation 상태
  <br>
  <img width=100% src="https://user-images.githubusercontent.com/41010744/111613555-fc1d2980-8821-11eb-93e0-30963a8ee42e.png">
  <br>

- 유치원/어린이집 검색 : 현호

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
어린이집 리스트 출력 | 공공 api | `구현 완료`
검색기능| 어린이집 이름 | `구현 중`
지도 | 위도, 경도 | `구현 중`
페이징| 갯수, 리스트 | `구현 중`
`추가 개선사항 1` | `추가 시 업데이트` | `구현 중`

- 나의 유치원/어린이집

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 키즈맘TALK : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
게시판 CRUD | 게시물 업로드 및 수정 및 삭제 읽기  | `구현완료`
페이징 | sequelize Offset & Limit & Join   | `구현완료`
댓글 | /:id/edit , sequelize Join, 1:N  | `구현완료`
검색 | Op.like , createSearchQuery(quries), searchType, searchText  | `구현완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 로그인 : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
헤더 변경 | 로그인 상태라면 헤더 로그인 → 마이페이지 | `구현 완료`
local login | passport , session 유지, database CRUD 중 Read, 비밀번호(hash) 비교 | `구현 완료`
kakaotalk login | passport-kakao, session 유지, database CRUD 중 Read  | `구현 완료`
naver login | passport-naver, session 유지, database CRUD 중 Read | `구현 완료`
비밀번호 찾기 | nodemailer(gmail) , 이메일 인증키(env), database CRUD 중 Read & Update | `구현 완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 회원가입 : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
이메일 인증번호 전송| nodemailer(gmail), 이메일 인증키(env), 클라이언트 ↔ 서버 간의 난수 비교  | `구현완료`
local 회원가입 | passport-local, database CRUD 중 Create, 비밀번호(hash) 전송  | `구현 완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 마이페이지 : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
로그아웃 | session 소멸, 로그아웃 전에는 session 유지 , session.destroy() | `구현 완료`
이미지 첨부 및 미리보기 | multer, req.file.path , fs , accept="image/*", database CRUD 중 Create, Read, Upadate | `구현 완료`
핸드폰 인증하기 | twilio,  Token, 난수 생성 | `구현 완료`
비밀번호 변경하기 | database CRUD 중 Read & Update , brycpt(hash 비교 및 저장) | `구현 완료`
회원 탈퇴 | database CRUD 중 Create & Delete | `구현 완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

## 개발 결과

- 메인페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051642-0644ce00-8498-11eb-8e12-76d20115bb81.png">
<img width=70% src="https://user-images.githubusercontent.com/41010744/111051653-26748d00-8498-11eb-858d-e7df16f747d4.png">

- 유치원/어린이집 검색
<br/>
<img src = "https://user-images.githubusercontent.com/57825856/111155455-d270c200-85d7-11eb-95d1-9e467c9c81fe.png">

- 나의 유치원/어린이집


- 키즈맘TALK

> 게시판 index
<br>
<img src="https://user-images.githubusercontent.com/41010744/111614869-74381f00-8823-11eb-8777-ed3742f824a0.png">
<br>

> 페이징
<br>
<img src="https://user-images.githubusercontent.com/41010744/111615332-f1fc2a80-8823-11eb-8170-7af9af2f3b1f.png">
<br>

> 검색 결과
<br>
<img src="https://user-images.githubusercontent.com/41010744/111614984-95007480-8823-11eb-9801-8ab1471361ab.png">
<br>

> CRUD + 댓글
<img src="https://user-images.githubusercontent.com/41010744/111615947-a8f8a600-8824-11eb-9229-26491f9670ac.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/111615591-456e7880-8824-11eb-9ef2-697699607230.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/111615629-50c1a400-8824-11eb-8f24-9129142f9378.png">
<br>

로그인
<br>
<img src="https://user-images.githubusercontent.com/41010744/111050670-61bf8d80-8491-11eb-81e2-9c62e5bddadc.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/111050746-ce3a8c80-8491-11eb-8f1b-d52e85c8eb65.png">

- 회원가입
<br>
<img src="https://user-images.githubusercontent.com/41010744/111050767-ef02e200-8491-11eb-850d-60ff715cf0e8.png">

- 마이페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/111050851-65074900-8492-11eb-8fed-44e7734171c1.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/111050993-45bceb80-8493-11eb-9831-0927677df228.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051001-53727100-8493-11eb-93fb-892e3541c5eb.png">
<br>

## 데이터베이스 ERD

- `연도-월-일` : ERD 상태 
- `2021-03-11` : 초기 ERD
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051572-6b4bf400-8497-11eb-9698-d43f54af2071.png">
<br>

- `2021-03-18` : ERD 중간 과정(user, drop, post, comment)
<br>
<img src="https://user-images.githubusercontent.com/41010744/111616124-dfcebc00-8824-11eb-8f51-5d0f7a340ea5.png">

## 개발 규칙

> Github Commit 규칙 및 README.md 작성 

- `각자의 branch 사용`
  - 각자의 기능을 branch 별로 만들어 master branch에 merge시 pull request
  - request 내용은 `commit 규칙`과 동일
- `Commit 규칙` : [기능명] Commit 내용
- ex. [로그인] 로그아웃 기능 오류 수정
- `README.md작성 규칙`
  - 작성법 : 자신이 맡은 기능에 관련한 `설명,사진` 작성
  - 요청 사항 : 이후 회의에서 이야기 해볼만한 사항들이 있다면 상대방이 작성한 부분에 ` ` 을 통해 작성 > 회의후 삭제
  - 작성 기간 : 다음 회의 이전 자신이 구현한 부분에 관해 작성 완료
  - `README.md Commit 규칙` : [README.md] [기능명] Commit 내용

## 회의록 요약
> 회의 내용 중 개발 관련 내용 요약

> `2021-03-07` : 로고 필요, 기능 도출 → 로그인, 회원가입, 로그아웃, 마이페이지, 유치원 인증 방식, 학부모 인증 방식 

> `2021-03-09` : 메인페이지, cctv 열람 권한, 유치원 검색, 나의 유치원 기능 상세 기능
<br>
- 메인 페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051479-a00b7b80-8496-11eb-81ae-845395bc59af.png">
<br>
- cctv 열람 권한
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051491-c16c6780-8496-11eb-918b-b10a7c3d1afc.png">
<br>
- 유치원 검색, 나의 유치원 기능 상세 기능
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051519-fa0c4100-8496-11eb-98ea-7a37ce050c2d.png">

> `2021-03-11` : 초기 ERD 
<br>
- 초기 ERD
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051572-6b4bf400-8497-11eb-9698-d43f54af2071.png">

> `2021-03-14` : 헤더 기능 상세 도출 > 키즈가든 검색(유치원/어린이집 찾기), 마이 키즈가든(나의 유치원/어린이집), 이벤트, 키즈톡(자유게시판), 쪽지, 마이페이지

> `2021-03-15` : 현호 > 검색 기능(지도 포함) + 페이징 기능 , 경원 > 키즈톡(게시판) + 페이징 기능 `2021-03-21` 까지 구현 예정