<script setup>
import {ref} from 'vue'

//데이터 생성(가상의 벡엔드 데이터 배열)
const weatherList = ref([
    { id: 'city_01', name: '서울', status: '구름',temp: 28, minTemp: 25, maxTemp: 32, mood: '😌 여유로워요' },
    { id: 'city_02', name: '수원', status: '비',temp: 9, minTemp: 4, maxTemp: 17, mood: '🍵 차분한 하루' },
    { id: 'city_03', name: '부산', status: '맑음',temp: 26, minTemp: 24, maxTemp: 29, mood: '✈️ 여행 가고 싶어요' }
])

//검색어 및 알림창 제어용 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요')

// 알림 대행 함수
const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 엔터: 검색 실행
const doSearch = () => {
    const found = weatherList.value.find((item) => item.name === searchQuery.value.trim())
    selectedCityInfo.value = found
        ? `${found.name}의 현재 날씨는 [${found.status}] / ${found.temp}°C 입니다.`
        : `'${searchQuery.value}'에 해당하는 도시가 없습니다.`
}

// ESC: 입력창 비우기
const clearSearch = () => {
    searchQuery.value = ''
}

</script>

<template>
    <div class = "dashboard-wrapper">
        <section class = "search-box">
            <h3> 도시 검색</h3>
            <!-- 검색 입력란 -->
            <!-- 즉각적인 입력 X-->
            <!--<input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력"> -->
            <!-- 엔터로 검색, esc로 전체 지우기-->
            <input
                type="text"
                :value="searchQuery"
                @input="(e) => (searchQuery = e.target.value)"
                @keyup.enter="doSearch"
                @keyup.esc="clearSearch"
                placeholder="검색할 도시 이름 입력"
            />

            <p>
                검색 중인 도시: <strong>{{ searchQuery }}</strong>
            </p>
        </section>

        <section class="list-box">
            <h3>🏙️ 지역별 날씨 현황</h3>

            <div v-for="item in weatherList" :key="item.id" class="weather-card" @click="selectedCityInfo = `${item.name}이 선택되었습니다.`">
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
        </section>

        <div class="status-bar">
            {{ selectedCityInfo }}
        </div>
    </div>

</template>