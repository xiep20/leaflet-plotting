<template>
    <div class="mapmodule">
        <van-popup v-model="show" position="left" :overlay="false" class="mapdialog">
            <div class="mm-cont">
                <div :class="'mm-item' + (selitem === item.name ? ' sel-item' : '')" v-for="(item, key) in maplist"
                    :key="key" @click="mapClick(item)">
                    <img :src="item.img" />
                    <div v-if="selitem !== item.name" class="item-shadow"></div>
                    <div class="item-name">{{ item.name }}</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
  
<script>

export default {
    components: {},
    data() {
        return {
            show: false,
            layerGroup: [],
            maplist: [],
            selitem: '天地图'
        };
    },
    mounted() {
        this.$nextTick(() => {
            if (map && window.mapConfig.view.mapmodule) {
                map.flyTo(L.latLng(...window.mapConfig.view.mapmodule[0]), window.mapConfig.view.mapmodule[1])
            }
            this.layerGroup = L.layerGroup().addTo(map);
            this.getLayerInfo()
        })
    },
    watch: {},
    methods: {
        //获取数据
        getLayerInfo() {
            this.axios.get('data/mapjson.json').then((res) => {
                this.maplist = res.data.layer
                this.mapClick(this.maplist[0])
                this.show = true
            })
        },
        //地图点击
        mapClick(item) {
            this.selitem = item.name
            this.layerGroup.clearLayers()
            this.addLayerToMap(item.url, item.options)
        },
        //加载图层
        addLayerToMap(url, options = {}) {
            let tl = L.tileLayer(url, options);
            this.layerGroup.addLayer(tl)
        }
    }
};
</script>
  
<style lang="less" scoped>
.mapmodule {
    .mapdialog {
        width: 200px;
        height: calc(100% - 50px);
        margin-top: -25px;
        background: #F4F8FCCC;
        box-shadow: 0px 12px 48px 16px #00000008, 0px 9px 28px 0px #0000000d, 0px 6px 16px -8px #00000014;

        .mm-cont {
            width: 100%;
            height: 80%;

            .mm-item {
                width: 180px;
                height: 120px;
                margin: 10px;
                border: 2px solid #bab8b8;
                border-radius: 8px;
                overflow: hidden;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                }

                .item-shadow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(270deg, #00000000 0%, #0000004d 51%, #000000b3 100%);
                    ;
                }

                .item-name {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 600;
                    text-shadow: 2px 1px 2px #00a8bd;
                }

            }

            .sel-item {
                border: 2px solid #0d78aa;
            }
        }
    }
}
</style>
  