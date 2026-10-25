# Go Home — 집으로 가는 꿈

꿈속을 걸으며 집으로 돌아가는 길을 찾는 몽환적인 탐험 게임 (드림코어 + PS1 감성 · 점프스케어 없음).
three.js(r160, `vendor/`에 포함) 기반 모바일 웹 게임. 아이폰 Safari / 홈 화면 앱(PWA) / 단일 HTML 파일로 실행.

## 이야기
> 마음은 아직 어린아이인데 몸은 다 커 버린 어른이, 꿈속에서 느끼는 감정들.

꿈은 어린 시절의 장소들로 이어진다. 낮아진 복도, 무릎이 땅에 닿는 그네, 발이 들어가지 않는 운동화, 허리께에 남은 키재기 눈금. 장소는 그대로인데 몸만 커 버려서 어디에도 꼭 맞지 않는다. 챕터가 깊어질수록 꿈은 점점 기묘해지고(어른의 세계에서 느끼는 낯섦), "기억의 조각"들은 집과 돌봄, 그리움을 조금씩 들려준다. 마지막 장 "집"에서 어른인 나와 아이인 나는 함께 현관문을 연다. 무섭지 않고, 따뜻하면서 조금 쓸쓸한 이야기.

| 장 | 감정 |
|---|---|
| 1 끝없는 복도 | 낯익음 — 이렇게 낮았던가 |
| 2 거울 바다 | 동심 — 물에 비친 아이의 얼굴 |
| 3 어린 시절의 방 | 크기의 어긋남 — 마음은 아직 이 방 크기 |
| 4 빈 놀이터 | 너무 커 버림 — 아무도 데리러 오지 않는 저녁 |
| 5 물빛 복도 | 반복되는 어른의 길 |
| 6 뒤집힌 거실 | 돌아온 집의 어색함 |
| 7 별 없는 정거장 | 떠남과 기다림 |
| 8 집 | 받아들임 — 둘 다 집에 돌아왔다 |

## 실행
- **단일 파일**: `dist/gohome.html` 하나만 있으면 오프라인으로 실행됩니다 (모든 이미지·음악 내장).
- **폴더 버전**: 정적 서버로 실행 (`python3 -m http.server` → `index.html`). http(s)로 열면 서비스 워커가 오프라인 캐시를 만들고, Safari 공유 → "홈 화면에 추가"로 전체 화면 앱처럼 쓸 수 있습니다.

## 조작
- 화면 왼쪽 드래그: 가상 조이스틱으로 걷기 (끝까지 밀면 빨리 걷기)
- 화면 오른쪽 드래그: 둘러보기
- 오른쪽 아래 ⤒ 버튼: 점프 (길게 누르면 조금 더 높이, PC는 Space). 떨어져도 부드럽게 페이드된 뒤 마지막 안전한 자리에서 다시 시작
- 물체·문·존재에 다가가면 저절로 "닿습니다" — 어떤 것은 다른 꿈으로 이어집니다(링크).
- ☾ 버튼: 일시정지 / 깨어나기 / 꿈 일기
- PC: WASD + 마우스 드래그, Shift 달리기

## 챕터 (8장 + 숨겨진 장면)
| # | 제목 | strangeness | 분위기 |
|---|---|---|---|
| 1 | 끝없는 복도 | 0.08 | 형광등, 실내 구름, 하늘이 열린 방 |
| 2 | 거울 바다 | 0.20 | 물 위를 걷기, 떠 있는 문, 노을 |
| 3 | 어린 시절의 방 | 0.32 | 거대한 내 방, 별빛 구름길, 창문이 하나 더 많은 집 |
| 4 | 빈 놀이터 | 0.45 | 끝나지 않는 저녁, 가만히 선 형체들, 하늘의 얼굴 |
| 5 | 물빛 복도 | 0.58 | 풀룸, 접혀서 반복되는 복도, 너무 높은 문 |
| 6 | 뒤집힌 거실 | 0.70 | 천장의 가구, 아무 데도 안 가는 문, 스스로에게 돌아오는 방 |
| 7 | 별 없는 정거장 | 0.85 | 반복되는 승강장, 얼굴 있는 달, 기다리는 사람들 |
| 8 | 집 | 1.00 | 길어지는 우리 집 복도, 얼굴 없는 가족, 진짜 현관 (엔딩) |

