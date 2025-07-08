<template>
    <div class="map-select-box">
        <div class="map-select-content" ref="mapSelectBox">
            <svg t="1686205313019" class="iconfont-color" @click="mapSelectShow()" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="28460" width="200" height="200">
                <path
                    d="M627.648 699.392H244.736c-39.68 0-72-32.32-72-72V244.544c0-39.68 32.32-72 72-72h382.848c39.68 0 72 32.32 72 72v382.784a72 72 0 0 1-71.936 72.064zM244.736 236.544a8.064 8.064 0 0 0-8 8v382.784c0 4.416 3.584 8 8 8h382.848c4.48 0 8-3.52 8-8V244.544a8 8 0 0 0-8-8H244.736z m536.512 616.704H398.4c-39.68 0-72-32.32-72-72V398.4c0-39.744 32.256-72 72-72h382.848c39.68 0 72 32.32 72 72v382.848c0 39.68-32.32 72-72 72zM398.4 390.4a8 8 0 0 0-8 8v382.848c0 4.416 3.584 8 8 8h382.848a8.192 8.192 0 0 0 8-8V398.4a8.128 8.128 0 0 0-8-8H398.4z"
                    fill="#ffffff" p-id="28461"></path>
            </svg>
            <div v-show="isMapSelectShow" class="map-data" v-for="(item, index) in mapSelectList" :key="index"
                :style="{ backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundImage: 'url(\'' + item.url + '\')' }"
                @click="changeMapType(item.value)">
                <p class="map-type" :class="{ 'map-select': mapType == item.value }">
                    <span class="map-type-name">{{ item.name }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            mapKey: '55b4d4eaef95384c946e9bd1b99c5610', // 你的key
            mapType: 'Normal', // 默认地图展示形式
            mapSelectList: [
                { name: '卫星', url: require('@/assets/image/daohangditu.png'), value: 'Satellite' },
                { name: '矢量', url: require('@/assets/image/biaozhunditu.png'), value: 'Normal' },
                { name: '地形', url: require('@/assets/image/defaultImg.png'), value: 'Terrain' },
            ],
            isMapSelectShow: false, // 展开和隐藏
            mapLayer: {},
        }
    },
    mounted() {
        this.getMap()
        this.changeMapType(this.mapType)
        document.querySelectorAll(".leaflet-control-layers")[0].style.display='none'
    },
    methods: {
        getMap() {
            let _this = this
            // 封装方法，不然要重复写很多次
            function mapLoad(value) {
                return L.tileLayer.chinaProvider(`TianDiTu.${value}`, {
                    maxZoom: 18,
                    minZoom: 1,
                    key: _this.mapKey
                })
            }
            // 定义地图图层，官方api有

            var norMap = mapLoad('Normal.Map'),
                norAnnotion = mapLoad('Normal.Annotion'),
                sateMap = mapLoad('Satellite.Map'),
                sateAnnotion = mapLoad('Satellite.Annotion'),
                terMap = mapLoad('Terrain.Map'),
                terAnnotion = mapLoad('Terrain.Annotion');
            var normalMap = L.layerGroup([norMap, norAnnotion]),// 矢量
                satelliteMap = L.layerGroup([sateMap, sateAnnotion]), // 卫星
                terrainMap = L.layerGroup([terMap, terAnnotion]); // 地形
            // 名字要和data中的mapSelectList中value值对应
            var baseLayers = {
                "Normal": normalMap,
                "Satellite": satelliteMap,
                'Terrain': terrainMap
            }
            // 加载切换地图的功能（出现在页面右上角，可通过css隐藏）
            L.control.layers(baseLayers, null).addTo(map);

            map.on('click', function (e) {
                // 地图点击事件，隐藏dom
                _this.$refs.mapSelectBox.style.width = '40px'
                setTimeout(() => {
                    _this.isMapSelectShow = false
                }, 220);
            })

            // 保存切换地图功能的dom,为了保证保存的dom的正确性，尽量写详细
            for (let node of document.querySelectorAll('.leaflet-control-layers-base label')) {
                this.mapLayer[node.innerText.trim()] = node.querySelector('input')
            }
        },
        // 模拟点击
        changeMapType(value) {
            this.mapType = value
            this.mapLayer[value].click()
        },
        // 展开和隐藏效果
        mapSelectShow() {
            this.isMapSelectShow = !this.isMapSelectShow
            if (this.isMapSelectShow) {
                this.$refs.mapSelectBox.style.width = '300px'
            } else {
                this.$refs.mapSelectBox.style.width = '40px'
            }
        },
    }
}
</script>
<style>
.map-select-box {
    position: absolute;
    right: 21px;
    z-index: 650;
    bottom: 10px;
}

.map-select-content {
    transition: all 400ms;
    width: 40px;
    /* height: 40px; */
    top: 0;
    float: right;
    display: flex;
    flex-direction: row;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    position: relative;
    font-size: 14px;
}

.iconfont-color {
    width: 40px;
    height: 50px;
    cursor: pointer;
    margin: auto 0;
}

.map-data {
    width: 80px;
    height: 50px;
    margin: 5px;
    margin-left: 0;
    line-height: 50px;
    cursor: pointer;
}

.map-type {
    width: 14px;
    font-size: 14px;
    height: 100%;
    float: right;
    line-height: 50px;
    background: #2583F4;
    overflow: hidden;
    padding: 0;
    margin: 0;
}

.map-type-name {
    display: inline-block;
    vertical-align: middle;
    line-height: 25px;
    color: #fff;
}

.map-select {
    background: #00263d;
}</style>
  