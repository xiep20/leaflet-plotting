<template>
    <div class="bottom">
        <div class="bt-left">
            <div class="bt-logo"> </div>
            <div class="bt-name">
                <div class="bt-name-zh">标绘测试系统</div>
                <div class="bt-name-en">Drawing Test System</div>
            </div>
        </div>
        <div class="bt-right">
            <div class="r-userinfo">
                <div class="user-pic">
                    <van-image width="100%" height="100%" :src="userinfo.pic" />
                </div>
                <div class="user-name">{{ userinfo.name }}</div>
                <div class="user-set">
                    <van-icon name="arrow-down" />
                </div>
                <div class="user-close">
                    <i class="iconfont asp-guanbi"></i>
                </div>
            </div>
            <div class="r-menu">
                <van-tabbar v-model="selmenu" :fixed="false" :border="false" @change="onChange" route>
                    <van-tabbar-item v-for="(item, key) in menuList" :key="key" :name="item.name" :to="item.route">
                        <!-- <i :class="'iconfont '+item.icon"></i> -->
                        <template #icon="props">
                            <i :class="'iconfont ' + item.icon" style="font-size: 20px;"></i>
                        </template>

                        {{ item.label
                        }}</van-tabbar-item>
                </van-tabbar>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data () {
        return {
            selmenu: -1,
            menuList: [
                { name: '标绘', icon: 'asp-biaohuiguanli', "label": '标绘', route: '/plotting' },
                { name: '地图', icon: 'asp-diqiu', "label": '地图', route: '/mapMou' },
            ],
            userinfo: {
                pic: "",
                name: "admin"
            }
        };
    },
    mounted () {
    },
    watch: {},
    methods: {
        //按钮改变
        onChange (index) {

        }
    }
};
</script>

<style lang="less" scoped>
.bottom {
    width: 100%;
    height: 50px;
    background-color: #272D34;

    .bt-left {
        width: 220px;
        height: 50px;
        position: absolute;
        left: 10px;
        bottom: 0;


        .bt-logo {
            width: 50px;
            height: 50px;
            float: left;
            background: url("~@/assets/image/logo.png") no-repeat;
            background-size: 100% 100%;
        }

        .bt-name {
            width: 160px;
            height: 44px;
            margin: 3px 0 0 10px;
            float: left;
            color: #fff;
            font-size: 15px;

            .bt-name-zh {
                width: 100%;
                height: 22px;
                line-height: 22px;
            }

            .bt-name-en {
                width: 100%;
                height: 22px;
                line-height: 22px;
                font-size: 14px;
            }
        }
    }

    .bt-right {
        width: calc(100% - 110px);
        height: 50px;
        float: right;

        .r-menu {
            width: 18vw;
            height: 50px;
            margin-right: 4vw;
            float: right;

            .van-tabbar {
                background: transparent;

                .van-tabbar-item {
                    color: #fff;
                }

                .van-tabbar-item--active {
                    background-color: #255CFF;
                }
            }

        }

        .r-userinfo {
            height: 50px;
            float: right;

            .user-pic {
                width: 36px;
                height: 36px;
                background-color: #f0f0f0;
                border-radius: 18px;
                margin: 7px;
                overflow: hidden;
                float: left;
            }

            .user-name {
                min-width: 80px;
                height: 50px;
                color: #fff;
                line-height: 50px;
                font-size: 18px;
                text-align: center;
                float: left;
            }

            .user-set {
                float: left;
                height: 50px;
                color: #fff;
                line-height: 50px;
                font-size: 18px;
                margin: 0 5px;
            }

            .user-close {
                float: left;
                height: 50px;
                line-height: 50px;
                margin: 0 10px;
                color: #fff;

                i {
                    font-size: 22px;
                }
            }
        }
    }
}
</style>