## 기괴함(strangeness) 시스템
챕터 파일의 `strangeness: 0..1` 하나로 엔진이 자동 적용:
- 화면: 색상 왜곡/무지개 밴드(>0.5), 렌즈 숨쉬기, 가로 흔들림 줄, 색수차·화면 일렁임 증가
- 지형: 월드 공간 버텍스 왜곡(멀수록 휘는 지평선, 높이에 따른 기울어짐, 늘어나는 비율) — 메시 사이 틈 없음
- 텍스처 교체: 0.3↑ 벽지에 점 무늬, 0.55↑ 작은 얼굴 벽지·눈 달린 별
- 자동 배치(`js/strange.js`): 아무 데도 안 가는 문, 천천히 돌아보는 형체(watcher), 하늘의 얼굴, 뒤집힌 가구, 거대한 물건
- 소리: BGM 느려짐/디튠 + 느리게 역재생되는 저역 레이어, 발소리·차임 피치 하강 (갑작스러운 큰 소리 없음)
- 글자: 자막·챕터 제목 한글 글리치, 조용하고 기묘한 속삭임 메시지
- 조절: `strange: { spots:[[x,z]], watchers, nowhere, skyfaces, flipped, giants, whispers:[...], auto:false }`

## 숨겨진 방 · 트리거 (데이터 기반)
오브젝트에 붙이는 속성만으로 만듦:
- `solid:false`인 box = 통과 가능한 가짜 벽
- `type:'zone'` = 보이지 않는 트리거. `still: 초` = 그 자리에 가만히 서 있기
- `gaze: 초` (+ `gazeY, gazeAngle, gazeDist`) = 오래 바라보기
- `warp: {x,z,yaw}` = 같은 장면 안 순간이동 (숨겨진 방은 보통 x=150~260 떨어진 곳에 `room`으로 지음)
- `room: 'id'` = 숨겨진 방 발견 기록 (메뉴 ◇ 카운터, 총합은 챕터 데이터에서 자동 계산)
- `loop: {times, dz | warp, texts}` = 불가능한 건축: N번 조용히 되돌려 보낸 뒤에야 통과
- 날짜 조건은 `mutations` 사용

## 점프 · 플랫폼 (데이터 기반)
- 물리: 중력, 코요테 타임 0.16초, 점프 입력 버퍼 0.16초, 길게 누르면 더 높이, 천천히 떨어지는 몽환적 낙하, 착지음 (`js/state.js`의 `PHYS`)
- 바닥: `floor`, `water`, 그리고 `solid` box의 윗면은 밟을 수 있음 (0.38m 이하 턱은 그냥 올라감, 그 이상은 점프)
- `type:'platform'` `{x,y,z,w,d,h, style:'cloud'|'stone'|'tile'|'wood'|'door', move:{axis:'x'|'y'|'z', amp, speed, phase}}` — 움직이는 발판은 시간의 순수 함수(멀티플레이 동기화 가능)
- 챕터 `killY`(기본 -6) 아래로 떨어지면 부드러운 리스폰
- 점프 높이 ≈ 0.75m(탭)~1.15m(길게), 걷기 점프 거리 ≈ 2.7m → 발판 간격 2m·높이차 0.7m 이하 권장
- 벽·천장 뚫기 방지: 방/복도 벽과 2.4m 이상 상자는 윗면을 밟을 수 없고, 천장에 머리가 닿으면 멈추며, 공중에서 낮은 천장 아래로 파고들 수 없음. 천장 가까운 가구 윗면도 밟을 수 없음
- 위아래로 겹친 트리거는 높이도 검사 (발판 위 오브(orb)는 그 높이에 서야 닿음)

