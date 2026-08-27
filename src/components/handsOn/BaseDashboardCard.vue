<template>
    <div class="base-dashboard-card">
        <header v-if="$slots.header || $slots.action" class="card-header">
            <slot name="header"></slot>
            <div class="card-action">
                <slot name="action"></slot>
            </div>
        </header>

        <slot></slot>   <!-- 기본 슬롯 (name 없음) -->

        <footer v-if="$slots.footer" class="card-footer">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<style scoped>
.base-dashboard-card {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid #e9ecef;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 8px;
}
.card-action {
    font-size: 13px;
    color: #6c757d;
}
.card-footer {
    margin-top: 10px;
    border-top: 1px solid #e9ecef;
    padding-top: 8px;
    font-size: 13px;
    color: #6c757d;
    text-align: right;
}
</style>
