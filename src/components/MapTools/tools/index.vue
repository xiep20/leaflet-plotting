<template>
    <div class="tools-box">
        <div class="tool-item" v-for="(item, key) in toolsList" :key="key" @click="toolsClick(item.type)">
            <i :class="'iconfont ' + item.icon" :title="item.name" :color="item.highight ? '#ffff00' : ''"></i>
        </div>

        <!-- <ul id="toolbar" v-show="csshow">
            <li><button @click="addStraightArrow">直箭头</button></li>
            <li><button @click="addFineArrow">细直箭头</button></li>
            <li><button @click="addAssaultDirection">突击方向</button></li>
            <li><button @click="addAttackArrow">进攻方向</button></li>
            <li><button @click="addTailedAttackArrow">进攻方向（尾）</button></li>
            <li><button @click="addSquadCombat">分队战斗行动</button></li>
            <li><button @click="addTailedSquadCombat">分队战斗行动（尾）</button></li>
            <li><button @click="addDoubleArrow">钳击</button></li>
            <li><button @click="addGatheringPlace">聚集地</button></li>
            <hr>
            <li><button @click="clearPlots">清空</button></li>
        </ul> -->

    </div>
</template>
  
<script>
export default {
    data() {
        return {
            toolsList: [
                {
                    name: "放大",
                    icon: 'asp-fangda',
                    type: 1
                },
                {
                    name: "缩小",
                    icon: 'asp-suoxiao',
                    type: 2
                },
                {
                    name: "测距",
                    icon: 'asp-ceju',
                    type: 3,
                    highight: false
                },
                {
                    name: "测面",
                    icon: 'asp-cemian',
                    type: 4,
                    highight: false
                },
                {
                    name: "清除",
                    icon: 'asp-delete',
                    type: 5
                },
                {
                    name: "复位",
                    icon: 'asp-chushihua',
                    type: 6
                },
                // {
                //     name: "cs",
                //     icon: 'asp-chushihua',
                //     type: 7
                // }
            ],
            BarDRAWLAYERS: [],
            csshow: false
        }
    },
    mounted() {
        this.measureGroupLayers = new L.FeatureGroup();
        map.addLayer(this.measureGroupLayers);
        window.closeMarker = this.closeMarker;
    },
    methods: {
        //点击事件
        toolsClick(type) {
            map.getContainer().style.cursor = "";
            map.off("mousedown");
            switch (type) {
                case 1:
                    this.zoomIn();
                    break;
                case 2:
                    this.zoomOut();
                    break;
                case 3:
                    this.lineMeasure();
                    break;
                case 4:
                    this.areaMeasure();
                    break;
                case 5:
                    this.delete();
                    break;
                case 6:
                    this.reset();
                    break;
                case 7:
                    this.cs();
                    break;
            }
        },
        //清除
        closeMarker(index, leaflet_id) {
            map.off("mousedown");
            map.off("click");
            if (leaflet_id) {
                this.measureGroupLayers.removeLayer(this.measureGroupLayers._layers[leaflet_id])
            } else {
                this.clearMapMeasure(); //清除测距
            }
        },
        //放大
        zoomIn() {
            map.zoomIn()
        },
        //缩小
        zoomOut() {
            map.zoomOut()
        },
        //测距
        lineMeasure() {
            this.measureMap('distance');
        },
        //测面
        areaMeasure() {
            this.measureMap('measure');

        },
        //清除
        delete() {
            this.clearMapMeasure();
        },

        // 测量
        measureMap(parameter) {
            let _this = this;
            let nowGroup = new L.FeatureGroup();
            this.measureGroupLayers.addLayer(nowGroup);

            // 禁止双击放大地图
            map.doubleClickZoom.disable();
            var DRAWING = false; //是否正在绘制
            var ISMEASURE = true; //是否是量距
            var MEASURERESULT = 0; //测量结果
            var DRAWPOLY //绘制的
            var DRAWMOVEPOLY; //绘制过程中的
            var DRAWPOLYPOINTS = []; //绘制的折线的集
            var clicked = 1;
            var timer = null;
            var startTime, endTime;
            var isend = false;
            startDraw();
            function startDraw() {
                MEASURERESULT = 0; //测量结果
                // 测面
                if (parameter == "measure") {
                    map.getContainer().style.cursor = "crosshair";
                    _this.shapeOptions = { fill: true, fillOpacity: 0.2, color: '#FF5722', fillColor: '#FF572288' }
                }
                if (parameter == "distance") {
                    map.getContainer().style.cursor = "crosshair";
                    _this.shapeOptions = { fill: false, fillOpacity: 0.2, color: '#FF5722' }
                }
                DRAWPOLY = new L.Polyline([], _this.shapeOptions); //绘制的点面
                nowGroup.addLayer(DRAWPOLY);
                map.on("mousedown", onClick);
                function onClick(e) {
                    console.log(1)
                    let st = setTimeout(() => {
                        console.log(2)
                        clearTimeout(st)
                        if (isend) {
                            return
                        }
                        console.log(4)
                        var myimage = L.divIcon({
                            className: "DistanceLabelStyle",
                            iconAnchor: [5, 5],
                            html: "<div style='width: 10px;height: 10px;background: #FF5722;border: 2px solid #FF9800;border-radius: 10px;'></div>",
                        });
                        _this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
                            icon: myimage,
                        }).addTo(nowGroup).on('click', function (me) {
                            console.log(3)
                            if (parameter == 'distance') {
                                if (DRAWPOLYPOINTS.length > 2 && DRAWPOLYPOINTS[DRAWPOLYPOINTS.length - 1].equals(e.latlng)) {
                                    onDoubleClick(me, "close", 'p');
                                }
                            }
                            else if (parameter == 'measure') {
                                if (DRAWPOLYPOINTS.length > 3 && DRAWPOLYPOINTS[0].equals(e.latlng)) {
                                    onDoubleClick(me, "close", 'p');
                                }
                            }
                            me.target.off("click")
                        });
                        // 把屏幕上的点面插入点面集
                        _this.BarDRAWLAYERS.push(_this.marker);
                        DRAWING = true; //是否正在绘制

                        DRAWPOLYPOINTS.push(e.latlng); //绘制的节点集

                        if (DRAWPOLYPOINTS.length > 1 && ISMEASURE) {
                            // 测距
                            if (parameter == 'distance') {
                                MEASURERESULT += e.latlng.distanceTo(
                                    DRAWPOLYPOINTS[DRAWPOLYPOINTS.length - 2]
                                );
                            }
                            // 测面
                            else if (parameter == 'measure') {
                                //是否是量距
                                MEASURERESULT = CalArea(DRAWPOLYPOINTS);
                            }
                        }
                        DRAWPOLY.addLatLng(e.latlng); //绘制的点面
                        if (clicked === 1) {
                            startTime = new Date().getTime();
                            clicked++;
                            timer = setTimeout(function () {
                                onDoubleClick(e);
                                clicked = 1;
                            }, 200);
                        }
                        if (clicked === 2) {
                            clicked++;
                        } else {
                            endTime = new Date().getTime();
                            if (endTime - startTime < 300) {
                                onDoubleClick(e, "close");
                                DRAWPOLYPOINTS = [];
                                DRAWING = false;
                                ISMEASURE = false;
                                clicked = 1;
                                clearTimeout(timer);
                            }
                        }

                    }, 350);
                }
                //判断关闭
                function onDoubleClick(e, type, isp) {

                    var overClass = "";
                    var overallLength = "";
                    var closeDiv = "";
                    if (type === "close") {
                        isend = true
                        map.getContainer().style.cursor = "";
                        map.off("mousedown");
                        // 测距
                        if (parameter == 'distance') {
                            if (isp && isp === 'p') {
                                _this.distanceLabelMark.remove()
                            }
                            overallLength = "总长：";
                            overClass = "overClose";
                            closeDiv = `<span onclick="closeMarker(2,${nowGroup._leaflet_id})"><img src='./image/close.png' style='width:20px;height:20px;position:absolute;top:1px;left:initial;' /></span>`;
                        }
                        // 测面
                        else if (parameter == 'measure') {
                            overallLength = "总面积：";
                            overClass = "overClose";
                            closeDiv = `<span onclick="closeMarker(3,${nowGroup._leaflet_id})"><img src='./image/close.png' style='width:20px;height:20px;position:absolute;top:1px;left:initial;' /></span>`;

                            DRAWPOLY.addLatLng(DRAWPOLY._latlngs[0]); //绘制的点面
                        }
                    }
                    if (DRAWING) {
                        if (DRAWMOVEPOLY != undefined && DRAWMOVEPOLY != null) {
                            nowGroup.removeLayer(DRAWMOVEPOLY);
                            DRAWMOVEPOLY = null;
                        }
                        if (DRAWPOLYPOINTS.length > 1 && ISMEASURE) {
                            // MEASURERESULT += e.latlng.distanceTo(
                            //   DRAWPOLYPOINTS[DRAWPOLYPOINTS.length - 2]
                            // );
                            if (MEASURERESULT > 0) {
                                // 测距
                                if (parameter == 'distance') {
                                    var htmlcontent = closeDiv + "<div class='bubbleLabel " + overClass + "'>" + overallLength + (MEASURERESULT / 1000).toFixed(2) + "公里" + "</div>";
                                    _this.distanceLabelMark = L.marker(
                                        DRAWPOLYPOINTS[DRAWPOLYPOINTS.length - 1],
                                        {
                                            icon: L.divIcon({
                                                className: "DistanceLabelStyle",
                                                iconAnchor: [-8, 15],
                                                html: htmlcontent
                                            }),
                                        }
                                    ).addTo(nowGroup);
                                    _this.BarDRAWLAYERS.push(_this.distanceLabelMark);
                                }
                                // 测面
                                else if (parameter == 'measure' && DRAWPOLYPOINTS.length > 2) {
                                    if (_this.distanceLabelMark && DRAWPOLYPOINTS.length > 3) {
                                        _this.distanceLabelMark.remove()
                                    }
                                    var htmlcontent = closeDiv + "<div class='bubbleLabel'>" + overallLength + (MEASURERESULT / 1000000).toFixed(3) + "平方公里" + "</div>"
                                    _this.distanceLabelMark = L.marker(
                                        DRAWPOLYPOINTS[DRAWPOLYPOINTS.length - 2],
                                        {
                                            icon: L.divIcon({
                                                className: "DistanceLabelStyle",
                                                iconAnchor: [-8, 15],
                                                html: htmlcontent
                                            }),
                                        }
                                    ).addTo(nowGroup);
                                    _this.BarDRAWLAYERS.push(_this.distanceLabelMark);
                                }
                            }
                        }
                        _this.BarDRAWLAYERS.push(DRAWPOLY);
                    }
                }
                // 面积计算方法
                function CalArea(latLngs) {
                    var pointsCount = latLngs.length, area = 0.0, d2r = Math.PI / 180, p1, p2;
                    if (pointsCount > 2) {
                        for (var i = 0; i < pointsCount; i++) {
                            p1 = latLngs[i];
                            p2 = latLngs[(i + 1) % pointsCount];
                            area += (p2.lng - p1.lng) * d2r * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
                        }
                        area = (area * 6378137.0 * 6378137.0) / 2.0;
                    }
                    return Math.abs(area);
                }
            }
        },
        // 清除测距
        clearMapMeasure() {
            if (this.BarDRAWLAYERS.length > 0) {
                for (var i = 0; i < this.BarDRAWLAYERS.length; i++) {
                    map.removeLayer(this.BarDRAWLAYERS[i]);
                }
                this.BarDRAWLAYERS = [];
                this.distanceLabelMark = null;
            }
        },
        //复位
        reset() {
            // 实现回到地图初始中心点
            let initmapconf = window.mapConfig.initmap
            let lat = initmapconf.center[0];
            let lng = initmapconf.center[1];
            map.setView([lat, lng], initmapconf.zoom);
        },
        cs() {
            if (!this.plotLayer) {
                this.plotLayer = L.featureGroup().addTo(map)
            }
            this.csshow = !this.csshow
        },

        clearPlots() {
            this.plotLayer && this.plotLayer.clearLayers()
        },
        // 直箭头
        addStraightArrow() {
            L.Plot.straightArrow([[36.145499, 119.838867], [36.295066, 119.852600]])
                .addTo(this.plotLayer)
        },
        // 细直箭头
        addFineArrow() {
            L.Plot.fineArrow([[36.280676, 119.903412], [36.143281, 119.895172]])
                .addTo(this.plotLayer)
        },
        // 突击方向
        addAssaultDirection() {
            L.Plot.assaultDirection([[36.142172, 119.941864], [36.276248, 119.962463]])
                .addTo(this.plotLayer)
        },
        // 进攻方向
        addAttackArrow() {
            L.Plot.attackArrow([[36.146608, 119.994049], [36.145499, 120.017395], [36.288425, 119.996796]])
                .addTo(this.plotLayer)
        },
        // 进攻方向（尾）
        addTailedAttackArrow() {
            L.Plot.tailedAttackArrow([[36.138845, 120.039368], [36.141063, 120.064087], [36.260746, 120.050354]])
                .addTo(this.plotLayer)
        },
        // 分队战斗行动
        addSquadCombat() {
            L.Plot.squadCombat([[36.141063, 120.102539], [36.248565, 120.102539], [36.370295, 120.261841]])
                .addTo(this.plotLayer)
        },
        // 分队战斗行动（尾）
        addTailedSquadCombat() {
            L.Plot.tailedSquadCombat([[36.145569, 120.189056], [36.148341, 120.232315], [36.378035, 120.362091]])
                .addTo(this.plotLayer)
        },
        // 钳击
        addDoubleArrow() {
            L.Plot.doubleArrow([[36.076713, 120.261841], [36.081153, 120.390930], [36.206468, 120.293427], [36.144390, 120.318146]])
                .addTo(this.plotLayer)
        },
        // 聚集地
        addGatheringPlace() {
            L.Plot.gatheringPlace([[36.151044, 120.510406], [36.195387, 120.605164], [36.261854, 120.559845]])
                .addTo(this.plotLayer)
        }

    }
}
</script>
<style lang="less">
.tools-box {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    border-radius: 5px;
    background-color: #f4f7fa;
    border: 2px solid #a9a9a9;


    .tool-item {
        width: 26px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        border-bottom: 1px solid #e1e1e1;
    }
}
</style>
  