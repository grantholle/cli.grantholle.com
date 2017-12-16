<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url(/static/Inconsolata-Regular.woff2) format('ttf');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}

@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 700;
  src: local('Inconsolata Bold'), local('Inconsolata-Bold'), url(/static/Inconsolata-Bold.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}
</style>
