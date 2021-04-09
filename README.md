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
|문현호|-아이디어 세부조사<br>-Product Owner|-어린이집/유치원검색<br>-API정보가공|
|설경원|-Develope Leader(PM)<br>-스프린트 관련 계획관리<br>-형상관리|-로그인/로그아웃<br>-마이페이지<br>-커뮤니티 게시판<br>-리뷰페이지|

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
- xml2json-light : xml 형식을 json 형식으로 밖꿔주는 모듈 사용

## 개발 기능 

기능 분리 : header navigation를 정하고 해당 기능 구현 `추가 시 업데이트`

>  **header navigation 항목**  
- header navigation 상태
  <br>
  비로그인 상태
  <img width=100% src="https://user-images.githubusercontent.com/41010744/113551575-da001580-962f-11eb-8c17-574471bc8bec.png">
  
  로그인된 상태
  <img width=100% src="https://user-images.githubusercontent.com/41010744/113551618-ec7a4f00-962f-11eb-8202-0424a84f1454.png">
  <br>

  관리자 로그인 상태
  <img width=100% src="https://user-images.githubusercontent.com/41010744/113551693-05830000-9630-11eb-938a-7afc2d77e70d.png">
  <br>

- 메인 페이지 : 현호

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
도넛 차트 | chart.js, ajax | `구현 완료`
통계 기능 | ajax, COUNT(*) | `구현 완료`
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
`추가 개선사항 1` | `추가 시 업데이트` | `구현 중`

- 유치원/어린이집 검색 : 현호

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
어린이집 리스트 출력 | 어린이집 API, 유치원 API | `구현 완료`
검색기능| 어린이집 이름, 주소 검색, ajax 기술  | `구현 완료`
지도 | 좌표변환 API, 지도 API | `구현 완료`
페이징| 갯수, 리스트 | `구현 완료`
지도 출력 | 지도 API, 마커, 인포윈도우  | `구현 완료`
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
`추가 개선사항 1` | `추가 시 업데이트` | `구현 중`

- 리뷰페이지 : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
리뷰페이지 | checkbox, database CRUD 중 Create, Read | `구현 완료`
평점(별점) | Star Rating Plugin : Raty, JQuery 통한 데이터 요청/전달 | `구현 중`
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
`추가 개선사항 1` | `추가 시 업데이트` | `구현 중`

