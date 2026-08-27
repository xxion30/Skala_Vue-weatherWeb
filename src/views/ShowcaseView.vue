<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'

import BaseDashboardCard from '@/components/handsOn/BaseDashboardCard.vue'
import WeatherCard from '@/components/handsOn/WeatherCard.vue'
import UnitToggler from '@/components/handsOn/UnitToggler.vue'
import ThemeToggler from '@/components/handsOn/ThemeToggler.vue'

const router = useRouter()
const configStore = useConfigStore()

// ===== OpenWeatherMap 실제 데이터 =====
// 키는 .env.local 의 VITE_OWM_KEY 에서 읽음 (Vite는 VITE_ 접두어만 노출)
const API_KEY = import.meta.env.VITE_OWM_KEY

// 화면에 표시할 도시 (한글명 ↔ API 쿼리용 영문명). 여기에 추가하면 그대로 늘어남
const cities = [
  { id: 'city_01', name: '서울', query: 'Seoul' },
  { id: 'city_02', name: '인천', query: 'Incheon' },
  { id: 'city_03', name: '수원', query: 'Suwon' },
  { id: 'city_04', name: '춘천', query: 'Chuncheon' },
  { id: 'city_05', name: '강릉', query: 'Gangneung' },
  { id: 'city_06', name: '대전', query: 'Daejeon' },
  { id: 'city_07', name: '청주', query: 'Cheongju' },
  { id: 'city_08', name: '전주', query: 'Jeonju' },
  { id: 'city_09', name: '광주', query: 'Gwangju' },
  { id: 'city_10', name: '대구', query: 'Daegu' },
  { id: 'city_11', name: '울산', query: 'Ulsan' },
  { id: 'city_12', name: '부산', query: 'Busan' },
  { id: 'city_13', name: '제주', query: 'Jeju' },
]

// OWM 아이콘 코드(앞 2자리) → 이모지
const iconMap = {
  '01': '☀️', '02': '🌤️', '03': '☁️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '🌨️', '50': '🌫️',
}

const weatherList = ref([]) // 가상 데이터 대신 API 응답을 담음
const isLoading = ref(false)
const errorMsg = ref('')

const fetchWeather = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    // 3개 도시를 병렬 호출
    const responses = await Promise.all(
      cities.map((c) =>
        axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { q: `${c.query},KR`, appid: API_KEY, units: 'metric', lang: 'kr' },
        }),
      ),
    )
    // OWM JSON → 화면 템플릿이 쓰는 형태로 역매핑
    weatherList.value = responses.map((res, i) => {
      const d = res.data
      return {
        id: cities[i].id,
        name: cities[i].name,
        status: d.weather[0].description,
        icon: iconMap[d.weather[0].icon.slice(0, 2)] ?? '🌡️',
        temp: Math.round(d.main.temp),
        minTemp: Math.round(d.main.temp_min),
        maxTemp: Math.round(d.main.temp_max),
        humidity: d.main.humidity,
        wind: d.wind.speed,
      }
    })
  } catch (e) {
    console.error('🔴 날씨 API 호출 실패:', e)
    errorMsg.value = '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchWeather)

const searchQuery = ref('')
const selectedId = ref('city_01')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요')

// 과제 2: computed 필터
const filteredWeatherList = computed(() => {
  const q = searchQuery.value.trim()
  return q ? weatherList.value.filter((c) => c.name.includes(q)) : weatherList.value
})

// 과제 2: 정렬 기준 ('none' | 'tempDesc' | 'tempAsc' | 'name')
const sortBy = ref('none')

// 과제 2: 필터 결과를 다시 정렬 (computed 체이닝 · 원본 훼손 막으려 복사 후 sort)
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortBy.value === 'tempDesc') return list.sort((a, b) => b.temp - a.temp)
  if (sortBy.value === 'tempAsc') return list.sort((a, b) => a.temp - b.temp)
  if (sortBy.value === 'name') return list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})

// 대표(HERO) 도시
const heroCity = computed(() => {
  return weatherList.value.find((c) => c.id === selectedId.value) ?? weatherList.value[0]
})

