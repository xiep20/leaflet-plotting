<template>
    <div class="plotting">
        <van-popup v-model="show" position="left" :overlay="false" class="dia-popup">
            <div class="mm-cont">
                <div class="edittools">
                    <div class="drawtools">
                        <div :class="'tool-item' + (item.isactive ? ' isactive' : '')" v-for="(item, key) in drawToolsList"
                            :key="key" :title="item.label" @click="btnClick(item)">
                            <i :class="'iconfont ' + item.icon"></i>

                            <div class="toolbar-active" v-if="item.name === 'Marker' && item.isactive == true">
                                <div :class="'toolbar-active-item' + (selmarkerindex === mkey ? ' iconsel' : '')"
                                    v-for="(mitem, mkey) in markerList" :key="mkey" @click="markerClick($event, mkey)"><img
                                        :src="mitem.url" /></div>
                            </div>
                            <div class="toolbar-active" v-if="item.name === 'Polyline' && item.isactive == true">
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                                <div :class="'toolbar-active-item' + (plotstyle.Polyline.showMeasure ? ' iconsel' : '')"
                                    @click="AStyleClick($event, 1)">量测</div>
                            </div>

                            <div class="toolbar-active" v-if="item.name === 'Polygon' && item.isactive == true">
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.fillColor" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                                <div :class="'toolbar-active-item' + (plotstyle.Polygon.showMeasure ? ' iconsel' : '')"
                                    @click="AStyleClick($event, 2)">量测</div>
                            </div>

                            <div class="toolbar-active" v-if="item.name === 'path' && item.isactive == true">
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                            </div>

                            <div class="toolbar-active" v-if="item.name === 'Arrow' && item.isactive == true">
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                            </div>

                            <div class="toolbar-active"
                                v-if="(item.name === 'rectangle' || item.name === 'circle') && item.isactive == true">
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                                <div class="toolbar-active-item" @click="AStyleClick($event, 0)">
                                    <el-color-picker v-model="styleinfo.fillColor" size="mini" show-alpha color-format="rgb"
                                        @change="colorchange"></el-color-picker>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="datatools">
                        <div :class="'tool-item' + (item.isactive ? ' isactive' : '')" v-for="(item, key) in dataToolsList"
                            :key="key" :title="item.label" @click="toolClick(item)">
                            <i :class="'iconfont ' + item.icon"></i>
                        </div>
                    </div>
                </div>
                <div class="historytools" @click="showHistory = !showHistory">
                    <div class="his-text">历史</div>
                    <div class="his-text">记录</div>
                </div>
            </div>
        </van-popup>

        <!-- <div class="style-dialog" v-if="activemune == 'rectangle' || activemune == 'circle'">
            <div class="style-item">
                <div class="style-item-label">线颜色：</div>
                <div class="style-item-cont">
                    <el-color-picker v-model="styleinfo.color" size="mini" show-alpha color-format="rgb"
                        @change="colorchange"></el-color-picker>
                </div>
            </div>
            <div class="style-item">
                <div class="style-item-label">填充颜色：</div>
                <div class="style-item-cont">
                    <el-color-picker v-model="styleinfo.fillColor" size="mini" show-alpha color-format="rgb"
                        @change="colorchange"></el-color-picker>
                </div>
            </div>
        </div> -->

        <div class="history-list" v-if="showHistory">
            <div class="allbox">
                <div :class="'history-item' + (selhistoryitem === key ? ' selitem' : '')" v-for="(item, key) in savelist"
                    :key="key" @click="historyClick(item, key)">
                    <img :src="item.img" />
                    <div class="item-name">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <van-overlay :show="saveshow" z-index="2001" @click="saveColse">
            <div class="wrapper">
                <div class="block" @click.stop>
                    <van-cell-group>
                        <van-field v-model="nowfiled.name" label="" placeholder="请输入名称" />
                    </van-cell-group>
                    <van-image width="100%" fit="contain" :src="nowfiled.img">
                    </van-image>
                    <div class="dia-btn" v-show="nowfiled.img !== ''">
                        <van-button size="small" plain type="info" @click="saveinfo">确定</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>

    </div>
</template>
  