- 나의 유치원/어린이집 : 현호

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
정보 등록 | CREATE, SELECT | `구현 완료`
주소 찾기 | ajax, 팝업, 페이징 | `구현 완료`
이용 약관 | 팝업 | `구현 완료`
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 관리자 페이지 : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
관리자 이메일 인증 | passport, session 확인, 이외 사용자 접근 불가  | `구현완료`
가든 요청 | CRUD 중 Read, Update  | `구현완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

- 키즈맘TALK : 경원

기능명 | 주요 키워드 | 구현 상태
-------| ------- | -------
게시판 CRUD | 게시물 업로드 및 수정 및 삭제 읽기  | `구현완료`
페이징 | sequelize Offset & Limit & Join   | `구현완료`
댓글 | /:id/edit , sequelize Join, 1:N  | `구현완료`
검색 | Op.like , createSearchQuery(quries), searchType, searchText  | `구현완료`
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
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
전체적인 디자인 수정(공통) | 글씨체, 배너, background color 층 | `구현 완료`
`추가 개선사항 1`| `추가 시 업데이트` | `구현 중`

## 개발 결과

> 메인페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/113551843-4aa73200-9630-11eb-887e-4266ae520c7d.png">

> 유치원/어린이집 검색
<br>
<img src="https://user-images.githubusercontent.com/41010744/113551992-76c2b300-9630-11eb-8cf8-5d85e2f78f2e.png">

> 유치원/어린이집 정보페이지 & 작성된 리뷰 보여주는 페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/112770582-40020100-9062-11eb-822a-6060608e6fb4.png">

> 유치원/어린이집 리뷰 작성 페이지
<br>
<img src="https://user-images.githubusercontent.com/41010744/112770246-c1589400-9060-11eb-93d0-0db5f7895eca.png">

> 나의 유치원/어린이집, 주소록 팝업, 이용약관 팝업
<br>
<img src="https://user-images.githubusercontent.com/57825856/113578324-96bc9b80-965d-11eb-9d2f-b2a21852420a.png">
<br>
<img src="https://user-images.githubusercontent.com/57825856/113578946-9244b280-965e-11eb-957f-76fcc8689d03.png" style = "width : 49%; float : left; margin-top : 25px">

<img src="https://user-images.githubusercontent.com/57825856/113578587-fe72e680-965d-11eb-82fa-726156ed2751.png" style = "width : 50%;">


> 관리자 페이지 (가든 승인)
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553704-1c772180-9633-11eb-99ae-dabc76f50cd9.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553792-3e70a400-9633-11eb-9dcb-7c66e14227d6.png">
<br>


> 키즈맘TALK > 검색 및 페이징 기능

<br>
<img src="https://user-images.githubusercontent.com/41010744/113552833-b1791b00-9631-11eb-8e61-4e4e286869ff.png">


> CRUD + 댓글
<br>
<img src="https://user-images.githubusercontent.com/41010744/111615947-a8f8a600-8824-11eb-9229-26491f9670ac.png">
<br>

> 로그인 + 비밀번호 찾기 
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553070-1c2a5680-9632-11eb-9166-fe8cd007d3db.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553117-32381700-9632-11eb-84fd-7cce2a66698b.png">
<br>

> 회원가입
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553197-5a277a80-9632-11eb-9b69-cfa4418ad809.png">
<br>


> 마이페이지 (계정 설정 + 비밀번호 설정 + 회원 탈퇴)
<br>
<img src="https://user-images.githubusercontent.com/41010744/112770368-74c18880-9061-11eb-9192-ded2c4c7553d.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553401-af638c00-9632-11eb-819a-84fbb34454a7.png">
<br>
<img src="https://user-images.githubusercontent.com/41010744/113553508-d9b54980-9632-11eb-8238-47ae4a11e690.png">

## 데이터베이스 ERD

- `연도-월-일` : ERD 상태 
- `2021-03-11` : 초기 ERD
<br>
<img src="https://user-images.githubusercontent.com/41010744/111051572-6b4bf400-8497-11eb-9698-d43f54af2071.png">
<br>

- `2021-03-18` : ERD 중간 과정(user, drop, post, comment)
<br>
<img src="https://user-images.githubusercontent.com/41010744/111616124-dfcebc00-8824-11eb-8f51-5d0f7a340ea5.png">
<br>

- `2021-03-23` : ERD 중간 과정2(sidocode, sggcode, garden, review 추가)
<br>
<img src="https://user-images.githubusercontent.com/41010744/112146760-4d148f80-8c1f-11eb-919b-91b176672d93.png">
<br>

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
<br>

> `2021-03-11` : 초기 ERD 도출

> `2021-03-14` : 헤더 기능 상세 도출 > 키즈가든 검색(유치원/어린이집 찾기), 마이 키즈가든(나의 유치원/어린이집), 이벤트, 키즈톡(자유게시판), 쪽지, 마이페이지

> `2021-03-15` : 현호 > 검색 기능(지도 포함) + 페이징 기능 , 경원 > 키즈톡(게시판) + 페이징 기능 `2021-03-21` 까지 구현 예정 , ERD 중간 과정 1 도출

> `2021-03-21` : 현호 > 검색 기능 (추가) + 유치원/어린이집 정보페이지 , 경원 > 리뷰페이지, ERD 중간 과정 2 도출

> `2021-03-28` : 현호 > 메인페이지 내에 유치원/어린이집 통계 , 경원 > 저장된 리뷰페이지 형식에 맞게 출력

> `2021-03-29` : 전체적인 디자인 수정 , 글꼴 설정, 사이트 만의 컬러 정한 후 통일

> `2021-04-02` : 나의 유치원/어린이집 기능 도출 및 초기 erd 작성, 헤더 추가, cctv (실시간, 녹화) 틀 추가
<br>
- 나의 유치원/어린이집 틀, 헤더, cctv 틀
<br>
<img src="https://user-images.githubusercontent.com/41010744/113479703-81b00300-94cb-11eb-9ff8-d69bcf10cae9.jpg">
<br>
- 유치원/어린이집 설문 항목, 상세 기능
<br>
<img src="https://user-images.githubusercontent.com/41010744/113479729-a86e3980-94cb-11eb-8a6a-33eef6d90263.jpg">
<br>
- 학무모 설문 항목, erd
<br>
<img src="https://user-images.githubusercontent.com/41010744/113479763-cf2c7000-94cb-11eb-910a-71d21bab9c11.jpg">
<br>

> `2021-04-03` : 현호 > 상담(유치원/어린이집, 학부모)페이지, 경원 > 관리자 페이지(유치원/어린이집 승인)

> `2021-04-09` : 현호 > 유치원/어린이집 등록 메인 페이지 , 학부모 등록 , 경원 > 학부모 등록시 유치원/어린이집에 이메일 발송, 마이페이지(신청현황) 추가