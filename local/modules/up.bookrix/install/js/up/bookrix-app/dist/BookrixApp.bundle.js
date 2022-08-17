(function (exports,main_core,events_js,ui_vue) {
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

	ui_vue.BitrixVue.component('bookrix-navbar', {
	  props: ['componentName', 'bookId'],
	  data: function data() {
	    return {
	      items: []
	    };
	  },
	  created: function created() {
	    this.loadItems(this.componentName);
	  },
	  methods: {
	    getBookName: function getBookName() {
	      return BX.ajax.runAction('up:bookrix.bookcontroller.getById', {
	        data: {
	          'id': this.bookId
	        }
	      });
	    },
	    loadItems: function loadItems(componentName) {
	      var _this = this;

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
	          this.getBookName().then(function (response) {
	            _this.bookTitle = response.data['TITLE'];

	            _this.items.push({
	              'text': _this.bookTitle,
	              'link': '#'
	            });
	          });
	          break;
	      }
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"bookrix-navbar\">\n\t\t<template v-for=\"(item, index) in this.items\">\n\t\t\t<a v-bind:href=\"item.link\">{{item.text}}</a>\n\t\t<template v-if=\"index < items.length - 1\"> - </template>\n\t  </template>\n      </div>\n\t"
	});

	var BooksGetter = /*#__PURE__*/function () {
	  function BooksGetter() {
	    babelHelpers.classCallCheck(this, BooksGetter);
	  }

	  babelHelpers.createClass(BooksGetter, null, [{
	    key: "getBooks",
	    value: function getBooks(params) {
	      var books = [];
	      return BX.ajax.runAction('up:bookrix.bookcontroller.getBooks', {
	        data: {
	          params: params
	        }
	      }).then(function (response) {
	        response.data.forEach(function (item) {
	          books.push(item);
	        });
	        return books;
	      })["catch"]();
	    }
	  }, {
	    key: "getBookById",
	    value: function getBookById(bookId) {
	      return BX.ajax.runAction('up:bookrix.bookcontroller.getById', {
	        data: {
	          'id': bookId
	        }
	      }).then(function (response) {
	        return response.data;
	      });
	    }
	  }, {
	    key: "getAuthors",
	    value: function getAuthors() {
	      var authors = [];
	      return BX.ajax.runAction('up:bookrix.bookcontroller.getAuthors').then(function (response) {
	        response.data.forEach(function (item) {
	          authors.push(item);
	        });
	        return authors;
	      });
	    }
	  }, {
	    key: "getMinMaxPages",
	    value: function getMinMaxPages() {
	      var pages = {};
	      return BX.ajax.runAction('up:bookrix.bookcontroller.getMinMaxPages').then(function (response) {
	        pages.min = response.data.min;
	        pages.max = response.data.max;
	        return pages;
	      });
	    }
	  }]);
	  return BooksGetter;
	}();

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
	  created: function created() {
	    this.loadBook();
	  },
	  methods: {
	    getDate: function getDate(date) {
	      return BX.date.format('d F Y', date);
	    },
	    loadBook: function loadBook() {
	      var _this = this;

	      if (!this.book) {
	        BooksGetter.getBookById(this.bookId).then(function (response) {
	          _this.book = response;
	        });
	      }
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"book-item\">\n\t\t\t<div class=\"book-item-title\" v-if=\"book.ID\">\n\t\t\t\t<a v-bind:href=\"'/books/' + book.ID\">{{ book.TITLE }}</a>\n\t\t\t</div>\n\t\t\t<div class=\"book-item-title\" v-else>\n\t\t\t\t{{ book.TITLE }}\n\t\t\t</div>\n\n\t\t\t<template v-for=\"(value, index) in book\">\n\t\t\t\t<div class=\"book-item-spec\" v-if=\"(Object.keys(fieldsMap)).includes(index)\">\n\t\t\t\t\t{{ fieldsMap[index] }}: {{value}}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"book-item-spec\" v-else-if=\"index === 'DATE_ADD'\">\n\t\t\t\t\t\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430: {{getDate(value)}}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"book-item-spec\" v-else-if=\"index === 'DESCRIPTION' && showDesc\">\n\t\t\t\t\t\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435: {{value}}\n\t\t\t\t</div>\n\t\t\t</template>\n\t\t</div>\n\t"
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
	      BooksGetter.getBooks(params).then(function (response) {
	        _this.books = response;
	        _this.title = 'Список книг';
	      });
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
	      pages: {},
	      filters: {
	        title: '',
	        authors: [],
	        pages: {
	          min: 0,
	          max: 0
	        },
	        rating: {
	          min: 0,
	          max: 100
	        }
	      }
	    };
	  },
	  mounted: function mounted() {
	    var _this = this;

	    this.getAuthors();
	    BooksGetter.getMinMaxPages().then(function (response) {
	      _this.filters.pages.max = response.max;
	    });
	  },
	  methods: {
	    getAuthors: function getAuthors() {
	      var _this2 = this;

	      BooksGetter.getAuthors().then(function (response) {
	        _this2.authors = response;
	      });
	    },
	    addAuthor: function addAuthor(id) {
	      if (BX.util.in_array(id, this.filters.authors)) {
	        var index = this.filters.authors.indexOf(id);
	        this.filters.authors.splice(index, 1);
	      } else {
	        this.filters.authors.push(id);
	      }

	      return id;
	    },
	    reloadFilters: function reloadFilters() {
	      events_js.EventEmitter.emit('Bookrix.refreshBooks');
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"bookrix-filters\">\n\t\t\t<div class=\"bookrix-filter-title\">\u0424\u0438\u043B\u044C\u0442\u0440\u044B</div>\n\t\t\t{{filters}}\n\t\t\t<div class=\"bookrix-filter\">\n\t\t\t\t<div class=\"bookrix-filter-subtitle\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438</div>\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n\t\t\t\t\t<input type=\"text\" class=\"ui-ctl-element\" name=\"book-name\" id=\"book-name\" v-model=\"filters.title\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"bookrix-filter\">\n\t\t\t\t<div class=\"bookrix-filter-subtitle\">\u0410\u0432\u0442\u043E\u0440</div>\n\t\t\t\t<div class=\"bookrix-filter-authors\">\n\t\t\t\t\t<div class=\"bookrix-filter-author\" v-for=\"(item, index) in authors\">\n\t\t\t\t\t\t<input type=\"checkbox\" name=\"book-author\" :id=\"item.ID\" @click=\"addAuthor(item.ID)\">\n\t\t\t\t\t\t<label :for=\"item.ID\">{{item.NAME}}</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t<div class=\"bookrix-filter\">\n\t\t\t<div class=\"bookrix-filter-subtitle\">\u0421\u0442\u0440\u0430\u043D\u0438\u0446</div>\n\t\t\t<div class=\"bookrix-filter-pages\">\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t<input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u043E\u0442\" v-model=\"filters.pages.min\">\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t<input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u0434\u043E\"  v-model=\"filters.pages.max\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t\t<div class=\"bookrix-filter\">\n\t\t\t<div class=\"bookrix-filter-subtitle\">\u0420\u0435\u0439\u0442\u0438\u043D\u0433</div>\n\t\t\t<div class=\"bookrix-filter-pages\">\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t<input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u043E\u0442\" v-model=\"filters.rating.min\">\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t<input type=\"text\" class=\"ui-ctl-element\" placeholder=\"\u0434\u043E\" v-model=\"filters.rating.max\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<button class=\"ui-btn ui-btn-success\" @click=\"reloadFilters\">\u041D\u0430\u0439\u0442\u0438</button>\n\t\t</div>\n\t"
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
	      var _this = this;

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
	        _this.bookId = response.data['ID'];
	        window.location = '/books/' + _this.bookId;
	      })["catch"](function (response) {
	        BX.UI.Notification.Center.notify({
	          content: "Ошибка сохранения книги!"
	        });
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
	  template: "\n\t\t<div class=\"page-container\">\n\t\t\t<bookrix-add-book v-if=\"componentName === 'add'\"/>\n\t\t\t\n\t\t\t<div class=\"booklist-container\" v-else-if=\"componentName === 'booklist'\">\n\t\t\t\t<bookrix-book-filters/>\n\t\t\t\t<bookrix-booklist :isMainPage=\"false\"/>\n\t\t\t</div>\n\t\t\t\n\t\t\t<bookrix-book\n\t\t\t\tv-else-if=\"componentName === 'detailed'\"\n\t\t\t\t:bookId=\"bookId\" \n\t\t\t\t:showDesc=\"true\"\n\t\t\t/>\n\t\t\t\n\t\t\t<bookrix-booklist\n\t\t\t\tv-else=\"componentName === 'main'\"\n\t\t\t\t:isMainPage=\"true\"\n\t\t\t/>\n\t\t</div>\n\t"
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
	        template: "\n              <div>\n              <div class=\"header-container\">\n                <bookrix-header/>\n              </div>\n              <div class=\"container\">\n                <bookrix-navbar :componentName=\"data.COMPONENT\" :bookId=\"data.BOOK_ID\"/>\n                <bookrix-page :componentName=\"data.COMPONENT\" :bookId=\"data.BOOK_ID\"/>\n              </div>\n              <bookrix-footer/>\n              </div>\n\t\t\t"
	      }).mount(this.rootNode);
	    }
	  }]);
	  return BookrixApp;
	}();

	exports.BookrixApp = BookrixApp;

}((this.BX = this.BX || {}),BX,BX,BX));
