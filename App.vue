<template>
  <div id ="app">
    <div class="absolute top-0 left-0 w-full h-full text-center p-16">
      <h2 class="m-auto text-4xl text-white text-shadow">Right click to see behind the curtains</h2>
    </div>
    <!-- <img width="25%" src="./assets/logo.png">
    <HelloWorld msg="Hello Vue in CodeSandbox!" />-->
    <wave-display :segments="segments"/>
  </div>
</template>

<script>
import HelloWorld from "./HelloWorld";
import WaveDisplayVue from "./WaveDisplay";

export default {
  name: "App",
  components: {
    HelloWorld,
    WaveDisplay: WaveDisplayVue
  },
  computed: {
    segments() {
     return 10
    }
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  display: grid;
  background-image: url("https://coolbackgrounds.io/images/backgrounds/index/sea-edge-79ab30e2.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.text-shadow {
  text-shadow: 0 0px 4px rgba(0, 0, 0, 1);
}
</style>
