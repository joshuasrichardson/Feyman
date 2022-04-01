<template>
<div class="page">
	<h1>Browse</h1>
	<div class="article" v-for="article in articles" :key="article._id">
		<h2>{{article.title}}</h2>
		<h3>{{article.author}}</h3>
		<p>{{getFirstPart(article.text)}}</p>
	</div>
</div>
</template>

<script>
import axios from 'axios';

export default {
	name: "Browse",
	data() {
		return {
			articles: [],
		}
	},
	created() {
		this.getAllArticles();
	},
	methods: {
		async getAllArticles() {
			try {
				this.error = '';
				let response = await axios.get('/api/articles/all');
				this.articles = response.data;
			} catch (error) {
				this.error = error.response.data.message;
			}
		},
		getFirstPart(text) {
			if (text.length < 300) {
				return text;
			}
			return text.substring(0, 300) + "...";
		}
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
	align-items: flex-start;
}

.loginButton {
	align-self: center;
}

.row {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

label,
input {
	margin: 8px;
}

@media (min-width: 800px) {}
</style>
