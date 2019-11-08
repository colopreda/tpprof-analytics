<style>

#logo {
    height: 30px;
    min-height: 30px;
}

.navbar {
    height: 50px;
    min-height: 50px;
}

#nav a.router-link-exact-active {
    color: black!important;
}

#nav a {
    font-weight: normal!important;
}

.navbar-text {
    color: black!important;
    white-space: nowrap;
}

.navbar-dark .navbar-nav .nav-link {
    color: black!important;
    font-weight: normal!important;
}

.bold {
    font-weight: bold!important;
}

.normal {
    font-weight: normal!important;
}

</style>

<template>

<div>
    <b-navbar toggleable="lg" type="dark" variant="light">
        <router-link to="/"><img id="logo" src="@/assets/motion-s.png" alt=""></router-link>
        <b-navbar-nav v-if="isLoggedIn" id="nav">
            <b-nav-text :class="checkSelected('/')"><router-link to="/">Home&nbsp;</router-link></b-nav-text>
            <b-nav-text v-if="is('trip')" class="normal">|</b-nav-text>
            <b-nav-text v-if="is('trip')" :class="checkSelected('trip')">&nbsp;Main</b-nav-text>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav v-if="isLoggedIn" class="ml-auto">
            <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template slot="button-content">{{currentUser.firstName + ' ' + currentUser.lastName}}</template>
                <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>
</div>

</template>

<script>
    import {authService} from "../_services/authentication.service";

    export default {
        name: "TheHeader",
        methods: {
            logOut: function () {
                // reset login status
                this.$store.dispatch('authentication/logout');
            },
            checkSelected: function(route) {
                if (this.$route.path === '/') {
                    return 'bold'
                } else {
                    if (this.$route.path.includes(route) && route.length > 1) {
                        return 'bold'
                    } else {
                        return 'normal'
                    }
                }
            },
            is: function (route) {
                let path = this.$route.path;
                if (path.includes('fleet') && route === 'fleet') {
                    return true;
                } else if (path.includes('driver') && (route === 'driver' || route === 'fleet')) {
                    return true;
                } else return path.includes('trip') && (route === 'driver' || route === 'fleet' || route === 'trip');
            }
        },
        computed: {
            isLoggedIn() {
                return this.currentUser !== null;
            }
        },
        data () {
            return {
                currentUser: null
            };
        },
        created () {
            authService.currentUser.subscribe(x => {
                this.currentUser = x;
            });
        },
    }
</script>
