<script setup>
import { ref, watch, computed } from 'vue';
import WeatherMockup from './components/handsOn/weatherMockup.vue';
import WeatherComposition from './components/handsOn/weatherComposition.vue';
import WeatherParent from './components/handsOn/weatherParent.vue';
import UnitToggler from './components/handsOn/UnitToggler.vue';
import ThemeToggler from './components/handsOn/ThemeToggler.vue';
import ChangeLog from './components/handsOn/ChangeLog.vue';
import { useConfigStore } from '@/stores/configStore';
import { useRoute, useRouter } from 'vue-router';

const configStore = useConfigStore();
const router = useRouter();
const route = useRoute();

// 통합/상세/404/오류기록 페이지는 연습 블록 없이 전체 화면으로 단독 렌더
const isStandalone = computed(() =>
  ['Entry', 'Showcase', 'WeatherDetail', 'NotFound', 'ErrorLog'].includes(route.name),
);

// 각 과제 헤더의 "변경 사항" 패널 토글 (같은 번호 다시 누르면 닫힘)
const openLog = ref(0);
const toggleLog = (n) => {
  openLog.value = openLog.value === n ? 0 : n;
};

const goShowcase = () => {
  router.push({ name: 'Showcase' })
}

// themeClass가 바뀔 때마다 <body>의 클래스를 교체 (immediate → 첫 렌더에도 적용)
watch(
  () => configStore.themeClass,
  (now, prev) => {
    if (prev) document.body.classList.remove(prev);
    document.body.classList.add(now);
  },
  { immediate: true },
);

// 단독 페이지일 때 <body>에 표시 → #app의 2단 그리드 해제 (base.css)
watch(
  isStandalone,
  (v) => {
    document.body.classList.toggle('standalone', v);
  },
  { immediate: true },
);
</script>

<template>
  <!-- 통합/상세 페이지: 연습 블록 숨기고 전체 화면 단독 렌더 -->
  <RouterView v-if="isStandalone" />

  <!-- 그 외: 과제 1~6 연습 블록 -->
  <template v-else>
  <div class="app-container">
    <div class="task-head">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <button class="toggle-btn" @click="toggleLog(1)">변경 사항 {{ openLog === 1 ? '▲' : '▼' }}</button>
    </div>
    <ChangeLog v-if="openLog === 1" :task="1" />
    <hr />
    <WeatherMockup />
  </div>
  <div class="app-container">
    <div class="task-head">
      <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
      <button class="toggle-btn" @click="toggleLog(2)">변경 사항 {{ openLog === 2 ? '▲' : '▼' }}</button>
    </div>
    <ChangeLog v-if="openLog === 2" :task="2" />
    <hr />
    <WeatherComposition />
  </div>
  <div class="app-container">
    <div class="task-head">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <button class="toggle-btn" @click="toggleLog(3)">변경 사항 {{ openLog === 3 ? '▲' : '▼' }}</button>
    </div>
    <ChangeLog v-if="openLog === 3" :task="3" />
    <hr />
    <WeatherParent />
  </div>
  <div class="app-container">
    <div class="task-head">
      <h1>⛅ 과제 4: 라우터적용</h1>
      <button class="toggle-btn" @click="toggleLog(4)">변경 사항 {{ openLog === 4 ? '▲' : '▼' }}</button>
    </div>
    <ChangeLog v-if="openLog === 4" :task="4" />
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/practice" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>
      <main>
        <RouterView />
        <!-- RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView-->
      </main>
    </div>
  </div>
  <div class="app-container">
    <div class="task-head">
      <h1>⛅ 과제 5: 스토어적용</h1>
      <button class="toggle-btn" @click="toggleLog(5)">변경 사항 {{ openLog === 5 ? '▲' : '▼' }}</button>
    </div>
    <ChangeLog v-if="openLog === 5" :task="5" />
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/practice" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        <UnitToggler />
        <ThemeToggler />
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>

  <div class="app-container">
    <h1>⛅ 과제 4: 페이지 이동</h1>
    <hr />
    <div class="dashboard-wrapper">
      <p>지금까지 만든 기능을 한 페이지에 모았습니다.</p>
      <button @click="goShowcase" class="showcase-btn">📋 통합 페이지로 이동</button>
    </div>
  </div>
  </template>
</template>

<style>

/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/exercise.css';

/* 과제 제목 + "변경 사항" 버튼을 한 줄에 */
.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.task-head h1 {
  margin-bottom: 0;
}
/* .toggle-btn 은 UnitToggler/ThemeToggler에 scoped라, 연습 페이지용으로 별도 정의 */
.task-head .toggle-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  background-color: #4b6584;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

/* 과제 4: 통합 페이지로 이동 - 크고 누르기 편한 버튼 */
.showcase-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 16px 32px;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.showcase-btn:hover {
  background-color: #2563eb;
}
.showcase-btn:active {
  transform: translateY(1px);
}

</style>
