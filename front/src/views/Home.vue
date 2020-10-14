<template>
  <div class="home">
      <h1>ZETH DRIVE_01</h1>
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
  background: #232429;
  font-family: 'Roboto', sans-serif;
}


.home{
  width: 100%;
}

h1{
  display: block;
  background: #454650;
  text-align: center;
  padding: 1px;
  font-size: 14px;
}




</style>
