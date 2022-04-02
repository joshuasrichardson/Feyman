<template>
<div class="page">
	<h1>{{hasAccount ? "Login" : "Register"}}</h1>
	<form class="login" @submit.prevent="login">
		<div class="row">
			<label v-if="!hasAccount" for="firstName">First Name</label>
			<input v-if="!hasAccount" type="text" name="firstName" v-model="firstName">
		</div>
		<div class="row">
			<label v-if="!hasAccount" for="lastName">Last Name</label>
			<input v-if="!hasAccount" type="text" name="lastName" v-model="lastName">
		</div>
		<div class="row">
			<label for="username">Username</label>
			<input type="text" name="username" v-model="username">
		</div>
		<div class="row">
			<label for="password">Password</label>
			<input type="password" name="password" v-model="password">
		</div>
		<p>{{error}}</p>
		<button type="submit" name="submit" class="loginButton">{{hasAccount ? "Login" : "Register"}}</button>
	</form>
</div>
</template>

<script>
import axios from 'axios';

export default {
	name: "Login",
	props: {
		hasAccount: Boolean,
	},
	data() {
		return {
			firstName: "",
			lastName: "",
			username: "",
			password: "",
			error: "",
		}
	},
	methods: {
		async login() {
			let url = "/api/users";
			if (this.hasAccount) {
				url = "/api/users/login";
			} else if (!this.firstName || !this.lastName) {
				return;
			}
			try {
				this.error = '';
				if (!this.username || !this.password)
					return;
				let response = await axios.post(url, {
					username: this.username,
					firstName: this.firstName,
					lastName: this.lastName,
					password: this.password,
				});
				this.$root.$data.user = response.data.user;
				this.$router.push({
					path: '/'
				});
			} catch (error) {
				this.error = error.response.data.message;
				this.$root.$data.user = null;
			}
		},
	},
};
</script>

<style scoped>
.page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.login {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.loginButton {
	align-self: center;
}

.row {
	width: 100%;
	margin-left: 4px;
}

label,
input {
	margin: 8px;
}

input {
	width: 100%;
}

@media (min-width: 800px) {}
</style>
