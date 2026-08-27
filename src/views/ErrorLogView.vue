<script setup>
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()

// 오류 해결 기록 데이터
const logs = [
  {
    title: 'npm install 미실행',
    problem: '프로젝트를 새로 만든 뒤 실행하면 모듈을 찾을 수 없다는 오류 발생',
    cause: 'npm install을 하지 않음',
    fix: '프로젝트 생성 시 필요한 패키지 목록만 만들어지고 실제 파일은 없는 형태. `npm install` 을 실행해 목록에 적힌 패키지를 해당 폴더로 내려받아 해결',
  },
  {
    title: '폴더 이름에 마침표(.) 사용',
    problem: '컴포넌트 이름이 적절한 다중 단어 형식으로 인식되지 않는 오류 발생',
    cause: '폴더명을 `day1.2code` 로 만듦',
    fix: '폴더명을 `day1_2code` 로 변경. Vue ESLint의 multi-word-component-names 규칙이 마침표를 이름 구분자로 해석하면서 발생한 문제',
  },
  {
    title: 'computed 를 만들고 사용하지 않음 (변수를 사용하지 않음)',
    problem: '검색어를 입력해도 해당 기능이 수행되지 않음',
    cause: '<template>의 v-for 구문에서 원본 weatherList 변수를 보고 있었음',
    fix: '출력 대상을 변경된 filteredWeatherList로 변경. `<div v-for="item in weatherList">` → `<div v-for="item in filteredWeatherList">`',
  },
  {
    title: 'Props / Emits 이름 표기 방식 혼동',
    problem: '컴포넌트를 왔다 갔다 하며 props를 찾는데 검색해도 나오지 않음',
    cause: '<script setup>과 <template>의 이름 표기 차이',
    fix: 'JS에서는 카멜케이스(`cityItem`)를 쓰지만 템플릿 속성은 케밥케이스(`city-item`)로 쓴다는 점을 확인. 같은 이름이지만 위치에 따라 형태가 바뀐다는 것을 놓쳤던 문제',
  },
  {
    title: '존재하지 않는 CSS 파일을 style 에서 참조',
    problem: '파일명을 찾을 수 없다는 오류',
    cause: "App.vue의 <style> 블록에서 만들지 않은 파일 참조 ('@/assets/exercise.css')",
    fix: '교수님 코드를 참고하며 <style> 부분을 그대로 복사했는데 해당 CSS 파일을 아직 만들지 않은 상태였음. 파일을 생성하여 해결',
  },
  {
    title: '아직 만들지 않은 스토어 파일을 import',
    problem: 'import 경로에서 파일을 찾을 수 없다는 오류',
    cause: '코드를 한 줄씩 실행하며 확인하던 중 UnitToggler.vue에서 stores/configStore를 만들지 않은 채 실행',
    fix: 'stores 파일 생성 후 configStore를 import 하여 해결',
  },
  {
    title: '라우터 설정 파일을 잘못 불러옴',
    problem: '과제 4의 컴포넌트에 내가 만든 대시보드가 아니라 Vue 기본 안내 화면이 계속 출력됨',
    cause: '과제 설정인 index.js.exercise를 불러와야 하는데 practice 내용이 담긴 index.js를 불러오고 있었음',
    fix: 'index.js.exercise 파일의 내용을 불러들여 수정',
  },
  {
    title: 'Element-plus 미설치',
    problem: 'main.js에서 import 오류 발생',
    cause: 'hands-on 자료의 main.js에서 element-plus를 import 하는데 해당 패키지를 설치해야 하는지 모르고 실행',
    fix: 'npm install element-plus 로 해당 패키지 설치',
  },
  {
    title: 'defineProps 반환값 미할당',
    problem: 'props가 선언되지 않았다는 오류',
    cause: '`props.cityItem.temp` 를 쓰는 컴포넌트에서 defineProps()를 호출만 하고 결과를 변수에 담지 않아 props라는 이름이 없는 상태였음',
    fix: '반환값을 props에 할당해 해결. `defineProps({...})` → `const props = defineProps({...})`',
  },
]
</script>

<template>
  <div class="page">
    <header class="topbar">
      <button class="back-btn" @click="goBack">← 이전</button>
      <div class="brand">🐛 <span>오류 해결 기록</span></div>
      <nav class="nav">
        <RouterLink :to="{ name: 'Showcase' }" class="nav-link">홈</RouterLink>
        <RouterLink to="/about" class="nav-link">소개</RouterLink>
        <RouterLink to="/practice" class="nav-link">페이지 역사</RouterLink>
      </nav>
    </header>

    <ol class="log-list">
      <li v-for="(log, i) in logs" :key="i" class="log-card">
        <h3>{{ i + 1 }}. {{ log.title }}</h3>
        <p><b>문제</b> — {{ log.problem }}</p>
        <p><b>원인</b> — {{ log.cause }}</p>
        <p><b>해결</b> — {{ log.fix }}</p>
      </li>
    </ol>

    <section class="reflection">
      <h3>오류를 해결하고 느낀 점</h3>
      <p>
        전체 코드가 서로 import로 얽혀 있다 보니 어떤 순서로 파일을 만들어야 참조나 props/emits가
        헷갈리지 않을지 고민하게 되었다.
      </p>
      <p>
        지금 프로젝트는 규모가 크지도, 난이도가 높지도 않은데 기본적인 import에서 경로를 착각하거나
        아직 만들지 않은 파일을 불러오려는 오류가 반복된 점이 아쉬웠다.
      </p>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 840px;
  margin: 0 auto;
  padding: 8px 0 40px;
  color: var(--color-text);
}
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  margin-bottom: 18px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}
.back-btn {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}
.brand {
  font-size: 18px;
  font-weight: 800;
}
.nav {
  display: flex;
  gap: 14px;
  margin-left: auto;
}
.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  opacity: 0.75;
}
.nav-link:hover,
.nav-link.router-link-exact-active {
  opacity: 1;
  color: #3b82f6;
}
.log-list {
  list-style: none;
  display: grid;
  gap: 12px;
}
.log-card {
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  background: var(--color-background-soft);
  line-height: 1.7;
}
.log-card h3 {
  margin-bottom: 8px;
  font-size: 15px;
}
.log-card p {
  font-size: 14px;
}
.log-card b {
  color: #3b82f6;
}
.reflection {
  margin-top: 22px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-mute);
  line-height: 1.8;
}
.reflection h3 {
  margin-bottom: 10px;
  font-size: 15px;
}
.reflection p {
  font-size: 14px;
}
</style>
