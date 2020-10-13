<template>
  <div class="home">
      <h1>DM LAB_SYSTEM</h1>
      <Files />
  </div>
</template>

<script>
// @ is an alias to /src
import Files from "@/components/AllFiles.vue";

export default {
  name: "Home",
  components: {
    Files
  }
};
</script>

<style scoped>
*{
  color: white;
  background: #4e4f5a;
  font-family: 'Roboto', sans-serif;
}

.home{
  width: 100vw;
  height: 100vh;
}

h1{
  display: block;
  background: #85868b;
}

</style>