## 소리 (iOS 대응)
- 첫 탭(터치 제스처 안에서 동기적으로) AudioContext 생성·resume + 무음 버퍼 재생
- 무음 스위치 대응: `navigator.audioSession.type = 'playback'`(iOS 16.4+) + 무음 `<audio>` 루프(오디오 세션을 playback으로 전환)
- 단일 HTML: 내장 base64를 `atob`로 직접 디코드 (file://에서 fetch 불필요), 폴더 버전은 fetch → 실패 시 XHR
- Web Audio 디코드 실패 시 HTMLAudioElement로 BGM 자동 대체 (제스처 안에서 미리 준비)
- 백그라운드 복귀/중단(interrupted) 시 자동 resume, 그래도 안 나오면 화면에 "🔈 소리 켜기" 버튼

## 기분이 바꾸는 꿈 (데이터 기반)
- 꿈이 끝날 때 찍히는 기분 그래프(고요 / 일렁임 / 익숙함 / 기묘함)가 꿈마다 쌓이고(최근 꿈일수록 가중치가 큼), 가장 강한 기분이 다음 꿈의 **같은 공간**을 다르게 보이게 함
- 고요: 옅은 색, 안개 띠, 부드러운 텍스처 · 일렁임: 물결치는 벽지, 수면 빛 무늬, 화면 일렁임 · 익숙함: 빛바랜 따뜻한 색, 얼룩·크레파스 낙서 · 기묘함: 무늬 속 눈, 색 반전, 바둑판 천장
- 텍스처는 64px 손그림 → 128px 확대 + 미세 디테일 + 15bit 색 양자화·베이어 디더 (PS1 느낌 유지)
- 기분 화면에 현재 쌓인 기분과 다음 꿈에 대한 힌트 표시
- 설정: `chapters/moods.js` (텍스처 패스, 재질 교체, 팔레트, 포스트FX) · 계산: `js/moodfx.js`

## 저장 / 불러오기
- 자동 기록(슬롯 0): 장면 진입 시 + 30초마다
- 수동 기록 1~3: 일시정지 → 기록하기 / 메뉴 → "기록 · 불러오기 · 백업"
- 백업: 코드(`GOHOME1:...`) 복사/붙여넣기 또는 .txt 파일 저장/불러오기 — 단일 HTML로 플레이할 때 기기 간 이동·백업용

## 구조
```
index.html, style.css, manifest.webmanifest, sw.js
js/
  bus.js       이벤트/메시지 버스 (모든 게임 이벤트가 지나감)
  state.js     GameState / Entity / Player(id 보유) + stepPlayer() 시뮬레이션 (렌더링과 분리)
  input.js     입력 추상화: 터치/키보드/마우스 → Command {moveX, moveY, lookX, lookY, run}
  net.js       NetAdapter 인터페이스 + LocalAdapter(현재) + REPLICATED 이벤트 목록
  render.js    three.js 렌더러: 챕터 데이터 → 씬, PS1 버텍스 스냅, 포스트FX(블룸·비네트·그레인·색수차·15bit 디더·색상 이동)
  models.js    로우폴리 절차적 모델(문, 침대, 우체통, 해파리, 고래, 양 …)
  textures.js  절차적 저해상도 텍스처
  audio.js     WebAudio (첫 탭에서 잠금 해제, 크로스페이드 BGM, 효과음)
  save.js      localStorage 저장 (꿈 일수, 해금, 방문 수, 비밀, 기분 그래프, 설정)
  main.js      게임 흐름, 링크/전환, 변이(mutation), 기분 그래프, UI
chapters/      ch1~ch8, secret 챕터 데이터 + manifest.js
js/strange.js  기괴함 레이어 / 한글 글리치 / 속삭임
assets/        생성한 이미지·아이콘·오디오(m4a/AAC)
tools/         (공개 저장소에는 미포함) make_audio.py(음악 합성), build_single.mjs(단일 HTML 빌드), test.mjs / test_jump.mjs / test_bounds.mjs(헤드리스 테스트: 챕터·저장·오디오·점프·벽 뚫기), check_links.mjs(링크 검사: 이전 챕터로 돌아가는 링크 금지), check_jumps.mjs(점프 구간 도달 검사)
```

## 새 챕터 추가하기 (엔진 수정 불필요)
1. `chapters/ch9.js` 생성 — `ch1.js`를 복사해서 수정:
   - `id, order, title, subtitle, art, music, intro[], palette{skyTop, skyMid, skyBottom, fog, fogNear, fogFar, hemi, ambient, stars, hue, sat}`
   - `spawn {x,z,yaw}`, 선택 `spawns{이름:{...}}`, `bounds [minX,minZ,maxX,maxZ]`, `next`(클리어 시 해금할 챕터), `ending`
   - `objects[]`: `floor, box, corridor, room, water, cloud, lamp` + 모델 타입(`door, bed, tv, duck, phone, house, whale, tree, pillar, swing, fish, mailbox, tallhat, jelly, moon, sun, stairs, blocks, bunny, musicbox, lamppost, sign, orb, fridge, sheep`)
   - 상호작용 속성: `text`(자막), `mood:[고요, 기묘]`, `link:{to:'ch10'|'random', spawn}` (링크는 앞 챕터로만, `random`도 앞으로만 — `node tools/check_links.mjs`), `goal:true`, `secret:'id'`, `r`(닿는 반경), `reflect`, `wander/speed`(돌아다니기)
   - `mutations[]`: `{ when:{dayMod:[n,r] | dayMin:n | chance:p}, add:[objects], palette:{}, hueDrift, text }` — 꿈 일수/방문에 따라 장면이 조금씩 변함
2. `chapters/manifest.js`에 import 한 줄 + 배열에 추가.
3. 이미지/음악이 새로 필요하면 `assets/`에 넣고 `js/assets.js`의 목록에 이름 추가 (`tools/make_audio.py`에 `ambient('ch9', ...)` 추가 가능).
4. `node tools/build_single.mjs`로 단일 HTML 재빌드, `sw.js`의 VERSION/FILES 갱신.
새 모델 타입이 필요하면 `js/models.js`의 `M` 객체에 함수 하나만 추가하면 됩니다.

## 멀티플레이 확장 지점
- **상태/렌더 분리**: `GameState`가 `players: Map<id, Player>`를 갖고, 렌더러는 상태를 읽기만 함. 원격 플레이어는 `Renderer.syncAvatars()`가 이미 `ghostfriend` 아바타로 그림.
- **입력 = 커맨드**: `stepPlayer(state, player, cmd, dt)`는 어떤 플레이어에게나 동일 — 서버 권한 시뮬레이션이나 예측/보정에 그대로 사용 가능.
- **버스 → 네트워크**: `main.js`에서 `REPLICATED`에 있는 이벤트(`player:state, scene:link, object:touch, secret:found` …)를 `net.send()`로 내보내고, `net.onMessage()`로 받은 `player:state`를 원격 Player로 적용하는 코드가 이미 연결되어 있음.
- **할 일**: `NetAdapter`를 구현한 `WebSocketAdapter`/`WebRTCAdapter`를 만들고 `main.js`의 `new LocalAdapter()`만 교체. (방 코드, 같은 꿈 공유 시드 = `S.day` 기반 rng 동기화 권장)

## 에셋 출처
모든 이미지(키아트·챕터 아트·아이콘)는 이 프로젝트를 위해 새로 생성했고, 텍스처·모델은 코드로 절차 생성, 모든 음악·효과음은 `tools/make_audio.py`로 합성한 오리지널입니다. 타이틀 화면의 "영상"은 키아트 위 켄 번즈 + 파티클 절차 애니메이션입니다.
