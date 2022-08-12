(function (exports,main_core,ui_vue) {
	'use strict';

	var menuItems = [{
	  'link': '/',
	  'title': 'На главную'
	}, {
	  'link': '/booklist',
	  'title': 'Список книг'
	}, {
	  'link': '/add',
	  'title': 'Добавить книгу'
	}];

	ui_vue.BitrixVue.component('bookrix-menu', {
	  data: function data() {
	    return {
	      menuItems: menuItems
	    };
	  },
	  computed: {},
	  // language=Vue
	  template: "\n      <div class=\"menu\">\n      <div\n          v-for=\"item in menuItems\"\n          class=\"menu-item\">\n        <a v-bind:href=\"item.link\">{{ item.title }}</a>\n      </div>\n      </div>\n\t\t"
	});

	ui_vue.BitrixVue.component('bookrix-header', {
	  // language=Vue
	  template: "\n\t\t<div class=\"header\">\n\t\t\t<div class=\"header-title\">\n\t\t\t\t<a href=\"/\">BOOKRIX</a>\n\t\t\t</div>\n\t\t<bookrix-menu/>\n\t\t</div>\n\t\t"
	});

	ui_vue.BitrixVue.component('bookrix-footer', {
	  data: function data() {
	    return {
	      menuItems: menuItems
	    };
	  },
	  // language=Vue
	  template: "\n      <footer>\n      <div class=\"footer-menu\">\n        <div class=\"footer-menu-item\">BOOKRIX</div>\n        <div\n            v-for=\"item in menuItems\"\n            class=\"footer-menu-item\">\n          <a v-bind:href=\"item.link\">{{ item.title }}</a>\n        </div>\n      </div>\n      <div class=\"footer-title\">\n        Bookrix, 2022\n      </div>\n      </footer>\n\t\t"
	});

	// noinspection HtmlUnknownAttribute
	ui_vue.BitrixVue.component('bookrix-navbar', {
	  props: ['componentName'],
	  data: function data() {
	    return {
	      items: []
	    };
	  },
	  created: function created() {
	    this.loadItems(this.componentName);
	  },
	  methods: {
	    loadItems: function loadItems(componentName) {
	      switch (componentName) {
	        case 'main':
	          this.items.push({
	            'text': 'Главная',
	            'link': '/'
	          });
	          break;

	        case 'add':
	          this.items.push({
	            'text': 'Главная',
	            'link': '/'
	          });
	          this.items.push({
	            'text': 'Добавить книгу',
	            'link': '/add'
	          });
	          break;

	        case 'booklist':
	          this.items.push({
	            'text': 'Главная',
	            'link': '/'
	          });
	          this.items.push({
	            'text': 'Список книг',
	            'link': '/booklist'
	          });
	          break;

	        case 'detailed':
	          this.items.push({
	            'text': 'Главная',
	            'link': '/'
	          });
	          this.items.push({
	            'text': 'Список книг',
	            'link': '/booklist'
	          });
	          this.items.push({
	            'text': 'Название книги',
	            'link': '#'
	          });
	          break;
	      }
	    }
	  },
	  // language=Vue
	  template: "\n      <div class=\"bookrix-navbar\">\n      <template v-for=\"(item, index) in this.items\">\n\t\t<a v-bind:href=\"item.link\">{{item.text}}</a>\n\t\t\n\t\t<template v-if=\"index < items.length - 1\"> - </template>\n\t  </template>\n      </div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-book', {
	  props: ['book', 'showDesc', 'bookId'],
	  data: function data() {
	    return {
	      fieldsMap: {
	        'AUTHORNAME': 'Автор',
	        'RATING': 'Рейтинг',
	        'PAGES': 'Страниц'
	      }
	    };
	  },
	  methods: {
	    getDate: function getDate(date) {
	      return BX.date.format('d F Y', date);
	    }
	  },
	  computed: {
	    getBook: function getBook() {
	      var _this = this;

	      if (!this.book) {
	        BX.ajax.runAction('up:bookrix.bookcontroller.getById', {
	          data: {
	            'id': this.bookId
	          }
	        }).then(function (response) {
	          _this.book = response.data;
	          return response.data;
	        })["catch"](function (response) {
	          console.error(response.errors);
	        });
	      }

	      return this.book;
	    }
	  },
	  mounted: function mounted() {
	    this.getBook();
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"book-item\">\n\t\t\t<div class=\"book-item-title\">\n\t\t\t  <template v-if=\"book.ID\">\n              \t<a v-bind:href=\"'/books/' + book.ID\">{{ book.TITLE }}</a>\n              </template>\n\t\t\t  <template v-else>\n\t\t\t\t{{ book.TITLE }}\n\t\t\t  </template>\n\t\t\t</div>\n\t\t\t\n            <template v-for=\"(value, index) in book\">\n\t\t\t  <template v-if=\"(Object.keys(fieldsMap)).includes(index)\">\n                <div class=\"book-item-spec\">\n\t\t\t\t  {{ fieldsMap[index] }}: {{value}}\n\t\t\t\t</div>\n\t\t\t  </template>\n\t\t\t  <template v-else-if=\"index === 'DATE_ADD'\">\n\t\t\t\t<div class=\"book-item-spec\">\n\t\t\t\t  \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430:  {{getDate(value)}}\n\t\t\t\t</div>\n\t\t\t  </template>\n\t\t\t  <template v-else-if=\"index === 'DESCRIPTION' && showDesc\">\n                <div class=\"book-item-spec\">\n                  \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:  {{value}}\n                </div>\n\t\t\t  </template>\n            </template>\n\t\t</div>\n\t\t"
	});

	ui_vue.BitrixVue.component('bookrix-booklist', {
	  props: ['isMainPage'],
	  data: function data() {
	    return {
	      books: [],
	      arrayBooks: [],
	      title: 'Загрузка...'
	    };
	  },
	  created: function created() {
	    this.loadBooks();
	  },
	  methods: {
	    loadBooks: function loadBooks() {
	      var _this = this;

	      var params = {
	        'limit': 3,
	        'order': {
	          'RATING': 'DESC'
	        }
	      };
	      BX.ajax.runAction('up:bookrix.bookcontroller.getBooks', {
	        data: {
	          params: params
	        }
	      }).then(function (response) {
	        response.data.forEach(function (item) {
	          this.books.push(item);
	        }, _this);
	        _this.title = 'Список книг';
	      })["catch"](function (response) {
	        return console.error(response.errors);
	      });
	    },
	    getBooks: function getBooks() {
	      this.books = [{
	        "id": 50,
	        "title": "111",
	        "author": "dfdsf",
	        "pages": "200"
	      }, {
	        "id": 58,
	        "title": "188",
	        "author": "888",
	        "pages": "57"
	      }];
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"book-list\">\n\t\t<div class=\"book-list-title\">\n\t\t  {{title}}\n\t\t</div>\n\t\t<template v-for=\"book in this.books\">\n\t\t  <bookrix-book :book=\"book\" :showDesc=\"!isMainPage\"/>\n\t\t</template>\n\t\t</div>\n\t\t"
	});

	ui_vue.BitrixVue.component('bookrix-book-filters', {
	  props: [],
	  data: function data() {
	    return {
	      authors: [],
	      pages: {}
	    };
	  },
	  created: function created() {
	    this.getAuthors();
	    this.getLimitPages();
	  },
	  methods: {
	    getAuthors: function getAuthors() {
	      var _this = this;

	      BX.ajax.runAction('up:bookrix.bookcontroller.getAuthors').then(function (response) {
	        response.data.forEach(function (item) {
	          this.authors.push(item);
	        }, _this);
	      })["catch"](function (response) {
	        return console.error(response.errors);
	      });
	    },
	    getLimitPages: function getLimitPages() {
	      var _this2 = this;

	      BX.ajax.runAction('up:bookrix.bookcontroller.getMinMaxPages').then(function (response) {
	        _this2.pages.min = response.data.min;
	        _this2.pages.max = response.data.max;
	      });
	    }
	  },
	  // language=Vue
	  template: "\n      <div class=\"bookrix-filters\">\n      <div class=\"bookrix-filter-title\">\u0424\u0438\u043B\u044C\u0442\u0440\u044B</div>\n\t  <div class=\"bookrix-filter\">\n\t\t<div class=\"bookrix-filter-subtitle\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438</div>\n        <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n          <input type=\"text\" class=\"ui-ctl-element\" name=\"book-name\" id=\"book-name\">\n\t\t</div>\n\t  </div>\n\n      <div class=\"bookrix-filter\">\n        <div class=\"bookrix-filter-subtitle\">\u0410\u0432\u0442\u043E\u0440</div>\n\t\t<div class=\"bookrix-filter-authors\">\n          <template v-for=\"(item, index) in authors\">\n\t\t\t<div class=\"bookrix-filter-author\">\n              <input type=\"checkbox\" name=\"book-author\" :id=\"item.ID\">\n              <label :for=\"item.ID\">{{item.NAME}}</label>\n\t\t\t</div>\n            \n          </template>\n\t\t</div>\n      </div>\n\n      <div class=\"bookrix-filter\">\n        <div class=\"bookrix-filter-subtitle\">\u0421\u0442\u0440\u0430\u043D\u0438\u0446</div>\n\t\t<div class=\"bookrix-filter-pages\">\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n            <input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u043E\u0442\">\n          </div>\n\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n            <input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u0434\u043E\">\n          </div>\n\t\t</div>\n        \n      </div>\n\n      <div class=\"bookrix-filter\">\n        <div class=\"bookrix-filter-subtitle\">\u0420\u0435\u0439\u0442\u0438\u043D\u0433</div>\n        <div class=\"bookrix-filter-pages\">\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n            <input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u043E\u0442\">\n          </div>\n\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n            <input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u0434\u043E\">\n          </div>\n        </div>\n      </div>\n      </div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-add-book', {
	  data: function data() {
	    return {
	      title: '',
	      author: '',
	      rating: '',
	      pages: '',
	      description: '',
	      errorMessage: ''
	    };
	  },
	  methods: {
	    checkFields: function checkFields() {
	      if (!BX.type.isNotEmptyString(this.rating) || !BX.type.isNotEmptyString(this.author) || !BX.type.isNotEmptyString(this.pages) || !BX.type.isNotEmptyString(this.description) || !BX.type.isNotEmptyString(this.title)) {
	        return 'Все поля обязательны к заполнению!';
	      }

	      if (!this.rating.match('^\\d{1,2}$|100')) {
	        return 'Поле "Рейтинг" должно быть числом до 100';
	      }

	      if (!this.pages.match('^\\d*$')) {
	        return 'Поле "Страницы" должно быть числом';
	      }

	      return '';
	    },
	    save: function save() {
	      var checkResult = this.checkFields();

	      if (checkResult !== '') {
	        BX.UI.Notification.Center.notify({
	          content: checkResult
	        });
	        return;
	      }

	      var params = {
	        'TITLE': this.title,
	        'AUTHOR': this.author,
	        'RATING': this.rating,
	        'PAGES': this.pages,
	        'DESCRIPTION': this.description
	      };
	      BX.ajax.runAction('up:bookrix.bookcontroller.addBook', {
	        data: {
	          data: params
	        }
	      }).then(function (response) {
	        BX.UI.Notification.Center.notify({
	          content: "Книга сохранена!"
	        });
	      })["catch"](function (response) {
	        BX.UI.Notification.Center.notify({
	          content: "Ошибка сохранения книги!"
	        });
	        console.error(response.errors);
	      });
	      this.title = '';
	      this.author = '';
	      this.rating = '';
	      this.pages = '';
	      this.description = '';
	    }
	  },
	  computed: {},
	  // language=Vue
	  template: "\n      <div class=\"add-container\">\n\t  <div class=\"add-book-title\">\n\t\t\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438\n\t  </div>\n      <div class=\"add-book\">\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"title\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"author\" placeholder=\"\u0410\u0432\u0442\u043E\u0440\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"rating\" placeholder=\"\u0420\u0435\u0439\u0442\u0438\u043D\u0433\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"pages\" placeholder=\"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textarea\">\n            <textarea class=\"ui-ctl-element\" v-model=\"description\" placeholder=\"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435\"></textarea>\n          </div>\n        </template>\n        <br>\n        <button class=\"ui-btn ui-btn-icon-add ui-btn-success\" v-on:click=\"save()\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n      </div>\n\n      <bookrix-book :book=\"{\n          'TITLE': title, \n          'AUTHORNAME': author, \n          'RATING': rating, \n          'PAGES': pages,\n          'DESCRIPTION': description\n      }\" :showDesc=\"true\"/>\n      </div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-page', {
	  props: ['componentName', 'bookId'],
	  computed: {},
	  // language=Vue
	  template: "\n      <div class=\"page-container\">\n      <template v-if=\"componentName === 'main'\">\n        <bookrix-booklist :isMainPage=\"true\"/>\n      </template>\n\n      <template v-if=\"componentName === 'add'\">\n        <bookrix-add-book/>\n      </template>\n\n      <template v-if=\"componentName === 'booklist'\">\n        <div class=\"booklist-container\">\n          <bookrix-book-filters/>\n\n          <bookrix-booklist :isMainPage=\"false\"/>\n\n        </div>\n      </template>\n\n      <template v-if=\"componentName === 'detailed'\">\n        <bookrix-book :bookId=\"bookId\" :showDesc=\"true\"/>\n      </template>\n      </div>\n\t"
	});

	var BookrixApp = /*#__PURE__*/function () {
	  function BookrixApp(options) {
	    babelHelpers.classCallCheck(this, BookrixApp);
	    this.data = options.data;

	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNode = document.getElementById(options.rootNodeId);
	    } else {
	      throw new Error('BookrixApp: options.rootNodeId required');
	    }
	  }

	  babelHelpers.createClass(BookrixApp, [{
	    key: "start",
	    value: function start() {
	      this.attachTemplate(this.data);
	    }
	  }, {
	    key: "attachTemplate",
	    value: function attachTemplate(_data) {
	      ui_vue.BitrixVue.createApp({
	        data: function data() {
	          this.data = _data;
	          return _data;
	        },
	        // language=Vue
	        template: "\n              <div>\n              <div class=\"header-container\">\n                <bookrix-header/>\n              </div>\n              <div class=\"container\">\n\t\t\t\t\n                <bookrix-navbar :componentName=\"data.COMPONENT\"/>\n                <bookrix-page :componentName=\"data.COMPONENT\" :bookId=\"data.BOOK_ID\"/>\n              </div>\n              <bookrix-footer/>\n              </div>\n\t\t\t"
	      }).mount(this.rootNode);
	    }
	  }]);
	  return BookrixApp;
	}();

	exports.BookrixApp = BookrixApp;

}((this.BX = this.BX || {}),BX,BX));
