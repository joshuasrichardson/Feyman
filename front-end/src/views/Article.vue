<template>
  <div>
		<div class="article-view" v-if="article">
			<h1>{{ this.article.data[0].title }}</h1>
				<h2>{{ this.article.data[0].author }}</h2>
			<div class="text">
				{{this.article.data[0].text}}
			</div>
		</div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
	name: "Article",
	data() {
		return {
			article: null,
		}
	},
	async created() {
		await this.getArticle();
	},
	methods: {
		//get the article using its
		async getArticle() {
			console.log("Viewing article...");
			try {
				let response = await axios.get("/api/articles/view/" + this.$root.$data.articleId);
				console.log(response);
				this.article = response;
			} catch (err) {
				console.log(err);
			}
		},
	}
};
</script>
