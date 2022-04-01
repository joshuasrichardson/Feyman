<template>
<div class="page">
	<h1>Browse</h1>
	<div class="article" v-for="article in articles" :key="article._id" @click="viewArticle(article._id)">
		<h2>{{article.title}}</h2>
		<h3>{{article.author}}</h3>
		<p class="date"><em>{{formatDate(article.created)}}</em></p>
		<p>{{getFirstPart(article.text)}}</p>
	</div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

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
		viewArticle(id) {
			this.$router.push({
				path: '/article/' + id,
			});
		},
		getFirstPart(text) {
			if (text.length < 300) {
				return text;
			}
			return text.substring(0, 300) + "...";
		},
		formatDate(date) {
			return moment(date).format('d MMMM, YYYY');
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

.article {
	border: solid 1px black;
	margin: 10px;
}

.article:hover {
	background-color: #999999;
}

p {
	text-align: left;
	margin: 20px;
}

p.date {
	margin: -10px -10px -10px 20px;
}

@media (min-width: 800px) {
	.article {
		width: 70%;
	}
}
</style>
