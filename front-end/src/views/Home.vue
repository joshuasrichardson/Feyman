<template>
<div class="home">
	<div class="nav">
		<!--create the nav bar here (bootstrap?)-->
	</div>
	<div class="header">
		<h2>Tough reading assignment? We can help.</h2>
	</div>
	<div class="article-entry">
		<form class="article-entry-form" @submit.prevent="submitText">
			<input type="text" placeholder="Title" v-model="title">
			<input type="text" placeholder="Author" v-model="author">
			<textarea placeholder="Paste article here..." rows="45" cols="90" v-model="text"></textarea>
			<input type="submit" />
		</form>
	</div>
</div>
</template>

<script>
import axios from 'axios';
export default {
	name: "Home",
	data() {
		return {
			title: "",
			author: "",
			text: "",
		}
	},
	methods: {
		async submitText() {
			try {
				await axios.post('/api/articles', {
					title: this.title,
					author: this.author,
					text: this.text,
				});
			} catch (error) {
				console.log(error);
			}
		},
	}
};
</script>
