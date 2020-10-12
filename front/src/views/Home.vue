<template>
  <div class="home">
      <h1>Digital Laboratory</h1>
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
