<template>
  <div id="page" class="flex select-none">
    <router-view />
  </div>
</template>

<style>
html,
body {
  height: 100%;
  width: 100%;
  background-color: black;
  position: relative;
  overscroll-behavior-y: none;
}
#app {
  background-color: white;
  overflow: hidden;
  height: 100%;
  /* transition: all 0.2s ease-in-out; */
}
</style>
