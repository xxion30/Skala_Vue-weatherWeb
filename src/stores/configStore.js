import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. state: 단위를 저장하는 변수 (초기값은 'celsius')
  // 값은 오직 'celsius' 또는 'fahrenheit' 두 가지만 가집니다.
  const unit = ref('celsius')

  // 2. getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 3. actions: 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }



  // ===== 화면 테마 (Light / Dark) =====

  // 1. state: 다크모드 여부를 저장하는 변수 (초기값은 라이트모드)
  const isDark = ref(false)

  // 2. getters: 현재 테마 상태에 맞춰 최상위 태그에 붙일 클래스명을 실시간 리턴
  const themeClass = computed(() => {
    return isDark.value ? 'theme-dark' : 'theme-light'
  })

  // 3. actions: 버튼 클릭 시 라이트와 다크를 토글(스위칭)하는 함수
  function toggleTheme() {
    isDark.value = !isDark.value
  }


  // ===== 사용자 이름 (입장 페이지에서 입력) =====

  // 1. state: 입장 페이지에서 입력한 사용자 이름
  const userName = ref('')

  // 2. actions: 이름 저장
  function setUserName(name) {
    userName.value = name.trim()
  }


  return {
    //온도 단위
    unit,
    unitSymbol,
    toggleUnit,

    //화면 다크모드
    isDark,
    themeClass,
    toggleTheme,

    //사용자 이름
    userName,
    setUserName,
  }
})
