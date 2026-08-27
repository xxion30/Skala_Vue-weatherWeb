<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

// 입장 폼: 이름 + 이용약관 동의
const entryForm = ref({
  name: '',
  agree: false,
})

const handleEnter = () => {
  const name = entryForm.value.name.trim()

  if (!name) {
    ElMessage.error('❌ 이름을 입력해 주세요.')
    return
  }
  if (name.length < 2) {
    ElMessage.warning('⚠️ 이름은 2글자 이상 입력해 주세요.')
    return
  }
  if (!entryForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }

  // 이름을 store에 저장하고 날씨 웹사이트로 이동
  configStore.setUserName(name)
  ElMessage.success(`🎉 ${name}님, 환영합니다! 날씨 대시보드로 이동합니다.`)
  router.push({ name: 'Showcase' })
}
</script>

<template>
  <div class="entry-page">
    <el-card class="entry-card" shadow="always">
      <template #header>
        <div class="entry-header">
          <span class="entry-emoji">🌦️</span>
          <div>
            <h1 class="entry-title">날씨 웹사이트</h1>
            <p class="entry-subtitle">이름을 입력하고 날씨 웹사이트로 입장하세요</p>
          </div>
        </div>
      </template>

      <div class="entry-field">
        <label class="entry-label">이름</label>
        <el-input
          v-model="entryForm.name"
          placeholder="이름을 입력하세요"
          size="large"
          clearable
          @keyup.enter="handleEnter"
        />
      </div>

      <div class="entry-field entry-agree">
        <span class="entry-label">이용약관에 동의합니다</span>
        <el-switch v-model="entryForm.agree" />
      </div>

      <el-button type="primary" size="large" class="entry-btn" @click="handleEnter">
        날씨 웹사이트 입장 →
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.entry-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.entry-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}
.entry-header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.entry-emoji {
  font-size: 40px;
}
.entry-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}
.entry-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.7;
}
.entry-field {
  margin-bottom: 20px;
}
.entry-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}
.entry-agree {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.entry-agree .entry-label {
  margin-bottom: 0;
}
.entry-btn {
  width: 100%;
}
</style>