// 과제 5: store 단위에 맞춘 온도 변환
const toDisplayTemp = (celsius) => {
  if (configStore.unit === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32)
  return celsius
}

// 과제 1: 엔터 검색 / ESC 비우기
const doSearch = () => {
  const found = weatherList.value.find((c) => c.name === searchQuery.value.trim())
  if (found) {
    selectedId.value = found.id
    selectedCityInfo.value = `${found.name}: ${found.status} / ${found.temp}°`
  } else {
    selectedCityInfo.value = `'${searchQuery.value}'에 해당하는 도시가 없습니다`
  }
}
const clearSearch = () => {
  searchQuery.value = ''
}

// 카드 클릭
const selectCard = (city) => {
  selectedId.value = city.id
  selectedCityInfo.value = `${city.name}이(가) 선택되었습니다.`
}

// 과제 4: programmatic navigation
const goDetail = (id) => {
  router.push({ name: 'WeatherDetail', params: { cityId: id } })
}
const goBack = () => {
  router.back() // 브라우저 히스토리상 이전 페이지로
}
const goHistory = () => {
  router.push('/practice') // 과제 1~6이 있는 페이지
}
</script>

<template>
  <div class="page">
    <!-- ===== 상단 네비게이션 (과제 5: store 토글) ===== -->
    <header class="topbar">
      <button class="back-btn" @click="goBack">← 이전</button>
      <div class="brand">
        🌦️ <span>Weather Dashboard</span>
        <em v-if="configStore.userName" class="greeting">{{ configStore.userName }}님 환영합니다</em>
      </div>
      <nav class="nav">
        <RouterLink :to="{ name: 'Showcase' }" class="nav-link">홈</RouterLink>
        <RouterLink to="/about" class="nav-link">소개</RouterLink>
        <RouterLink to="/practice" class="nav-link">페이지 역사</RouterLink>
        <RouterLink to="/errors" class="nav-link">오류 기록</RouterLink>
      </nav>
      <div class="nav-actions">
        <UnitToggler />
        <ThemeToggler />
      </div>
    </header>

    <!-- ===== 로딩 / 에러 상태 ===== -->
    <p v-if="isLoading" class="state-msg">⏳ 실시간 날씨를 불러오는 중…</p>
    <p v-else-if="errorMsg" class="state-msg error">
      {{ errorMsg }}
      <button class="primary-btn" @click="fetchWeather">다시 시도</button>
    </p>

    <!-- ===== HERO: 대표 도시 현재 날씨 ===== -->
    <section v-else-if="heroCity" class="hero">
      <div class="hero-main">
        <p class="hero-label">현재 선택된 도시</p>
        <h1 class="hero-city">{{ heroCity.name }}</h1>
        <p class="hero-status">{{ heroCity.icon }} {{ heroCity.status }}</p>
      </div>
      <div class="hero-temp">
        <span class="hero-temp-value">{{ toDisplayTemp(heroCity.temp) }}</span>
        <span class="hero-temp-unit">{{ configStore.unitSymbol }}</span>
        <p class="hero-range">
          최고 {{ toDisplayTemp(heroCity.maxTemp) }}° · 최저 {{ toDisplayTemp(heroCity.minTemp) }}°
        </p>
      </div>
      <ul class="hero-meta">
        <li><span>습도</span><strong>{{ heroCity.humidity }}%</strong></li>
        <li><span>바람</span><strong>{{ heroCity.wind }} m/s</strong></li>
        <li>
          <button class="ghost-btn" @click="goDetail(heroCity.id)">상세 보기 →</button>
        </li>
      </ul>
    </section>

    <!-- ===== 검색 (과제 1: 엔터/ESC, 과제 2: computed 필터) ===== -->
    <section class="search">
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        @keyup.enter="doSearch"
        @keyup.esc="clearSearch"
        placeholder="도시 이름 입력 후 Enter · ESC로 지우기"
      />
      <button class="primary-btn" @click="doSearch">검색</button>

      <!-- 과제 2: 정렬 (select는 v-model 사용) -->
      <select class="sort-select" v-model="sortBy">
        <option value="none">기본순</option>
        <option value="tempDesc">기온 높은순 ↓</option>
        <option value="tempAsc">기온 낮은순 ↑</option>
        <option value="name">이름순 ㄱㄴㄷ</option>
      </select>
    </section>

    <!-- ===== 도시 목록 (과제 3: named slot, 과제 4: 상세 이동) ===== -->
    <BaseDashboardCard v-if="!isLoading && !errorMsg">
      <template v-slot:header><h3>지역별 날씨 현황</h3></template>
      <template v-slot:action>{{ sortedWeatherList.length }} / {{ weatherList.length }} 도시</template>

      <div class="grid">
        <WeatherCard
          v-for="item in sortedWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="selectCard(item)"
          @click-detail="goDetail(item.id)"
        />
      </div>
      <p v-if="sortedWeatherList.length === 0" class="empty">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

      <template v-slot:footer>{{ selectedCityInfo }}</template>
    </BaseDashboardCard>

    <!-- ===== 푸터 ===== -->
    <footer class="footer">
      <button class="link-btn" @click="goHistory">← 페이지 역사 (과제 1~6) 보기</button>
      <span>Vue 과제 1~5 통합 페이지</span>
    </footer>
  </div>