<script>
// import domtoimage from 'dom-to-image';
import domtoimage from 'dom-to-image-more';
import { GeoJSON2 } from '@/utils/GeoJSON2.js'
export default {
    components: {
    },
    data() {
        return {
            show: false,
            drawToolsList: [
                { name: "rectangle", label: "绘制矩形", icon: "asp-juxing", isactive: false },
                { name: "circle", label: "绘制圆形", icon: "asp-yuan", isactive: false },
                { name: "Polyline", label: "绘制线", icon: "asp-xianduan", isactive: false },
                { name: "Polygon", label: "绘制多边形", icon: "asp-duobianxing", isactive: false },
                { name: "Marker", label: "绘制标注", icon: "asp-fuhaoku", isactive: false },
                // { name: "path", label: "绘制路径", icon: "asp-lujing", isactive: false },
                { name: "Arrow", label: "绘制箭头", icon: "asp-lujing", isactive: false },
                { name: "Text", label: "绘制文本", icon: "asp-wenben", isactive: false },
            ],//绘制功能列表
            dataToolsList: [
                { name: "edit", label: "编辑", icon: "asp-edit-square", isactive: false },
                { name: "delete", label: "删除", icon: "asp-delete", isactive: false },
                { name: "drag", label: "拖拽", icon: "asp-tuozhuai", isactive: false },
                { name: "Rotate", label: "旋转", icon: "asp-xuanzhuan", isactive: false },
                { name: "save", label: "保存", icon: "asp-save" },
            ],//编辑功能列表
            // 图形图层组
            editableLayers: null,
            drawGeoJson: null,//绘制图形的geojson数据
            drawLayer: null,//绘制图层
            //图标列表
            markerList: [
                { url: 'image/marker/小旗.png' },
                { url: 'image/marker/路障.png' }
            ],
            //marker选择的图标
            selmarkerindex: 0,
            showHistory: false,
            savelist: [
            ],
            saveshow: false,
            nowfiled: {
                name: '未命名',
                img: ''
            },
            activemune: '',
            plotstyle: {
                "rectangle": {
                    color: 'rgb(51, 136, 255)',
                    fillColor: 'rgba(51, 136, 255, 0.4)',
                },
                "circle": {
                    color: 'rgb(51, 136, 255)',
                    fillColor: 'rgba(51, 136, 255, 0.4)',
                },
                "Polyline": {
                    color: 'rgb(51, 136, 255)',
                    showMeasure: false
                },
                "Polygon": {
                    color: 'rgb(51, 136, 255)',
                    fillColor: 'rgba(51, 136, 255, 0.4)',
                    showMeasure: false
                },
                "path": {
                    color: 'rgb(51, 136, 255)',
                },
                "Arrow": {
                    color: 'rgb(51, 136, 255)',
                },

            },//图形初始样式
            styleinfo: {
                color: 'rgb(51, 136, 255)',
                fillColor: 'rgba(51, 136, 255, 0.4)',
            },//当前样式
            selhistoryitem: 999999
        };
    },
    mounted() {
        //页面加载数据和初始化
        this.gethistory();
        this.$nextTick(() => {
            if (map && window.mapConfig.view.plotting) {
                map.flyTo(L.latLng(...window.mapConfig.view.plotting[0]), window.mapConfig.view.plotting[1])
            }
            this.show = true
            this.drawInitialize()
        })
    },
    watch: {},
    beforeDestroy() {
        this.destoryDrawCtr();
    },
    methods: {
        //获取数据
        gethistory() {
            this.axios.get('data/overlay.json').then((res) => {
                this.savelist = res.data.plotList
            })
        },
        //初始化
        drawInitialize() {
            //初始化绘制插件
            // window.L.PM.initialize();
            //中文
            map.pm.setLang('zh');

            this.editableLayers = new L.FeatureGroup();
            map.addLayer(this.editableLayers);


            this.arrowLayers = new L.FeatureGroup();
            map.addLayer(this.arrowLayers);
            // 添加绘制完监听事件
            map.on('pm:create', this.drawCreatedBack);
            this.editableLayers.on("pm:edit", this.editBack);
            // this.editableLayers.on("pm:remove", this.removeBack);
            map.on("pm:remove", this.removeBack);
        },
        //绘制工具点击
        btnClick(item) {
            // 先取消绘制或者编辑
            this.btnCancel(2);
            for (let i = 0; i < this.drawToolsList.length; i++) {
                if (this.drawToolsList[i].isactive && this.drawToolsList[i].name !== item.name) {
                    this.drawToolsList[i].isactive = false
                }
            }
            for (let i = 0; i < this.dataToolsList.length; i++) {
                this.dataToolsList[i].isactive = false
            }

            if (item.isactive === true) {
                item.isactive = false
                this.activemune = ''
                return
            }
            item.isactive = true
            this.activemune = item.name
            //根据不同绘制图形开启绘制
            switch (item.name) {
                case 'rectangle'://矩形
                    this.styleinfo.color = this.plotstyle.rectangle.color
                    this.styleinfo.fillColor = this.plotstyle.rectangle.fillColor
                    map.pm.enableDraw('Rectangle', {
                        continueDrawing: false,
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                        },
                    });
                    break;
                case 'circle'://圆形
                    this.styleinfo.color = this.plotstyle.circle.color
                    this.styleinfo.fillColor = this.plotstyle.circle.fillColor
                    map.pm.enableDraw('Circle', {
                        continueDrawing: false,
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                        },
                    });
                    break;
                case 'Polyline'://线
                    this.styleinfo.color = this.plotstyle.Polyline.color
                    map.pm.enableDraw('Line', {
                        continueDrawing: false,
                        pathOptions: {
                            color: this.styleinfo.color,
                            showMeasure: this.plotstyle.Polyline.showMeasure
                        },
                    });
                    break;
                case 'Polygon'://面
                    this.styleinfo.color = this.plotstyle.Polygon.color
                    this.styleinfo.fillColor = this.plotstyle.Polygon.fillColor
                    map.pm.enableDraw('Polygon', {
                        continueDrawing: false,
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                            showMeasure: this.plotstyle.Polygon.showMeasure
                        },
                    });
                    break;
                case 'path'://箭头线
                    this.styleinfo.color = this.plotstyle.path.color
                    map.pm.enableDraw('Line', {
                        continueDrawing: false,
                        pathOptions: {
                            pathShape: 'path',
                            color: this.styleinfo.color
                        },
                    });
                    break;
                case 'Arrow'://箭头面
                    this.styleinfo.color = this.plotstyle.Arrow.color
                    map.pm.enableDraw('Arrow', {
                        continueDrawing: false,
                        pathOptions: {
                            pathShape: 'Arrow',
                            color: this.styleinfo.color
                        },
                    });
                    break;
                case 'Marker'://标注
                    var myIcon = L.icon({
                        iconUrl: this.markerList[this.selmarkerindex].url,
                        iconSize: [36, 36],
                        iconAnchor: [18, 36],
                    });
                    map.pm.enableDraw('Marker', {
                        continueDrawing: false,
                        markerStyle: {
                            icon: myIcon
                        }
                    });
                    break;
                case 'Text'://文字
                    this.drawp = map.pm.enableDraw("Text", { continueDrawing: false, textOptions: { className: 'markertext' } });
                    break;
                default:
                    break;

            }
        },
        //绘制箭头线
        drawArrow(Arrow, color) {
            // var Arrow = L.polyline([[35.754453, 114.211464], [35.5, 114.3]], {}).addTo(map);
            let a = L.polylineDecorator(Arrow, {
                patterns: [
                    {
                        offset: 30, repeat: 60, symbol: L.Symbol.marker({
                            rotate: true, markerOptions: {
                                arrowline: Arrow._leaflet_id,
                                // icon: L.icon({
                                //     iconUrl: '../image/arrow2.svg',
                                //     iconSize: [16, 16],
                                //     iconAnchor: [8, 16],
                                // })
                                icon: L.divIcon({
                                    html: `<svg t="1688121125516" class="icon" fill="${color}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1532" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M13.344 655.16800002L512 2.75200003 1010.656 655.16800002 512 538.72000003 13.344 655.16800002z" p-id="1533"></path></svg>`,
                                    className: 'svg-arrow',
                                    iconSize: [16, 16],
                                    iconAnchor: [8, 16],
                                })
                            },
                        })
                    }
                ]
            }).addTo(this.arrowLayers);
            return a._leaflet_id
        },
        //绘制结束
        drawCreatedBack(e) {
            // 记录当前绘制的图形
            // this.drawGeoJson = e.layer.toGeoJSON()
            //显示图层
            e.layer.options.shape = e.shape
            //箭头线
            if (e.layer.options.pathShape && e.layer.options.pathShape == 'path') {
                let arrowId = this.drawArrow(e.layer, this.styleinfo.color)
                e.layer.options.pathArrowID = arrowId
            }
            //线、面量算
            switch (e.shape) {
                case 'Line':
                    if (this.plotstyle.Polyline.showMeasure) {
                        e.layer.options.showMeasure = this.plotstyle.Polyline.showMeasure
                        e.layer.showMeasurements()
                    }
                    break;
                case 'Polygon':
                    if (this.plotstyle.Polygon.showMeasure) {
                        e.layer.options.showMeasure = this.plotstyle.Polygon.showMeasure
                        e.layer.showMeasurements()
                    }
                    break;
                default:
                    break;
            }
            this.editableLayers.addLayer(e.layer);
            this.drawGeoJson = e.layer.toGeoJSON()
            this.drawLayer = e.layer

            for (let i = 0; i < this.drawToolsList.length; i++) {
                this.drawToolsList[i].isactive = false
            }
        },
        //编辑后
        editBack(e) {
            if (e.layer.options.pathShape && e.layer.options.pathShape == 'path') {
                this.arrowLayers._layers[e.layer.options.pathArrowID].remove()
                let arrowId = this.drawArrow(e.layer, this.styleinfo.color)
                e.layer.options.pathArrowID = arrowId
            }
        },
        //删除后
        removeBack(e) {
            if (e.layer.options.pathShape && e.layer.options.pathShape == 'path') {
                this.arrowLayers._layers[e.layer.options.pathArrowID].remove()
            } else if (e.shape && e.shape === 'Marker') {
                if (e.layer.options.icon.options.className === "svg-arrow") {
                    let id = String(e.layer.options.arrowline)
                    for (let o in this.editableLayers._layers) {
                        if (id === String(o)) {
                            this.arrowLayers._layers[this.editableLayers._layers[o].options.pathArrowID].remove()
                            this.editableLayers._layers[o].remove()
                        }
                    }
                }
            }
        },
        //marker的图标点击选择
        markerClick(e, index) {
            e.stopPropagation();
            this.selmarkerindex = index

            var myIcon = L.icon({
                iconUrl: this.markerList[this.selmarkerindex].url,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
            });
            map.pm.Draw.Marker.setOptions({
                markerStyle: {
                    icon: myIcon
                }
            })
        },
        //突出按钮的点击选择
        AStyleClick(e, index) {
            e.stopPropagation();
            if (index === 1) {
                this.plotstyle.Polyline.showMeasure = !this.plotstyle.Polyline.showMeasure
            } else if (index === 2) {
                this.plotstyle.Polygon.showMeasure = !this.plotstyle.Polygon.showMeasure
            }
        },


        //按钮点击
        toolClick(item) {
            this.btnCancel(2);
            //清除其他
            for (let i = 0; i < this.drawToolsList.length; i++) {
                this.drawToolsList[i].isactive = false
            }
            for (let i = 0; i < this.dataToolsList.length; i++) {
                if (this.dataToolsList[i].isactive === true && this.dataToolsList[i].name !== item.name) {
                    this.dataToolsList[i].isactive = false
                }
            }
            this.activemune = ''
            //当前
            switch (item.name) {
                case 'edit'://编辑

                    if (!item.isactive) {
                        this.editableLayers.pm.enable({
                            // allowRemoval: false,
                            // allowRotation: false,
                            // draggable: false,
                        });
                        item.isactive = true
                    } else {
                        this.editableLayers.pm.disable()
                        item.isactive = false
                    }

                    // if (!item.isactive) {
                    //     map.pm.enableGlobalEditMode({
                    //         // allowRotation: false,
                    //         // draggable: false
                    //     });
                    //     item.isactive = true
                    // } else {
                    //     map.pm.disableGlobalEditMode();
                    //     item.isactive = false
                    // }
                    break;
                case 'delete'://删除
                    if (!item.isactive) {
                        map.pm.enableGlobalRemovalMode();
                        item.isactive = true
                    } else {
                        map.pm.disableGlobalRemovalMode();
                        item.isactive = false
                    }
                    break;
                case 'Rotate'://旋转
                    if (!item.isactive) {
                        map.pm.enableGlobalRotateMode();
                        item.isactive = true
                    } else {
                        map.pm.disableGlobalRotateMode();
                        item.isactive = false
                    }
                    break;
                case 'drag'://拖拽
                    if (this.editableLayers && this.editableLayers._layers) {
                        for (let o in this.editableLayers._layers) {
                            if (!item.isactive) {
                                this.editableLayers._layers[o].pm.enableLayerDrag()
                            } else {
                                this.editableLayers._layers[o].pm.disableLayerDrag()
                            }
                        }
                    }
                    if (!item.isactive) {
                        item.isactive = true
                    } else {
                        item.isactive = false
                    }
                    // if (!item.isactive) {
                    //     map.pm.enableGlobalDragMode();
                    //     item.isactive = true
                    // } else {
                    //     map.pm.disableGlobalDragMode()
                    //     item.isactive = false
                    // }
                    break;
                case 'save'://保存
                    this.getImg();
                    this.saveshow = true
                    break;
                default:
                    break;
            }
        },
        //颜色改变
        colorchange(color) {
            let ap = Number(this.styleinfo.fillColor.split(",")[3].split(")")[0])

            //根据类型设置样式
            switch (this.activemune) {
                case 'rectangle':
                    map.pm.Draw.Rectangle.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                            fillOpacity: ap
                        },
                    })
                    this.plotstyle.rectangle.color = this.styleinfo.color
                    this.plotstyle.rectangle.fillColor = this.styleinfo.fillColor
                    break;
                case 'circle':
                    map.pm.Draw.Circle.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                            fillOpacity: ap
                        },
                    })
                    this.plotstyle.circle.color = this.styleinfo.color
                    this.plotstyle.circle.fillColor = this.styleinfo.fillColor
                    break;
                case 'Polyline':
                    map.pm.Draw.Line.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            color: this.styleinfo.color
                        },
                    })
                    this.plotstyle.Polyline.color = this.styleinfo.color
                    break;
                case 'Polygon':
                    map.pm.Draw.Polygon.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            color: this.styleinfo.color,
                            fillColor: this.styleinfo.fillColor,
                            fillOpacity: ap
                        },
                    })
                    this.plotstyle.Polygon.color = this.styleinfo.color
                    this.plotstyle.Polygon.fillColor = this.styleinfo.fillColor
                    break;
                case 'path':
                    map.pm.Draw.Line.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            pathShape: 'path',
                            color: this.styleinfo.color
                        },
                    })
                    this.plotstyle.path.color = this.styleinfo.color
                    break;
                case 'Arrow':
                    map.pm.Draw.Arrow.setOptions({
                        templineStyle: { color: this.styleinfo.color },
                        pathOptions: {
                            pathShape: 'Arrow',
                            color: this.styleinfo.color
                        },
                    })
                    this.plotstyle.Arrow.color = this.styleinfo.color
                    break;
                case 'Marker':
                    break;
                case 'Text':
                    break;
                default:
                    break;

            }

        },
        //获取缩略图片
        getImg() {
            let self = this

            this.nowfiled = {
                name: '未命名',
                img: ''
            }
            if (this.selhistoryitem <= 999990) {
                this.nowfiled.name = this.savelist[this.selhistoryitem].name
            }
            let node = document.getElementById('Map2D')
            domtoimage.toPng(node, { height: window.innerHeight, width: window.innerWidth, quality: 0.6 })
                .then(function (dataUrl) {
                    self.nowfiled.img = dataUrl
                })
                .catch(function (error) {
                });

        },
        //关闭
        saveColse() {
            this.saveshow = false
        },
        //获取中心点和缩放级别
        getCenterZoom() {
            let cenzoom = {}
            let cen = map.getCenter()
            cenzoom.center = [cen.lat, cen.lng]
            cenzoom.zoom = map.getZoom()

            return cenzoom
        },
        //保存
        saveinfo() {
            let self = this
            self.btnCancel(1);
            let _nf = JSON.parse(JSON.stringify(self.nowfiled));
            let lays = {
                "type": "FeatureCollection", "features": [
                ]
            }
            self.editableLayers.eachLayer(function (layer) {
                if (layer._map) {
                    let j = layer.toGeoJSON()
                    let s = JSON.parse(JSON.stringify(layer.options))
                    j.properties = s
                    if (layer.options.shape === "Arrow") {
                        j.properties._points = layer._points
                    }
                    if (s.shape === "Text") {
                        // markertext
                        // j.properties.icon.options.className
                    }
                    lays.features.push(j)
                }
            })
            _nf.layer = lays
            //生成图片
            let _elenode = document.querySelector(".plotting .van-image")
            domtoimage.toPng(_elenode, { height: _elenode.offsetHeight, width: _elenode.scrollWidth, quality: 0.6 })
                .then(function (dataUrl) {
                    _nf.img = dataUrl
                    let cenzoom = self.getCenterZoom()
                    _nf.cenzoom = cenzoom
                    if (self.selhistoryitem > 999990) {
                        self.savelist.push(_nf)
                        self.selhistoryitem = self.savelist.length - 1
                    } else {
                        self.savelist[self.selhistoryitem] = _nf
                    }
                    self.saveshow = false
                })

        },
        //历史点击
        historyClick(item, key) {
            this.btnCancel(1);
            this.editableLayers.clearLayers();
            this.arrowLayers.clearLayers();
            if (this.selhistoryitem === key) {
                this.selhistoryitem = 999999
                return
            }

            map.flyTo(L.latLng(...item.cenzoom.center), item.cenzoom.zoom)

            this.selhistoryitem = key
            //加载geojson
            let glay = new GeoJSON2(item.layer, {
                // let glay = L.geoJSON(item.layer, {
                pointToLayer: function (feature, latlng) {
                    if (feature.properties.shape === "Circle") {
                        return L.circle(latlng, { radius: feature.properties.radius });
                    } else if (feature.properties.shape === "Marker") {
                        let myIcon = L.icon(feature.properties.icon.options);
                        return L.marker(latlng, { icon: myIcon, shape: feature.properties.shape });
                    } else if (feature.properties.shape === "Text") {
                        // let myIcon = L.divIcon(feature.properties.icon.options);
                        // return L.marker(latlng, { icon: myIcon });
                        var lm = L.marker(latlng, {
                            textMarker: true,
                            text: feature.properties.text,
                            shape: feature.properties.shape
                        });
                        lm.pm.textArea.classList.add('markertext')
                        return lm
                    }
                },
                style: function (feature) {
                    let _style = {}
                    _style = feature.properties
                    return _style
                },
                // filter: function (geoJsonFeature) {
                //     return true;
                // },
                onEachFeature: (feature, layer) => {
                    if (feature.properties.shape === 'Rectangle') {
                        // 定义矩形的地理边界
                        var bounds = [layer.getBounds()._northEast, layer.getBounds()._southWest];
                        // 创建一个橙色的矩形
                        this.editableLayers.addLayer(L.rectangle(bounds, feature.properties));
                    } else {

                        this.editableLayers.addLayer(layer)
                        switch (feature.properties.shape) {
                            case 'Line':
                            case 'Polygon':
                                if (feature.properties.showMeasure) {
                                    layer.showMeasurements()
                                }
                                break;
                            default:
                                break;
                        }
                        if (feature.properties.pathShape == 'path') {
                            let arrowId = this.drawArrow(layer, feature.properties.color)
                            layer.options.pathArrowID = arrowId
                        }
                    }
                }
            });
            // this.editableLayers.addLayer(glay)
        },
        //按键状态取消
        btnCancel(flag) {
            map.pm.disableDraw();
            map.pm.disableGlobalEditMode();
            this.editableLayers.pm.disable()
            map.pm.disableGlobalRemovalMode();
            map.pm.disableGlobalRotateMode();

            if (this.editableLayers && this.editableLayers._layers) {
                for (let o in this.editableLayers._layers) {
                    this.editableLayers._layers[o].pm.disableLayerDrag()
                }
            }
            if (flag && flag != 2) {
                //清除其他
                for (let i = 0; i < this.drawToolsList.length; i++) {
                    this.drawToolsList[i].isactive = false
                }
                for (let i = 0; i < this.dataToolsList.length; i++) {
                    this.dataToolsList[i].isactive = false
                }
            }
        },


        // 销毁绘制控件
        destoryDrawCtr() {

            map.pm.disableDraw();
            map.pm.disableGlobalEditMode();
            // 取消绘制完监听事件，避免在真正开发中，其它地方也监听了 CREATED 事件
            map.off('pm:create', this.drawCreatedBack);
            this.editableLayers.off("pm:edit", this.editBack);
            map.off("pm:remove", this.removeBack);
            // 删除全部绘制的图层
            if (this.editableLayers) {
                this.editableLayers.clearLayers();
            }
            if (this.arrowLayers) {
                this.arrowLayers.clearLayers();
            }
        }
    }
};
</script>
  
