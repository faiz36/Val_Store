# Val_Store
디스코드 발로란트 상점 봇

# 사용법

1. 발로란트 아이디, 비밀번호 입력(추후 업데이트 예정)
```/로그인 (아이디) (비밀번호)```
> > 발로란트 아이디 비번을 서버(~~실제론 제 컴퓨터 입니다~~)에 저장합니다.

2. 상점 확인(추후 업데이트 예정)
```/상점확인 (지역)```
> > 발로란트 서버에 접속해 일일 상점에 무엇이 떳는지 확인 합니다.

3. 탈퇴하기 (추후 업데이트 예정)
```/탈퇴```
> > 서버(~~실제론 제 컴퓨터 입니다~~)에 있는 정보 삭제 합니다

# 설치법

1. ~~```npm install requrement.txt```를 실행하여 필수 라이브러리를 다운받는다~~

2. config.env에 있는 token,client,guild를 알맞게 수정한다 token은 디스코드 봇 토큰이고 client는 봇 클라이언트 아이디, guild는 디스코드 서버 ID이다(전체용으로 할꺼면 쌍따옴표 포함하고`"null"`을 쓰세요.)

3. `node CreateSlashCommand.js`를 실행하여 슬레쉬커맨드를 등록한다
4. `node .`를 실행하여 봇을 실행한다
# TODO
- [x] /로그인 시스템을 /로그인 (아이디) (비번) (지역)에서 /로그인 (아이디) (비번)으로 바꾸기
- [x] /상점확인 시스템을 만들기
- [x] /탈퇴 시스템을 만들기(**버튼까지**)
- [x] /상점확인에 (지역) (아이디)옵션 (비번)옵션 만들어서 1회용 만들기
