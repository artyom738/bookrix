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
        <div class="footer-menu-item">BOOKRIX</div>
        <div
            v-for="item in menuItems"
            class="footer-menu-item">
          <a v-bind:href="item.link">{{ item.title }}</a>
        </div>
      </div>
      <div class="footer-title">
        Bookrix, 2022
      </div>
      </footer>
		`
});