<style lang="less" scoped>
.plotting {
    .dia-popup {
        width: 44px;
        height: calc(100% - 50px);
        margin-top: -25px;
        background: #F4F8FCCC;
        box-shadow: 0px 12px 48px 16px #00000008, 0px 9px 28px 0px #0000000d, 0px 6px 16px -8px #00000014;
        overflow: visible;

        .mm-cont {
            width: 100%;
            height: 100%;
            position: absolute;

            .edittools {
                width: 100%;
                height: calc(100% - 60px);
                // overflow: auto;

                .drawtools {
                    margin: 10px 4px;
                    width: 36px;
                    display: table;

                    .tool-item {
                        width: 36px;
                        height: 36px;
                        text-align: center;
                        line-height: 36px;
                        float: left;
                        max-height: 8vh;

                        i {
                            font-size: 18px;
                            color: #000000;
                        }

                        .toolbar-active {
                            position: relative;
                            top: -40px;
                            left: 44px;
                            width: max-content;
                            height: 36px;
                            border-radius: 0 5px 5px 0;
                            background-color: #B1C0ECCC;
                            color: #000000;

                            .toolbar-active-item {
                                width: 40px;
                                height: 36px;
                                text-align: center;
                                float: left;

                                img {
                                    height: 100%;
                                }
                            }

                            .iconsel {
                                border: 2px solid #ff9800cc;
                                box-sizing: border-box;
                            }
                        }
                    }

                    .isactive {
                        background-color: #B1C0EC;

                        i {
                            color: #ff9800;
                        }
                    }
                }

                .datatools {
                    margin: 10px 4px;
                    width: 100%;
                    display: table;

                    .tool-item {
                        width: 36px;
                        height: 36px;
                        text-align: center;
                        line-height: 36px;
                        float: left;

                        i {
                            font-size: 18px;
                            color: #000000;
                        }

                        .toolbar-active {
                            position: relative;
                            top: -40px;
                            left: 40px;
                            width: max-content;
                            height: 36px;
                            border-radius: 0 5px 5px 0;
                            background-color: #B1C0ECCC;
                            color: #000000;

                            .toolbar-active-item {
                                width: 40px;
                                height: 36px;
                                text-align: center;
                                float: left;

                            }
                        }

                        // &:after {
                        //     clear: both
                        // }
                    }

                    .isactive {
                        background-color: #B1C0EC;

                        i {
                            color: #ff9800;
                        }
                    }
                }
            }

            .historytools {
                width: 36px;
                height: 38px;
                margin: 8px 4px;
                font-size: 10px;
                background-color: #B1C0EC;
                text-align: center;
                color: #255CFF;

                .his-text {
                    width: 100%;
                    height: 16px;
                }
            }
        }
    }

    .style-dialog {
        position: absolute;
        top: 10px;
        left: 55px;
        width: 110px;
        height: auto;
        z-index: 500;
        background-color: #B1C0ECCC;
        border-radius: 5px;
        box-shadow: 0px 0px 3px #818181;

        .style-item {
            width: 100%;
            height: 32px;

            .style-item-label {
                width: 70px;
                height: 32px;
                text-align: right;
                font-size: 12px;
                line-height: 32px;
                color: #ff8d00;
                float: left;
            }

            .style-item-cont {
                width: 40px;
                float: left;
            }
        }
    }

    .history-list {
        position: absolute;
        bottom: 60px;
        left: 60px;
        max-width: 80%;
        height: 85px;
        color: #000000;
        z-index: 1000;
        overflow: overlay;
        background: #B1C0ECCC;
        border-radius: 5px;

        .allbox {
            height: 100%;
            width: max-content;

            .history-item {
                width: 130px;
                height: 70px;
                border-radius: 8px;
                margin: 5px;
                position: relative;
                border: 2px solid #e0e0e0;
                float: left;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }

                .item-name {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    color: #03a9f4;
                    height: 12px;
                    line-height: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    border-left: 2px solid #ffffff;
                    padding-left: 5px;
                    text-shadow: 0 1px 1px #ffffff;
                }
            }

            .selitem {
                border: 2px solid #03a9f4;
            }
        }
    }

    .van-overlay {
        /deep/ .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;

            .block {
                width: 320px;
                background-color: #fff;

                .van-cell-group {
                    .van-cell {
                        .van-field__control {
                            text-align: center;
                        }
                    }
                }

                .dia-btn {
                    width: 100%;
                    text-align: center;
                    margin: 5px 0;
                }
            }
        }
    }
}

