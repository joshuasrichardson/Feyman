<template>
<div class="article-view" v-if="article">
	<p>Tip: To see a word's definition, <strong>select it</strong> and <strong>hover over it</strong>, or scroll to the bottom of the page.</p>
	<h1><em>{{ this.article.data[0].title }}</em></h1>
	<h4>{{ this.article.data[0].author }}</h4>
	<div class="text">
		<button :title="word.def" :class="word.class" v-for="word in this.tokens" :key="word._id" @click="selectKeyword(word)">
			{{ word.token }}
		</button>
	</div>
	<hr>
	<h3>Definitions</h3>
	<div class="definition-list" v-for="key in keywords" :key="key._id">
			<li><strong>{{key.token}}</strong>: {{key.def}}</li>
	</div>
</div>
<div class="no-article" v-else>
	<p>No article to display. Select an article from the 'Browse' page.</p>
</div>
</template>

<script>
import axios from 'axios';
export default {
	name: "Article",
	data() {
		return {
			article: null,
			tokens: [],
			//keywords: [],
			count: 0,
		}
	},
	async created() {
		await this.getArticle();
	},
	methods: {
		//get the definition of a word from the dicitonary API
		async fetchDef(word) {
			try {
				let response = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
				//console.log(response);
				//console.log(response.data[0].meanings[0].definitions[0].definition);
				return response.data[0].meanings[0].definitions[0].definition;
			} catch (err) {
				console.log("Sorry, we couldn't find a definition for that word...");
				console.log(err);
			}
		},
		//used to split words separated by special characters so that they are read in as two separate words
		splitWords(word) {
			let splitTokens;
			if (word.includes("-")) {
				splitTokens = word.split("-");
			}
			if (word.includes("—")) {
				splitTokens = word.split("—");
			}
			if (word.includes("_")) {
				splitTokens = word.split("_");
			}
			if (splitTokens) {
				//console.log(splitTokens);
				this.tokens.push({
					_id: this.count,
					token: splitTokens[0],
					class: "text-token",
					def: "",
					selected: false
				});
				this.count++;
				this.tokens.push({
					_id: this.count,
					token: splitTokens[1],
					class: "text-token",
					def: "",
					selected: false
				});
				this.count++;
				return true;
			}
			return false;
		},
		//GET the article using its _id
		async getArticle() {
			console.log("Viewing article...");
			try {
				let response = await axios.get("/api/articles/view/" + this.$root.$data.articleId);
				//console.log(response);
				this.article = response;
				let words = this.article.data[0].text.split(" ");
				for (let word of words) {
					if (this.splitWords(word)) {
						continue;
					}
					this.tokens.push({
						_id: this.count,
						token: word,
						class: "text-token",
						def: "",
						selected: false
					});
					this.count++;
				}
			} catch (err) {
				console.log(err);
			}
		},
		//insert/remove the word into/from the keyword list and filter out any punctuation
		async selectKeyword(word) {
			word.selected = !word.selected;
			const punctuation = '!"#$%&\'()*+,./:;<=>?@[\\]^_`{|}~';
			let letters = word.token.toLowerCase().split("");
			letters = letters.filter(letter => !punctuation.includes(letter));
			let copy = letters.join("");
			if (!word.selected) {
				word.class = "text-token";
				//this.keywords = this.keywords.filter(keyword => keyword !== copy);
				console.log(copy + " removed");
				//console.log(this.keywords);
				return;
			}
			let def = await this.fetchDef(copy);
			def ? word.def = def : word.def = "Sorry, we couldn't find a definition..."
			word.class = "text-token highlighted";
			console.log(copy + " added");
			//this.keywords.push({_id: word._id, word: copy, definition: def});
		},
	},
	computed: {
		keywords() { //FIXME words also include puncuation when showing definition
			return this.tokens.filter(token => token.selected === true);
		},
	},
};
</script>
<style scoped>
.article-view {
	min-height: 80vh;
	margin: 0 10px 10px 10px;
}
.article-view p {
	margin-top: 10px;
	font-size: 17px;
}
.article-view h1 {
	margin-top: 10px;
}
.text {
	display: flex;
	flex-wrap: wrap;
}
.text-token {
	border-style: none;
	font-size: 20px;
}
.highlighted {
	background-color: yellow;
}
.text-token:hover {
	background-color: rgba(0, 0, 0, 0.3);
}
.no-article {
	height: 85vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
.definition-list {
	text-align: left;
	border: solid 1px black;
	font-size: 20px;
	list-style: none;
	margin-top: 5px;
	padding-left: 5px;
}
@media (min-width: 800px) {
	.article-view {
		margin: 0 100px 20px 100px;
	}
}
</style>
