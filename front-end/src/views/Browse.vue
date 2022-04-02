<template>
<div class="page">
	<h1>Browse Articles</h1>
	<input type="search" name="searchBar" v-model="query" placeholder="Search" style="text-align: center;">
	<div class="mine" v-if="user !== null">
		<label for="showMineOnly">Only show my saved articles</label>
		<input class="check" type="checkbox" name="showMineOnly" v-model="mineOnly">
	</div>
	{{error}}
	<div class="article" v-for="article in articles" :key="article._id">
		<div class="buttons">
			<button v-if="shouldShowSave(article._id)" type="button" class="save" name="save" @click="saveArticle(article._id)">Save</button>
			<button v-if="shouldShowUnsave(article._id)" type="button" class="save" name="unsave" @click="unsaveArticle(article._id)">Saved &#x2714;</button>
			<button v-if="isMine(article._id)" type="button" class="delete" name="delete" @click="deleteArticle(article._id)">&#x1f5d1;</button>
		</div>
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
		async deleteArticle(articleId) {
			try {
				await axios.delete('/api/articles/' + articleId);
				console.log("deleted");
				await this.unsaveArticle(articleId);
				await this.getAllArticles();
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
		isMine(id) {
			let article = this.allArticles.find(item => item._id === id);
			console.log("article:", article);
			console.log("user:", this.user);
			return article !== null && this.user !== null && article.user === this.user._id;
		},
		viewArticle(id) {
			this.$root.$data.articleId = id;
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
	min-height: 80vh;
}

h1 {
	margin: 10px;
}

.mine {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 8px;
}

input[type="checkbox"] {
	margin: 8px;
	border: 0.15em solid currentColor;
	border-radius: 0.15em;
	width: 1.15em;
	height: 1.15em;
	transform: translateY(-0.2em);
}

.article {
	width: 95%;
	border: solid 1px black;
	border-radius: 5px;
	margin: 10px;
	display: flex;
	flex-direction: column;
}

.article:hover {
	background-color: #999999;
}

h2 {
	margin-top: 0;
}

p {
	text-align: left;
	margin: 20px;
}

p.date {
	margin: -10px -10px -10px 20px;
}

.buttons {
	display: flex;
	justify-content: space-between;
}

.save {
	margin: 10px 0 0 10px;
}

.delete {
	margin: 10px 10px 0 0;
}

@media (min-width: 800px) {
	.article {
		min-width: 70%;
		width: 70%;
	}
}
</style>
