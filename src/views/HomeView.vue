<template>
  <div class="home">
    <Map></Map>
    <Bottom></Bottom>
    <router-view />
  </div>
</template>

<script>
import Map from "@/views/Map.vue"
import Bottom from "@/views/Bottom.vue"
export default {
  components: { Map, Bottom },
  data() {
    return {
    };
  },
  mounted() {
  },
  watch: {},
  methods: {
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
