<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
    <div style="text-align: center; margin-left: auto; display: inline-flex; align-items: center; gap: 8px">
        <span
        >화면테마: <strong>{{ configStore.isDark ? '다크(🌙)' : '라이트(☀️)' }}</strong></span
    >
    <button @click="configStore.toggleTheme" class="toggle-btn">테마변경</button>
    </div>
</template>

<style scoped>
.toggle-btn {
    padding: 6px 10px;
    background-color: #4b6584;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
</style>
