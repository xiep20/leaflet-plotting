<template>
    <div class="map">
        <div id="Map2D" class="mapContainer"></div>
        <div class="" v-if="mapFinished">
            <tools></tools>
            <base-map></base-map>
        </div>
    </div>
</template>
  
<script>

// 计算工具
import '@/utils/libdist/PlotUtil.min.js'
// 标绘图形
import '@/utils/libdist/Plots.min.js'
import baseMap from "../components/MapTools/baseMap";
import tools from "../components/MapTools/tools";
// import "@/utils/arrow.js"
export default {
    components: { baseMap, tools },
    data() {
        return {
            mapFinished: false
        };
    },
    mounted() {
        this.initMap();
    },
    watch: {},
    methods: {
        initMap() {
            let options = Object.assign({ crs: L.CRS.EPSG3857 }, window.mapConfig.initmap)
            let map = L.map("Map2D", options);

            window.map = map
            this.mapFinished = true
        }
    }
};
</script>
  
<style lang="less" scoped>
.map {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .mapContainer {
        width: 100%;
        height: 100%;
    }
}
</style>
  