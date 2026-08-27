<script setup>
// 과제별 "기능 추가 / 변경 사항" 내용. App.vue의 각 과제 헤더 옆 버튼으로 토글됨
defineProps({
  task: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="change-log">
    <!-- ===== 과제 1 ===== -->
    <div v-if="task === 1">
      <h4>기능 추가 · weatherMockup.vue</h4>
      <p><code>doSearch</code>, <code>clearSearch</code> 함수를 만들어서</p>
      <ul>
        <li><strong>Enter</strong> 를 누르면 검색이 되고</li>
        <li><strong>ESC</strong> 를 누르면 입력창이 전체 삭제되는 기능</li>
      </ul>
      <pre>&lt;input
  @keyup.enter="doSearch"
  @keyup.esc="clearSearch"
/&gt;</pre>
    </div>

    <!-- ===== 과제 2 ===== -->
    <div v-else-if="task === 2">
      <h4>기능 추가 · weatherComposition.vue</h4>
      <p>드롭다운으로 카드 순서를 sort 하는 기능을 추가했다. (기온 높은순 / 낮은순 / 도시 이름순)</p>
      <p>
        정렬하는 기능으로 생각했는데 만들다 보니 <strong>computed → computed 구조</strong>가 나왔다.
        (<code>filteredWeatherList</code> → <code>sortedWeatherList</code>)
      </p>
      <div class="qa">
        <p class="q">Q. Vue의 computed는 default가 lazy하다. lazy를 하는 타이밍이 언제일까? (computed 예제에서 ++ 하는 타이밍)</p>
        <p class="a">
          "계산을 하고 있다가 호출을 늦게 한다" vs "호출이 있을 때까지 계산을 안 하고 있다가 출력될 때 계산한다"
          → <strong>후자가 맞음.</strong> 의존값이 바뀌어도 실제로 읽히기 전까지는 재계산하지 않는다.
        </p>
      </div>
    </div>

    <!-- ===== 과제 3 ===== -->
    <div v-else-if="task === 3">
      <h4>기능 추가 · Named Slot 여러 개</h4>
      <p>
        Named slot에서 여러 개의 slot을 쓰고 싶으면 <code>name</code> 만 바꾸면 계속 늘릴 수 있다.
        이번 과제에서 그 기능을 사용했다.
      </p>
      <table>
        <thead>
          <tr><th>부모 (weatherParent.vue)</th><th>자식 (BaseDashboardCard.vue)</th></tr>
        </thead>
        <tbody>
          <tr><td><code>&lt;template v-slot:header&gt;</code></td><td><code>&lt;slot name="header"&gt;</code></td></tr>
          <tr><td><code>&lt;template v-slot:action&gt;</code></td><td><code>&lt;slot name="action"&gt;</code></td></tr>
          <tr><td><code>&lt;template v-slot:footer&gt;</code></td><td><code>&lt;slot name="footer"&gt;</code></td></tr>
          <tr><td>(template 없이 둔 내용)</td><td><code>&lt;slot&gt;</code></td></tr>
        </tbody>
      </table>
      <div class="qa">
        <p class="q">Q. 컴포넌트가 많고 props/emits가 서로 참조하다 보니 어디서부터 시작할지 모르겠다. 실무에서는 컴포넌트 순서를 어떻게 만들까?</p>
        <p class="a">
          A. 먼저 화면을 만든다 → 화면을 영역으로 나눈다 → 반복되거나 역할이 명확한 것을 컴포넌트로 나눈다
          → 해당 컴포넌트들을 각 사람에게 던져서 만든다. 이 과정을 아키텍트가 나눠서 제공해 준다.
        </p>
      </div>
    </div>

    <!-- ===== 과제 4 ===== -->
    <div v-else-if="task === 4">
      <h4>기능 추가 · Programmatic Navigation</h4>
      <p>과제 6에 <code>useRouter()</code> — Programmatic Navigation 기능을 활용하여 페이지 이동 기능을 추가.</p>
      <pre>{
  path: '/showcase',
  name: 'Showcase',
  component: () =&gt; import('@/views/ShowcaseView.vue'),
}</pre>
      <p>router에 위 코드를 삽입하여 <code>ShowcaseView.vue</code> 로 이동.</p>
    </div>

    <!-- ===== 과제 5 ===== -->
    <div v-else-if="task === 5">
      <h4>기능 추가 · 화면 테마 변경 (라이트 / 다크)</h4>
      <ul>
        <li>
          <strong>configStore.js</strong> — state / getters / actions 3단 구조. 상태, 현재 테마에 맞춰
          최상위 태그에 붙일 클래스명, 버튼 클릭 시 라이트/다크 스위칭 함수를 생성
        </li>
        <li>
          <strong>ThemeToggler.vue</strong> — 클릭하면 configStore의 테마 변경 함수를 호출하여
          테마 스위칭 후 class가 재설정되게 함
        </li>
        <li><strong>App.vue</strong> — store의 <code>themeClass</code> 를 <code>&lt;body&gt;</code> 의 class로 옮겨줌</li>
        <li><strong>base.css</strong> — 클래스에 반응하는 CSS</li>
      </ul>
    </div>

    <div v-else>
      <p>기록된 변경 사항이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.change-log {
  margin: 12px 0 20px;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  background: var(--color-background-mute);
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.7;
}
.change-log h4 {
  margin-bottom: 8px;
  font-size: 15px;
}
.change-log ul {
  margin: 6px 0 6px 18px;
  list-style: disc;
}
.change-log code {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 12px;
}
.change-log pre {
  margin: 8px 0;
  padding: 10px 12px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}
.change-log table {
  width: 100%;
  margin: 8px 0;
  border-collapse: collapse;
  font-size: 13px;
}
.change-log th,
.change-log td {
  border: 1px solid var(--color-border);
  padding: 6px 8px;
  text-align: left;
}
.change-log .qa {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--color-border);
}
.change-log .q {
  font-weight: 700;
}
.change-log .a {
  margin-top: 4px;
  opacity: 0.9;
}
</style>