.leaflet-right .leaflet-control {
    display: none;
}

@media only screen and (max-height: 400PX) {
    .plotting {
        .dia-popup {
            width: 32PX;

            .mm-cont {

                .edittools {
                    height: calc(100% - 50PX);

                    .drawtools {
                        margin: 6PX 4PX;
                        width: 24PX;

                        .tool-item {
                            width: 24PX;
                            height: 24PX;
                            line-height: 24PX;

                            i {
                                font-size: 14PX;
                            }

                            .toolbar-active {
                                top: -30PX;
                                left: 32PX;
                                height: 24PX;
                                border-radius: 0 5PX 5PX 0;

                                .toolbar-active-item {
                                    width: 30PX;
                                    height: 24PX;
                                }

                                .iconsel {
                                    border: 2PX solid #ff9800cc;
                                }
                            }
                        }
                    }

                    .datatools {
                        margin: 10PX 4PX;

                        .tool-item {
                            width: 24PX;
                            height: 24PX;
                            line-height: 24PX;

                            i {
                                font-size: 14PX;
                            }

                            .toolbar-active {
                                top: -24PX;
                                left: 30PX;
                                height: 24PX;
                                border-radius: 0 5PX 5PX 0;

                                .toolbar-active-item {
                                    width: 30PX;
                                    height: 24PX;

                                }
                            }

                        }
                    }
                }

                .historytools {
                    width: 24PX;
                    height: 30PX;
                    margin: 5PX 4PX;
                    font-size: 6PX;

                    .his-text {
                        height: 16PX;
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 1300PX) {
    .plotting {
        .dia-popup {
            width: 44PX;

            .mm-cont {

                .edittools {
                    height: calc(100% - 60PX);

                    .drawtools {
                        margin: 10PX 4PX;
                        width: 36PX;

                        .tool-item {
                            width: 36PX;
                            height: 36PX;
                            line-height: 36PX;

                            i {
                                font-size: 18PX;
                            }

                            .toolbar-active {
                                top: -40PX;
                                left: 44PX;
                                height: 36PX;
                                border-radius: 0 5PX 5PX 0;

                                .toolbar-active-item {
                                    width: 40PX;
                                    height: 36PX;
                                }

                                .iconsel {
                                    border: 2PX solid #ff9800cc;
                                }
                            }
                        }
                    }

                    .datatools {
                        margin: 10PX 4PX;

                        .tool-item {
                            width: 36PX;
                            height: 36PX;
                            line-height: 36PX;

                            i {
                                font-size: 18PX;
                            }

                            .toolbar-active {
                                top: -40PX;
                                left: 40PX;
                                height: 36PX;
                                border-radius: 0 5PX 5PX 0;

                                .toolbar-active-item {
                                    width: 40PX;
                                    height: 36PX;

                                }
                            }

                        }
                    }
                }

                .historytools {
                    width: 36PX;
                    height: 38PX;
                    margin: 8PX 4PX;
                    font-size: 10PX;

                    .his-text {
                        height: 16PX;
                    }
                }
            }
        }
    }
}
</style>
  