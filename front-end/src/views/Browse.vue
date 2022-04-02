<template>
<div class="page">
	<h1>Browse</h1>
	<input type="search" name="searchBar" v-model="query" placeholder="Search">
	<div v-if="user !== null">
		<label for="showMineOnly">Only show my saved articles</label>
		<input type="checkbox" name="showMineOnly" v-model="mineOnly">
	</div>
	{{error}}
	<div class="article" v-for="article in articles" :key="article._id">
		<button v-if="shouldShowSave(article._id)" type="button" name="save" @click="saveArticle(article._id)">Save</button>
		<button v-if="shouldShowUnsave(article._id)" type="button" name="unsave" @click="unsaveArticle(article._id)">Saved &#x2714;</button>
		<div @click="viewArticle(article._id)">
			<h2>{{article.title}}</h2>
			<h3>{{article.author}}</h3>
			<p class="date"><em>{{formatDate(article.created)}}</em></p>
			<p>{{getFirstPart(article.text)}}</p>
		</div>
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
			allArticles: [],
			savedArticles: [],
			mineOnly: false,
			query: '',
		}
	},
	async created() {
		await this.getAllArticles();
		this.getSavedArticles();
	},
	methods: {
		async getAllArticles() {
			try {
				this.error = '';
				let response = await axios.get('/api/articles/all');
				this.allArticles = response.data;
			} catch (error) {
				this.error = error.response.data.message;
			}
		},
		async saveArticle(articleId) {
			try {
				let response = await axios.put('/api/users/' + articleId);
				this.$root.$data.user = response.data.user;
				await this.getSavedArticles();
			} catch (error) {
				console.log(error);
			}
		},
		async unsaveArticle(articleId) {
			try {
				let response = await axios.put('/api/users/' + articleId, {
					remove: true
				});
				this.$root.$data.user = response.data.user;
				await this.getSavedArticles();
			} catch (error) {
				console.log(error);
			}
		},
		async getSavedArticles() {
			console.log("Getting saved articles");
			try {
				this.savedArticles = this.allArticles.filter(article => {
					if (this.user.savedArticles.includes(article._id)) {
						return article;
					}
				});
			} catch (error) {
				console.log(error);
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
		shouldShowSave(articleId) {
			return this.user !== null && !this.user.savedArticles.includes(articleId);
		},
		shouldShowUnsave(articleId) {
			return this.user !== null && this.user.savedArticles.includes(articleId);
		},
	},
	computed: {
		user() {
			return this.$root.$data.user;
		},
		articles() {
			let articles = this.allArticles;
			if (this.mineOnly) {
				articles = this.savedArticles;
			}
			if (this.query !== '') {
				articles = articles.filter(article => {
					if (article.title.toLowerCase().includes(this.query.toLowerCase()) ||
						article.author.toLowerCase().includes(this.query.toLowerCase())) {
						return article;
					}
				});
			}
			return articles;
		}
	}
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
