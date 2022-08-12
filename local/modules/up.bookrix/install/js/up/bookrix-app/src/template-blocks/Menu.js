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
	computed:
		{

		},
	// language=Vue
	template: `
      <div class="menu">
      <div
          v-for="item in menuItems"
          class="menu-item">
        <a v-bind:href="item.link">{{ item.title }}</a>
      </div>
      </div>
		`
});