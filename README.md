# WeatherWeb

해당 과제는 전체 코드를 교수님이 주신 코드를 따라가며 해당 코드가 어떻게 실행되는지 따라가고 각 과제에서 해당 배운 내용 중 1-2가지의 기능을 추가하였다. 각 수정 사항에 대해 카드 옆 변경사항에 설명하였고 과제 1-5의 추가 기능들을 모두 모아 통합페이지를 만들었다. 통합하는 과정에서 AI 코드 어시스턴트를 통해 하려했으나 병합하는 과정에 많은 시간과 알 수 없는 오류로 인해 AI 코드 제너레이터를 이용하여 병합하였다.
추가로 마지막 Code Challenge의 인풋제어 기능을 추가하였다.

오류 기록을 따로 만들어 이번 과제에서 있었던 오류들을 모아 문제-원인-해결의 구조로 정리하였다.

## 기술 스택

| 구분 | 사용 |
| --- | --- |
| 프레임워크 | Vue 3 (`<script setup>` Composition API) |
| 빌드 도구 | Vite |
| 라우팅 | vue-router |
| 상태 관리 | Pinia (`configStore`) |
| UI 라이브러리 | Element Plus (입장 페이지) |
| HTTP | axios (OpenWeatherMap API 호출) |
| 린트/포맷 | ESLint, oxlint, oxfmt |

## 실행 방법

```sh
npm install          # 패키지 설치 (최초 1회 필수)
npm run dev          # 개발 서버 (HMR)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # oxlint + eslint
```

### 환경 변수

`WeatherHomeView` / `ShowcaseView` 는 OpenWeatherMap 실시간 데이터를 사용합니다.
프로젝트 루트에 `.env.local` 을 만들고 키를 넣어 주세요. (Vite 는 `VITE_` 접두어만 노출)

```text
VITE_OWM_KEY=발급받은_API_키
```

## 라우트 구성 (`src/router/index.js`)

| path | name | 화면 |
| --- | --- | --- |
| `/` | Entry | `EntryView` — 이름/약관 동의 입장 폼 |
| `/practice` | WeatherHome | `WeatherHomeView` — 과제 1~5 연습 블록 모음 |
| `/about` | WeatherAbout | `WeatherAboutView` |
| `/weather/:cityId` | WeatherDetail | `WeatherDetailView` — 도시 상세 |
| `/showcase` | Showcase | `ShowcaseView` — 전체 기능 통합 페이지 |
| `/errors` | ErrorLog | `ErrorLogView` — 오류 해결 기록 |
| `/:pathMatch(.*)*` | NotFound | `NotFoundView` |

## 주요 파일

```text
src/
├─ App.vue                         # 과제 1~5 연습 블록 + <body> 테마 클래스 교체
├─ router/index.js                 # 라우트 정의
├─ stores/configStore.js           # 온도 단위 / 다크모드 / 사용자 이름
├─ views/
│  ├─ EntryView.vue                # 입장 폼 (el-card / el-input / el-switch / el-button)
│  ├─ ShowcaseView.vue             # 과제 1~5 기능 통합 (실시간 API)
│  └─ ...
└─ components/handsOn/
   ├─ weatherMockup.vue            # 과제 1: 엔터 검색 / ESC 초기화
   ├─ weatherComposition.vue       # 과제 2: computed 체이닝 정렬
   ├─ weatherParent.vue            # 과제 3: named slot
   ├─ BaseDashboardCard.vue        # 과제 3: header / action / footer / 기본 슬롯
   └─ ThemeToggler.vue             # 과제 5: 테마 토글 버튼
```

## 기능 추가

### 과제 1 — `weatherMockup.vue`

`doSearch`, `clearSearch` 를 구현했다.

- **Enter** 를 누르면 검색이 실행되어 하단 상태 바에 입력한 도시와 해당 날씨가 표시된다.
- **ESC** 를 누르면 입력창이 전체 초기화된다.

```vue
<input
  type="text"
  :value="searchQuery"
  @input="(e) => (searchQuery = e.target.value)"
  @keyup.enter="doSearch"
  @keyup.esc="clearSearch"
/>
```

```js
const doSearch = () => {
  const found = weatherList.value.find((item) => item.name === searchQuery.value.trim())
  selectedCityInfo.value = found
    ? `${found.name}의 현재 날씨는 [${found.status}] / ${found.temp}°C 입니다.`
    : `'${searchQuery.value}'에 해당하는 도시가 없습니다.`
}

const clearSearch = () => {
  searchQuery.value = ''
}
```

### 과제 2 — `weatherComposition.vue`