</template>

<style scoped>
/* base.css의 --color-* 변수를 사용 → 다크모드 자동 적용 */
.page {
  max-width: 840px;
  margin: 0 auto;
  padding: 8px 0 40px;
  color: var(--color-text);
}

/* ---- 상단바 ---- */
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  margin-bottom: 18px;
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
.back-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.brand {
  font-size: 18px;
  font-weight: 800;
}
.brand span {
  vertical-align: middle;
}
.brand .greeting {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  color: #3b82f6;
}
.nav {
  display: flex;
  gap: 14px;
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
.nav-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ---- HERO ---- */
.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  grid-template-areas:
    'main temp'
    'meta meta';
  gap: 18px 24px;
  padding: 28px;
  margin-bottom: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.25);
}
.hero-main {
  grid-area: main;
}
.hero-label {
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 4px;
}
.hero-city {
  /* exercise.css의 전역 h1 { color: #1a252f } 를 눌러 HERO에서는 흰색 유지 */
  color: #fff;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.1;
}
.hero-status {
  margin-top: 6px;
  font-size: 16px;
  opacity: 0.95;
}
.hero-temp {
  grid-area: temp;
  text-align: right;
}
.hero-temp-value {
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
}
.hero-temp-unit {
  font-size: 24px;
  font-weight: 700;
  opacity: 0.9;
}
.hero-range {
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.85;
}
.hero-meta {
  grid-area: meta;
  list-style: none;
  display: flex;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}
.hero-meta li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}
.hero-meta li span {
  opacity: 0.8;
}
.hero-meta li:last-child {
  margin-left: auto;
  justify-content: center;
}
.ghost-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.ghost-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* ---- 검색 + 정렬 ---- */
.search {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.search input {
  flex: 1;
  min-width: 200px;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text);
}
.sort-select {
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}
.primary-btn {
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.primary-btn:hover {
  background: #2563eb;
}

/* ---- 로딩/에러 ---- */
.state-msg {
  text-align: center;
  padding: 32px 0;
  font-size: 15px;
  color: var(--color-text);
}
.state-msg.error {
  color: #ef4444;
}
.state-msg .primary-btn {
  margin-left: 10px;
  padding: 6px 14px;
}

/* ---- 목록 ---- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.empty {
  text-align: center;
  color: #ef4444;
  padding: 14px 0;
}

/* ---- 푸터 ---- */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 14px 20px;
  font-size: 13px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
}
.link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .topbar {
    flex-wrap: wrap;
  }
  .hero {
    grid-template-columns: 1fr;
    grid-template-areas: 'main' 'temp' 'meta';
    text-align: left;
  }
  .hero-temp {
    text-align: left;
  }
}
</style>
