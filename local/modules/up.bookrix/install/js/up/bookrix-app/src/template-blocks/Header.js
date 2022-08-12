import { BitrixVue } from 'ui.vue';
import './css/Header.css';
import './Menu';

BitrixVue.component('bookrix-header', {
	// language=Vue
	template: `
		<div class="header">
			<div class="header-title">
				<a href="/">BOOKRIX</a>
			</div>
		<bookrix-menu/>
		</div>
		`
});