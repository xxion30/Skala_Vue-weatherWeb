<script setup>
import {ref, computed, watch, watchEffect} from 'vue'

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

// 7. 1일차-2 정렬 기준을 저장하는 반응형 상태
// 'none'(기본순) | 'tempDesc'(높은순) | 'tempAsc'(낮은순) | 'name'(가나다순)
const sortBy = ref('none')

// 8. 1일차-2 computed 체이닝 - 필터링된 결과를 다시 정렬하는 연산기
const sortedWeatherList = computed(() => {
    // sort()는 원본 배열을 직접 뒤섞기 때문에 반드시 복사본을 만든 뒤 정렬합니다.
    const list = [...filteredWeatherList.value]

    if (sortBy.value === 'tempDesc') {
        return list.sort((a, b) => b.temp - a.temp)
    }
    if (sortBy.value === 'tempAsc') {
        return list.sort((a, b) => a.temp - b.temp)
    }
    if (sortBy.value === 'name') {
        return list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
})

// 9. 1일차-2 Multi-Source Watch - 검색어와 정렬 기준을 한 번에 감시
watch([searchQuery, sortBy], ([newQuery, newSort], [oldQuery, oldSort]) => {
    console.log(`🔍 [멀티 감시] 검색어 '${oldQuery}'→'${newQuery}' / 정렬 '${oldSort}'→'${newSort}'`)
})

</script>

<template>
    <div class = "dashboard-wrapper">
        <section class = "search-box">
            <h3> 도시 검색</h3>
            <!-- 검색 입력란 -->
            <!-- 즉각적인 입력 X-->
            <!--<input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력"> -->
            <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)" placeholder="검색할 도시 이름 입력" />
            <p>
                검색 중인 도시: <strong>{{ searchQuery }}</strong>
            </p>
        </section>

        <!-- 추가기능: 정렬 기능 추가-->
        <!-- 정렬 기준 선택 (select는 v-model 사용 가능) -->
        <section class="sort-box">
            <label for="sortSelect">정렬 기준: </label>
            <select id="sortSelect" v-model="sortBy">
                <option value="none">기본순</option>
                <option value="tempDesc">기온 높은순 ↓</option>
                <option value="tempAsc">기온 낮은순 ↑</option>
                <option value="name">도시 이름순 ㄱㄴㄷ</option>
            </select>
        </section>        

        <section class="list-box">
            <h3>🏙️ 지역별 날씨 현황</h3>

            <!-- filteredWeatherList를 sortedWeatherList 로 변경-->
            <div v-for="item in sortedWeatherList" :key="item.id" class="weather-card" @click="selectedCityInfo = `${item.name}이 선택되었습니다.`">
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

            <p v-if="sortedWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">😭 검색 결과와 일치하는 도시가 없습니다.</p>
        </section>

        <div class="status-bar">
            {{ selectedCityInfo }}
        </div>
    </div>

</template>

