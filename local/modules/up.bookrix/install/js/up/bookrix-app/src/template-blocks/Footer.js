import { BitrixVue } from 'ui.vue';
import './css/Footer.css';
import { menuItems } from './Menu-Items';

BitrixVue.component('bookrix-footer', {
	data()
	{
		return {
			menuItems: menuItems,
		}
	},
	// language=Vue
	template: `
      <footer>
      <div class="footer-menu">
        <a class="footer-menu-item" href="/">BOOKRIX</a>
        <a
            v-for="item in menuItems"
			:href="item.link"
            class="footer-menu-item">
          {{ item.title }}
        </a>
      </div>
      <div class="footer-title">
        Bookrix, 2022
      </div>
      </footer>
		`
});