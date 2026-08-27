<script setup>
import {ref, computed, watch, watchEffect} from 'vue'

// 2일차 컴포넌트 파일명 국룰 표기법
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'


// 1. 1일차-1 데이터 생성(가상의 벡엔드 데이터 배열)
const weatherList = ref([
    { id: 'city_01', name: '서울', status: '구름',temp: 28, minTemp: 25, maxTemp: 32, mood: '😌 여유로워요' },
    { id: 'city_02', name: '수원', status: '비',temp: 9, minTemp: 4, maxTemp: 17, mood: '🍵 차분한 하루' },
    { id: 'city_03', name: '부산', status: '맑음',temp: 26, minTemp: 24, maxTemp: 29, mood: '✈️ 여행 가고 싶어요' }
])

// 2. 1일차-1 검색어 및 알림창 제어용 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요')

// 3. 1일차-1 알림 대행 함수
const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

//4. 1일차 -2 computed를 활용한 실시간 검색 필터링 연산기
const filteredWeatherList = computed(() => {
    // 사용자가 입력한 검색어의 앞뒤 공백을 제거합니다.
    const query = searchQuery.value.trim()

    // 검색어가 비어있다면 원본 weatherList를 그대로 보여줍니다.
    if (!query) {
        return weatherList.value
    }

    // 검색어가 포함된 도시만 칼같이 필터링하여 실시간으로 뱉어냅니다.
    return weatherList.value.filter((item) => item.name.includes(query))
})

// 5. 1일차-2 watch를 활용한 선택 도시 추적 센서
// selectedCityInfo의 문구 변화를 감시하여 후속 로그를 처리합니다.
watch(selectedCityInfo, (newInfo) => {
    console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 6. 1일차-2 watchEffect를 활용한 자동 의존성 API 로그 시뮬레이션
// 타이핑할 때마다 변하는 searchQuery를 AI CCTV처럼 자동 추적합니다.
watchEffect(() => {
    console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

</script>

<template>
    <div class = "dashboard-wrapper">
        <!-- 컴포넌트 분리전
        <section class = "search-box">
            <h3> 도시 검색</h3>
            검색 입력란
            즉각적인 입력 X
            <input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력">
            <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)" placeholder="검색할 도시 이름 입력" />
            <p>
                검색 중인 도시: <strong>{{ searchQuery }}</strong>
            </p>
        </section>
        -->

        <BaseDashboardCard>
            <template v-slot:header>
                <h3>🔍 도시 검색</h3>
            </template>
            <template v-slot:action>
                검색어: <strong>{{ searchQuery || '(없음)' }}</strong>
            </template>

            <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        </BaseDashboardCard>

        
        <!--
        <section class="list-box">
            <h3>🏙️ 지역별 날씨 현황</h3>
            <div v-for="item in filteredWeatherList" :key="item.id" class="weather-card" @click="selectedCityInfo = `${item.name}이 선택되었습니다.`">
                <h4>{{ item.name }} ({{ item.status }})</h4>
                <p>현재 기온: {{ item.temp }}°C</p>
                <p>최고 기온: {{ item.maxTemp }}°C</p>
                <p>최저 기온: {{ item.minTemp }}°C</p>
                <span v-if="item.temp >= 33" class="very-hot">🥵 밖에 나가지마! (33도 이상)</span>
                <span v-else-if="item.temp >= 28" class="hot">☀️ 여름이네~</span>
                <span v-else-if="item.temp >= 23" class="warm">🙂 따뜻하네</span>
                <span v-else-if="item.temp >= 17" class="cool">🍃 선선한 날씨</span>
                <span v-else-if="item.temp >= 10" class="chilly">🧥 쌀쌀한 계절</span>
                <span v-else class="cold">🥶 패딩 입어!</span>
                <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
            </div>
            <p v-if="filteredWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">😭 검색 결과와 일치하는 도시가 없습니다.</p>
        </section>
        -->

        
        <BaseDashboardCard>
            <template v-slot:header>
                <h3>🏙️ 지역별 날씨 현황</h3>
            </template>
            <template v-slot:action>
                {{ filteredWeatherList.length }} / {{ weatherList.length }}개
            </template>

            <WeatherCard
                v-for="item in filteredWeatherList"
                :key="item.id"
                :city-item="item"
                @select-card="(msg) => (selectedCityInfo = msg)"
                @click-detail="showDetail"
            />
            <p v-if="filteredWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">
                😭 검색 결과와 일치하는 도시가 없습니다.
            </p>

            <template v-slot:footer>
                현재 선택: {{ selectedCityInfo }}
            </template>
        </BaseDashboardCard>


        <div class="status-bar">
            {{ selectedCityInfo }}
        </div>
    </div>

</template>


<style scoped>
.dashboard-wrapper {
    width: 600px;
    margin: 0 auto;
}
</style>