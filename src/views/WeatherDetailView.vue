<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)

// 💡 라우터 ID 파라미터를 OpenWeatherMap 쿼리용 영문명 + 표시용 한글명으로 매핑
// (ShowcaseView.vue의 cities 배열과 id를 맞춰 둠)
const cityMapping = {
  city_01: { english: 'Seoul', korean: '서울특별시' },
  city_02: { english: 'Incheon', korean: '인천광역시' },
  city_03: { english: 'Suwon', korean: '경기도 수원시' },
  city_04: { english: 'Chuncheon', korean: '강원도 춘천시' },
  city_05: { english: 'Gangneung', korean: '강원도 강릉시' },
  city_06: { english: 'Daejeon', korean: '대전광역시' },
  city_07: { english: 'Cheongju', korean: '충청북도 청주시' },
  city_08: { english: 'Jeonju', korean: '전라북도 전주시' },
  city_09: { english: 'Gwangju', korean: '광주광역시' },
  city_10: { english: 'Daegu', korean: '대구광역시' },
  city_11: { english: 'Ulsan', korean: '울산광역시' },
  city_12: { english: 'Busan', korean: '부산광역시' },
  city_13: { english: 'Jeju', korean: '제주특별자치도' },
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true
    try {
      const API_KEY = import.meta.env.VITE_OWM_KEY
      // 🟢 [고도화] 가짜 Mock 객체 대신, 실제 고유 타깃 도시 주소를 정밀 저격 호출
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity.english},KR&appid=${API_KEY}&units=metric&lang=kr`)

      const raw = response.data
      // 화면 템플릿 구조가 깨지지 않도록 오픈웨더 JSON 알맹이를 정확히 역매핑 유치
      cityData.value = {
        name: targetCity.korean,
        temp: raw.main.temp, // 섭씨 온도 원본 기록
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed}m/s`,
      }
    } catch (error) {
      console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    } finally {
      isLoading.value = false
    }
  }
})

// 🔥 [핵심 과제] 상세 정보창에서도 화씨 상태일 때 기온을 자동 변환 연산하는 센서 장착
const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp // 원본 섭씨 온도
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 공식 적용
  }
  return rawTemp // celsius 상태일 땐 원본 반환
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보 (실시간 데이터 연동)</h3>
    <hr />

    <div v-if="isLoading" style="text-align: center; padding: 20px 0; color: #7f8c8d">데이터베이스로부터 상세 정보를 동기화하는 중입니다...</div>

    <template v-else>
      <div v-if="cityData" class="info-card">
        <h4>📍 지정 지역: {{ cityData.name }}</h4>
        <p>
          실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </p>
        <p>기상 현황: {{ cityData.status }}</p>
        <p>대기 습도: {{ cityData.humidity }}</p>
        <p>현재 풍속: {{ cityData.wind }}</p>
      </div>
      <div v-else>
        <p>해당 지역의 상세 데이터 장부가 존재하지 않거나 에러가 발생했습니다.</p>
      </div>
    </template>

    <button @click="router.back()" class="back-btn">← 이전</button>
  </div>
</template>

<style scoped>
/* base.css의 --color-* 변수 사용 → 라이트/다크 자동 대응 */
.detail-container {
  margin: 0 auto;
  background: var(--color-background-soft);
  color: var(--color-text);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: var(--color-background-mute);
  color: var(--color-text);
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
