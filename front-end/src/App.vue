<template>
<div id="app">
	<div id="nav">
		<router-link to="/">Home</router-link>
		<router-link v-if="user == null" to="/login">Login</router-link>
		<router-link v-if="user == null" to="/register">Register</router-link>
		<router-link v-if="user != null" to="/login" @click.native="logout()">Logout</router-link>
	</div>
	<router-view />
</div>
</template>

<script>
import axios from 'axios';

export default {
	name: "App",
	computed: {
		user() {
			return this.$root.$data.user;
		}
	},
	methods: {
		async logout() {
			try {
				await axios.delete("/api/users");
				this.$root.$data.user = null;
			} catch (error) {
				this.$root.$data.user = null;
			}
		},
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

a {
	padding: 5px;
}
</style>
