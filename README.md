# Val_Store
디스코드 발로란트 상점 봇

# 사용법

1. 발로란트 아이디, 비밀번호 입력
```/로그인 (아이디) (비밀번호)```
> > 발로란트 아이디 비번을 서버(암호화 합니다)에 저장합니다.

2. 상점 확인
```/상점확인 (지역) [아이디] [비번]```
> > 발로란트 서버에 접속해 일일 상점에 무엇이 떳는지 확인 합니다.

> > [아이디] [비번] 항목을 입력할 시 입력한 정보로 스킨 상점을 확인합니다.

3. 탈퇴하기
```/탈퇴```
> > 서버에 있는 정보 삭제 합니다.

4. 도움말 ```/도움말```
> > 명령어 도움말을 확인합니다.

# 사용한 라이브러리
**index.js**
```markdown
discord.js
axios
fs
ncrypt-js
```
**CreateSlashCommand.js**
```markdown
@discordjs/rest
discord-api-types/v9
@discordjs/builders
```

# 봇 초대

* 봇 초대 링크 : [Invite](https://discord.com/api/oauth2/authorize?client_id=909941322482339920&permissions=8&scope=applications.commands%20bot)

# 설치법

1. 이 레포지토리를 클론해주세요 ``git clone https://github.com/faiz36/Val_Store``


2. 사용한 라이브러리에 적혀있는 라이브러리를 설치해주세요.

3. `config.yml`에 있는 `"token", "client","server"`를 입력해주세요 (글로벌 커맨드로 등록하려면 서버 항목엔 `"null"`)로 넣어주세요.

4. cmd에 ```node .\CreateSlashCommand.js```를 입력해 슬레쉬 커맨드를 등록해주세요.

5. cmd에 ```node .```를 입력해 봇을 켜주시면 됩니다.
# TODO
- [x] /로그인 시스템을 /로그인 (아이디) (비번) (지역)에서 /로그인 (아이디) (비번)으로 바꾸기
- [x] /상점확인 시스템을 만들기
- [x] /탈퇴 시스템을 만들기(**버튼까지**)
- [x] /상점확인에 (지역) (아이디)옵션 (비번)옵션 만들어서 1회용 만들기
- [x] /로그인 시스템에 암호화 적용하기, /상점확인 시스템에 복호화 적용하기
- [x] /상점확인 시스템에 가격 추가하기
- [x] VP아이콘 만들기
- [x] 야시장 구현하기
- [x] 파일 구분하기
- [ ] 남은 기간(시간) 구현하기
