import { BitrixVue } from 'ui.vue';
import './Book-List';
import './Book-Filters';
import './Add-Book';
import './css/Page.css';

BitrixVue.component('bookrix-page', {
	props: ['componentName', 'bookId'],
	computed: {

	},
	// language=Vue
	template: `
		<div class="page-container">
			<bookrix-add-book v-if="componentName === 'add'"/>
			
			<div class="booklist-container" v-else-if="componentName === 'booklist'">
				<bookrix-book-filters/>
				<bookrix-booklist :isMainPage="false"/>
			</div>
			
			<bookrix-book
				v-else-if="componentName === 'detailed'"
				:bookId="bookId" 
				:showDesc="true"
				:isDetailed="true"
			/>
			
			<bookrix-booklist
				v-else
				:isMainPage="true"
			/>
		</div>
	`,
});