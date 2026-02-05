<template>
  <div class="main-layout">
    <AppHeader />
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    padding: 25px 0;
  }
}
</style>