드롭다운으로 카드 순서를 정렬하는 기능을 추가했다.
**기온 높은순 / 기온 낮은순 / 도시 이름순** 으로 정렬한다.

정렬만 생각했는데 만들다 보니 **computed → computed 체이닝 구조**가 나왔다.
(`filteredWeatherList` → `sortedWeatherList`)

```js
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value] // sort는 원본을 훼손하므로 복사 후 정렬
  if (sortBy.value === 'tempDesc') return list.sort((a, b) => b.temp - a.temp)
  if (sortBy.value === 'tempAsc')  return list.sort((a, b) => a.temp - b.temp)
  if (sortBy.value === 'name')     return list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})
```

#### Q. Vue 의 computed 는 기본이 lazy 하다. lazy 하다는 타이밍은 언제인가?

> "계산을 하고 있다가 호출을 늦게 한다" vs
> "호출이 있을 때까지 계산을 안 하고 있다가, 호출되어 출력될 때 계산한다"

**A. 후자가 맞다.** 의존 값이 바뀌면 computed 는 *더티(dirty)* 표시만 해 두고
실제 계산은 미루며, 그 값이 실제로 **읽힐 때(호출될 때)** 비로소 다시 계산한다.
공식 문서의 `count.value++` 예시도 결과 값을 읽는 시점에 재계산이 일어난다.

### 과제 3 — 여러 개의 named slot

"named slot 에서 slot 여러 개를 쓰려면?" → **`name` 만 바꾸면 계속 늘릴 수 있다.**
이번 과제에서 이 구조를 실제로 사용했다.

| 부모 (`weatherParent.vue`) | 자식 (`BaseDashboardCard.vue`) |
| --- | --- |
| `<template v-slot:header>` | `<slot name="header">` |
| `<template v-slot:action>` | `<slot name="action">` |
| `<template v-slot:footer>` | `<slot name="footer">` |
| (template 없이 둔 내용) | `<slot>` (기본 슬롯) |

#### Q. 컴포넌트가 너무 많고 props/emits 가 서로 참조하다 보니 어디서부터 손대야 할지 모르겠다. 실무에서는 컴포넌트 순서를 어떻게 잡나?

**A.**

1. 먼저 화면을 만든다.
2. 화면을 영역으로 나눈다.
3. 반복되거나 역할이 명확한 것을 컴포넌트로 나눈다.
4. 나눈 컴포넌트를 각 사람에게 던져서 만들게 한다.

이 과정을 **아키텍트가 나눠서 제공**해 준다.

### 과제 4 — `useRouter()` Programmatic Navigation

과제 5(통합 페이지)로 이동하는 기능을 `useRouter()` 로 추가했다.

```js
// router/index.js
{
  path: '/showcase',
  name: 'Showcase',
  component: () => import('@/views/ShowcaseView.vue'),
}
```

```js
const router = useRouter()
const goShowcase = () => router.push({ name: 'Showcase' })
```

### 과제 5 — 화면 테마 변경 (라이트/다크 모드)

**`configStore.js`** — `state / getters / actions` 3단 구조

```js
const isDark = ref(false)                                                      // state
const themeClass = computed(() => (isDark.value ? 'theme-dark' : 'theme-light')) // getters
function toggleTheme() { isDark.value = !isDark.value }                          // actions
```

**`ThemeToggler.vue`** — 클릭하면 `configStore.toggleTheme()` 를 호출해 테마를 스위칭하고
`themeClass` 가 재설정되게 한다.

**`App.vue`** — `store.themeClass` 를 `<body>` 의 class 로 옮긴다.

```js
watch(
  () => configStore.themeClass,
  (now, prev) => {
    if (prev) document.body.classList.remove(prev)
    document.body.classList.add(now)
  },
  { immediate: true },
)
```

**`base.css`** — 해당 클래스에 반응하는 CSS 변수 정의.

### 추가 — `EntryView.vue` 입장 페이지

Element Plus 컴포넌트로 입장 폼을 구성했다.

- `<el-card>` `v-slot` 으로 입장 폼 전체를 감싸는 카드
- `<el-input>` 이름 입력창 — `entryForm.name` 양방향 바인딩
- `<el-switch>` 동의 스위치 — `entryForm.agree` 양방향 바인딩
- `<el-button>` 날씨 웹사이트 입장 버튼

흐름:

```text
라우터가 '/' → EntryView.vue 매칭
 → <el-input> v-model=entryForm.name, <el-switch> v-model=entryForm.agree 로 폼 갱신
 → <el-button> @click="handleEnter" / <el-input> @keyup.enter="handleEnter"
 → handleEnter() 내부에서 순차 검증 (이름 입력 → 2글자 이상 → 약관 동의)
 → 통과 시 configStore.setUserName(name) 저장 후 router.push({ name: 'Showcase' })
```

## 오류 해결 기록

### 1. `npm install` 미실행

- **문제** — 프로젝트를 새로 만든 뒤 실행하면 모듈을 찾을 수 없다는 오류 발생
- **원인** — `npm install` 을 하지 않음
- **해결** — 프로젝트 생성 시엔 필요한 패키지 *목록*만 만들어지고 실제 파일은 없는 상태.
  `npm install` 로 목록에 적힌 패키지를 폴더에 내려받아 해결

### 2. 폴더 이름에 마침표(`.`) 사용

- **문제** — 컴포넌트 이름이 적절한 다중 단어 형식으로 인식되지 않는 오류 발생
- **원인** — 폴더명을 `day1.2code` 로 만듦
- **해결** — 폴더명을 `day1_2code` 로 변경.
  Vue ESLint 의 `multi-word-component-names` 규칙이 마침표를 이름 구분자로 해석하면서 발생

### 3. computed 를 만들고 사용하지 않음 (변수를 안 바꿈)

- **문제** — 검색어를 입력해도 필터링이 동작하지 않음
- **원인** — `<template>` 의 `v-for` 가 여전히 원본 `weatherList` 를 보고 있었음
- **해결** — 출력 대상을 `filteredWeatherList` 로 변경

```diff
- <div v-for="item in weatherList">
+ <div v-for="item in filteredWeatherList">
```

### 4. Props / Emits 이름 표기 방식 혼동

- **문제** — 컴포넌트를 오가며 props 를 찾는데 검색해도 안 나옴
- **원인** — `<script setup>` 과 `<template>` 의 표기 차이
- **해결** — JS 에서는 카멜케이스(`cityItem`), 템플릿 속성은 케밥케이스(`city-item`).
  같은 이름이지만 위치에 따라 형태가 바뀐다는 점을 놓쳤음

### 5. 존재하지 않는 CSS 파일을 `<style>` 에서 참조

- **문제** — 파일명을 찾을 수 없다는 오류
- **원인** — `App.vue` 의 `<style>` 에서 만들지 않은 파일 참조 (`@/assets/exercise.css`)
- **해결** — 교수님 코드를 참고하며 `<style>` 을 그대로 복사했는데 해당 CSS 파일을
  아직 안 만든 상태였음. 파일을 생성하여 해결

### 6. 아직 만들지 않은 스토어 파일을 import

- **문제** — import 경로에서 파일을 찾을 수 없다는 오류
- **원인** — 한 줄씩 실행하며 확인하던 중 `UnitToggler.vue` 에서 `stores/configStore` 를
  만들지 않은 채 import
- **해결** — `stores/configStore.js` 생성 후 import 하여 해결

### 7. 라우터 설정 파일을 잘못 불러옴

- **문제** — 과제 4 컴포넌트에 내가 만든 대시보드 대신 Vue 기본 안내 화면이 계속 출력됨
- **원인** — 과제 설정인 `index.js.exercise` 를 불러와야 하는데 practice 내용이 담긴
  `index.js` 를 불러오고 있었음
- **해결** — `index.js.exercise` 파일의 내용을 불러들여 수정

### 8. Element Plus 미설치

- **문제** — `main.js` 에서 import 오류 발생
- **원인** — hands-on 자료의 `main.js` 가 element-plus 를 import 하는데, 설치가
  필요한지 모르고 실행
- **해결** — `npm install element-plus`

### 9. `defineProps` 반환값 미할당

- **문제** — props 가 선언되지 않았다는 오류
- **원인** — `const rawTemp = props.cityItem.temp` 를 쓰는 컴포넌트에서 `defineProps()` 를
  호출만 하고 결과를 변수에 담지 않아 `props` 라는 이름이 없는 상태
- **해결** — 반환값을 `props` 에 할당

```diff
- defineProps({
+ const props = defineProps({
    cityItem: { type: Object, required: true },
  })
```

### 오류를 해결하고 느낀 점

전체 코드가 서로 import 로 얽혀 있다 보니, 어떤 순서로 파일을 만들어야 참조나
props/emits 가 헷갈리지 않을지 고민하게 되었다.
지금 프로젝트는 규모가 크지도, 난이도가 높지도 않은데 기본적인 import 경로를 착각하거나
아직 만들지 않은 파일을 불러오려는 오류가 반복된 점이 아쉬웠다.
