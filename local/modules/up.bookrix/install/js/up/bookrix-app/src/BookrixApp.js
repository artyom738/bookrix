import { Type } from 'main.core';
import { BitrixVue } from 'ui.vue';
import './template-blocks/Header';
import './template-blocks/Footer';
import './template-blocks/Navbar';
import './page-blocks/Page';
import './template-blocks/css/reset.css';

export class BookrixApp
{
	constructor(options)
	{
		this.data = options.data;
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNode = document.getElementById(options.rootNodeId);
		}
		else
		{
			throw new Error('BookrixApp: options.rootNodeId required');
		}
	}

	start()
	{
		this.attachTemplate(this.data);
	}

	attachTemplate(data)
	{
		BitrixVue.createApp({
			data()
			{
				this.data = data;
				return data;
			},
			// language=Vue
			template: `
              <div>
              <div class="header-container">
                <bookrix-header/>
              </div>
              <div class="container">
				
                <bookrix-navbar :componentName="data.COMPONENT"/>
                <bookrix-page :componentName="data.COMPONENT" :bookId="data.BOOK_ID"/>
              </div>
              <bookrix-footer/>
              </div>
			`,
		}).mount(this.rootNode);
	}
}