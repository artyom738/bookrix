import { BitrixVue } from 'ui.vue';
import './css/Menu.css';
import { menuItems } from './Menu-Items';

BitrixVue.component('bookrix-menu', {
	data()
	{
		return {
			menuItems: menuItems,
		}
	},
	// language=Vue
	template: `
      <div class="menu">
      <a
          v-for="item in menuItems"
		  :href="item.link"
          class="menu-item">
        {{ item.title }}
      </a>
      </div>
		`
});