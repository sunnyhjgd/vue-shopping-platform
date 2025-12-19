<template>
    <!-- 头部 -->
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>尚品汇欢迎您！</p>
                    <!-- 未登录 -->
                    <p v-if="!userName">
                        <span>请</span>
                        <router-link to="/login">登录</router-link>
                        <router-link to="/register" class="register">免费注册</router-link>
                    </p>
                    <!-- 已登录 -->
                    <p v-else>
                        <span>{{ userName }}</span>
                        <a href="###" class="register" @click="handleLogout">退出登录</a>
                    </p>
                </div>
                <div class="typeList">
                    <router-link to="/center/myorder" href="###">我的订单</router-link>
                    <router-link to="/shopcart" href="###">我的购物车</router-link>
                    <router-link to="/home" href="###">主页</router-link>
                    <a href="###">会员</a>
                    <a href="###">企业采购</a>
                    <a href="###">关注我</a>
                    <a href="###">合作招商</a>
                    <a href="###">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <router-link to="/home" class="logo" title="尚品汇" href="###" target="_blank">
                    <img src="./images/logo.png" alt="">
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" id="autocomplete" ref="inputs" class="input-error input-xxlarge" />
                    <button class="sui-btn btn-xlarge btn-danger" type="button" @click="handleSearch">搜索</button>
                </form>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'MyHeader',
    data() {
        return {
            userName: ''
        }
    },
    created() {
        // 初始化时加载用户信息
        this.initUserName();

        // 监听登录成功事件并保存引用以便移除
        this.handleLoginSuccess = () => this.initUserName();
        this.$bus.$on('loginSuccess', this.handleLoginSuccess);
    },
    beforeDestroy() {
        // 移除登录成功事件监听器，避免内存泄漏
        this.$bus.$off('loginSuccess', this.handleLoginSuccess);
        // handleLogout是methods中的方法，不需要单独保存引用
        this.$bus.$off('logout', this.handleLogout);
    },
    methods: {
        handleSearch() {
            const keyword = this.$refs.inputs.value.trim()
            if (keyword) {
                let location = {
                    name: 'search',
                    // 合并当前路由的params和新的params
                    params: { ...this.$route.params, keyword },
                    // 合并当前路由的query
                    query: { ...this.$route.query }
                }
                this.$router.push(location)
            }
        },
        handleLogout() {
            console.log('执行退出登录，清除用户信息');
            // 清除localStorage中的用户信息
            localStorage.removeItem('UUIDTOKEN');
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // 直接清空本地userName
            this.userName = '';

            // 只有当当前不在首页时才跳转到首页，避免冗余导航错误
            if (this.$route.path !== '/home') {
                this.$router.replace('/home');
            }
        },
        // 初始化用户名的方法，增强健壮性并添加日志
        initUserName() {
            console.log('初始化用户名开始');
            try {
                // 从localStorage获取用户信息
                const userData = localStorage.getItem('user');
                console.log('localStorage用户数据:', userData);

                if (userData && userData !== 'null' && userData !== 'undefined') {
                    try {
                        const user = JSON.parse(userData);
                        console.log('解析后的用户信息:', user);
                        // 确保用户对象存在且有相应属性
                        if (user) {
                            this.userName = user.nickname || (user.phone ? user.phone.substring(0, 3) + '****' + user.phone.substring(7) : '');
                            console.log('设置的用户名为:', this.userName);
                            return;
                        }
                    } catch (parseError) {
                        console.error('解析用户数据失败:', parseError);
                    }
                }

                // 备选方案：从Vuex获取用户信息
                console.log('尝试从Vuex获取用户信息');
                if (this.$store && this.$store.state && this.$store.state.user &&
                    this.$store.state.user.userInfo && Object.keys(this.$store.state.user.userInfo).length > 0) {
                    const userInfo = this.$store.state.user.userInfo;
                    console.log('Vuex用户信息:', userInfo);
                    this.userName = userInfo.nickname || (userInfo.phone ? userInfo.phone.substring(0, 3) + '****' + userInfo.phone.substring(7) : '');
                    console.log('设置的用户名为:', this.userName);
                } else {
                    console.log('Vuex中没有有效的用户信息');
                    this.userName = '';
                }
            } catch (error) {
                console.error('初始化用户名时出错:', error);
                this.userName = '';
            }
            console.log('初始化用户名结束');
        }
    },
}

</script>

<style scoped lang="less">
.header {
    &>.top {
        background-color: #eaeaea;
        height: 30px;
        line-height: 30px;

        .container {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .loginList {
                float: left;

                p {
                    float: left;
                    margin-right: 10px;

                    .register {
                        border-left: 1px solid #b3aeae;
                        padding: 0 5px;
                        margin-left: 5px;
                    }
                }
            }

            .typeList {
                float: right;

                a {
                    padding: 0 10px;

                    &+a {
                        border-left: 1px solid #b3aeae;
                    }
                }

            }

        }
    }

    &>.bottom {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;

        .logoArea {
            float: left;

            .logo {
                img {
                    width: 175px;
                    margin: 25px 45px;
                }
            }
        }

        .searchArea {
            float: right;
            margin-top: 35px;

            .searchForm {
                overflow: hidden;

                input {
                    box-sizing: border-box;
                    width: 490px;
                    height: 32px;
                    padding: 0px 4px;
                    border: 2px solid #ea4a36;
                    float: left;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    height: 32px;
                    width: 68px;
                    background-color: #ea4a36;
                    border: none;
                    color: #fff;
                    float: left;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
}
</style>