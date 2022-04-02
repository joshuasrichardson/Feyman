<template>
<div class="home">
	<div class="nav">
		<!--create the nav bar here (bootstrap?)-->
	</div>
	<div class="header">
		<h1>Tough reading assignment? We can help.</h1>
	</div>
	<div class="article-entry">
		<form class="article-entry-form" @submit.prevent="submitText">
			<div class="form-top">
				<div class="form-header">
					<input type="text" placeholder="Title" v-model="title">
					<input type="text" placeholder="Author" v-model="author">
				</div>
				<input type="submit" />
			</div>
			<textarea placeholder="Paste article here..." rows="45" cols="90" v-model="text"></textarea>
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
				this.title = "";
				this.author = "";
				this.text = "";
			} catch (error) {
				console.log(error);
			}
		},
	}
};
</script>

<style scoped>
.article-entry,
.article-entry-form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.form-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	width: 100%;
}

.form-header {
	display: flex;
	flex-direction: column;
	align-self: flex-start;
}

textarea {
	max-width: 100%;
}

input,
textarea {
	margin-top: 8px;
}

input[type="submit"] {
	width: 200px;
	height: 30px;
}

@media (min-width: 800px) {
	.article-entry-form {
		width: 70%;
	}
}
</style>
