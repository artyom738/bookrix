(function (exports,main_core,ui_dialogs_messagebox,main_core_events,ui_vue) {
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
	  // language=Vue
	  template: "\n      <div class=\"menu\">\n      <a\n          v-for=\"item in menuItems\"\n\t\t  :href=\"item.link\"\n          class=\"menu-item\">\n        {{ item.title }}\n      </a>\n      </div>\n\t\t"
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
	  }, {
	    key: "deleteBooks",
	    value: function deleteBooks(ids) {
	      return BX.ajax.runAction('up:bookrix.bookcontroller.deleteBooks', {
	        data: {
	          ids: ids
	        }
	      });
	    }
	  }]);
	  return BooksGetter;
	}();

	ui_vue.BitrixVue.component('bookrix-book', {
	  props: ['book', 'showDesc', 'isDetailed', 'bookId'],
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
	    },
	    switchBook: function switchBook() {
	      main_core_events.EventEmitter.emit('Bookrix.switchBook', {
	        bookId: this.book.ID
	      });
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"book-item\">\n\t\t\t<div class=\"book-item-title\" v-if=\"book.ID\">\n\t\t\t\t<a v-bind:href=\"'/books/' + book.ID\">{{ book.TITLE }}</a>\n\t\t\t\t<input type=\"checkbox\" v-if=\"showDesc && !isDetailed\" @change=\"switchBook\">\n\t\t\t</div>\n\t\t\t<div class=\"book-item-title\" v-else>\n\t\t\t\t{{ book.TITLE }}\n\t\t\t</div>\n\n\t\t\t<template v-for=\"(value, index) in book\">\n\t\t\t\t<div class=\"book-item-spec\" v-if=\"(Object.keys(fieldsMap)).includes(index)\">\n\t\t\t\t\t{{ fieldsMap[index] }}: {{value}}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"book-item-spec\" v-else-if=\"index === 'DATE_ADD'\">\n\t\t\t\t\t\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430: {{value}}\n\t\t\t\t</div>\n\t\t\t\t<div class=\"book-item-spec\" v-else-if=\"index === 'DESCRIPTION' && showDesc\">\n\t\t\t\t\t\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435: {{value}}\n\t\t\t\t</div>\n\t\t\t</template>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-applied-filters', {
	  props: [],
	  data: function data() {
	    return {
	      filters: {}
	    };
	  },
	  created: function created() {
	    var _this = this;

	    main_core_events.EventEmitter.subscribe('Bookrix.refreshBooks', function (event) {
	      _this.filters = _this.prepareFields(event.data.params);
	    });
	  },
	  methods: {
	    prepareFields: function prepareFields(filters) {
	      var _ref;

	      var result = {};

	      for (var filterName in filters) {
	        if (!filters[filterName]) {
	          continue;
	        }

	        switch (filterName) {
	          case 'title':
	            result.title = {
	              'value': filters.title,
	              'code': 'title',
	              'name': 'Название'
	            };
	            break;

	          case 'authors':
	            var authors = (_ref = []).concat.apply(_ref, babelHelpers.toConsumableArray(Object.values(filters.authors))).join(', ');

	            if (authors !== '') {
	              result.authors = {
	                'value': authors,
	                'code': 'authors',
	                'name': 'Авторы'
	              };
	            }

	            break;

	          case 'pagesMin':
	            result.pagesMin = {
	              'value': filters.pagesMin,
	              'code': 'pagesMin',
	              'name': 'Страниц от'
	            };
	            break;

	          case 'pagesMax':
	            result.pagesMax = {
	              'value': filters.pagesMax,
	              'code': 'pagesMax',
	              'name': 'Страниц до'
	            };
	            break;

	          case 'ratingMin':
	            result.ratingMin = {
	              'value': filters.ratingMin,
	              'code': 'ratingMin',
	              'name': 'Рейтинг от'
	            };
	            break;

	          case 'ratingMax':
	            result.ratingmax = {
	              'value': filters.ratingMax,
	              'code': 'ratingMax',
	              'name': 'Рейтинг до'
	            };
	            break;
	        }
	      }

	      return result;
	    },
	    resetFilter: function resetFilter(key) {
	      main_core_events.EventEmitter.emit('reset-filter', {
	        item: this.filters[key]
	      });
	    },
	    resetAllFilters: function resetAllFilters(filters) {
	      for (var object in filters) {
	        this.resetFilter(object);
	      }
	    },
	    isEmptyFilters: function isEmptyFilters() {
	      if (!this.filters || Object.keys(this.filters).length === 0) {
	        return true;
	      }

	      if ((this.filters.title === '' || this.filters.title === undefined) && (this.filters.authors === undefined || Object.keys(this.filters.authors).length === 0) && this.filters.pagesMin === null && this.filters.pagesMax === null && this.filters.ratingMin === null && this.filters.ratingMax === null) {
	        return true;
	      }

	      return false;
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"bookrix-apllied-filters\" v-if=\"!isEmptyFilters()\">\n\t\t<div class=\"bookrix-filter-title\">\u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B:</div>\n\t\t\n\t\t<div class=\"bookrix-filter-item\">\u0412\u0441\u0435\u0433\u043E \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432: {{ Object.keys(filters).length }}</div>\n\t\t<a\n\t\t\tclass=\"bookrix-applied-filter-reset\"\n\t\t\t@click=\"resetAllFilters(filters)\"\n\t\t>(\u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435)</a><br>\n\t\t\n\t\t<template v-for=\"(object, filterName) in filters\">\n\t\t\t<div class=\"bookrix-filter-item\" v-if=\"object.value\">\n\t\t\t\t{{object.name}}: <b>{{object.value}}</b>\n\t\t\t\t<a \n\t\t\t\t\tclass=\"bookrix-applied-filter-reset\"\n\t\t\t\t\t@click=\"resetFilter(object.code)\"\n\t\t\t\t>(x)</a>\n\t\t\t</div>\n\t\t</template>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-booklist', {
	  props: ['isMainPage'],
	  data: function data() {
	    return {
	      books: [],
	      arrayBooks: [],
	      title: 'Загрузка...',
	      filters: {},
	      booksForDelete: []
	    };
	  },
	  created: function created() {
	    var _this = this;

	    this.loadBooks();
	    main_core_events.EventEmitter.subscribe('Bookrix.refreshBooks', function (event) {
	      _this.params.filter = event.data.params;

	      _this.loadBooks();
	    });
	    main_core_events.EventEmitter.subscribe('Bookrix.switchBook', function (event) {
	      _this.addBookForDelete(event.data.bookId);
	    });
	  },
	  methods: {
	    loadBooks: function loadBooks() {
	      var _this2 = this;

	      this.getParams();
	      BooksGetter.getBooks(this.params).then(function (response) {
	        _this2.books = response;

	        if (response.length === 0) {
	          _this2.title = 'По вашему запросу ничего не найдено!';
	        } else {
	          _this2.title = 'Список книг';
	        }
	      })["catch"](function (response) {
	        console.error(response.errors);
	      });
	    },
	    getParams: function getParams() {
	      if (this.isMainPage) {
	        this.params = {
	          'limit': 3
	        };
	      } else if (!this.params) {
	        this.params = {};
	      }

	      if (this.isMainPage) {
	        this.params['order'] = {
	          'RATING': 'DESC'
	        };
	      } else {
	        this.params['order'] = {
	          'DATE_ADD': 'DESC'
	        };
	      }
	    },
	    addBookForDelete: function addBookForDelete(id) {
	      if (!BX.util.in_array(id, this.booksForDelete)) {
	        this.booksForDelete.push(id);
	      } else {
	        var index = this.booksForDelete.indexOf(id);
	        this.booksForDelete.splice(index, 1);
	      }
	    },
	    showMessageBox: function showMessageBox() {
	      var _this3 = this;

	      var messageBox = new ui_dialogs_messagebox.MessageBox({
	        message: "Вы действительно хотите удалить книги? (" + this.booksForDelete.length + ")",
	        title: "Подтверждение удаления",
	        buttons: BX.UI.Dialogs.MessageBoxButtons.OK_CANCEL,
	        okCaption: "Да",
	        onOk: function onOk() {
	          BooksGetter.deleteBooks(_this3.booksForDelete).then(function (response) {
	            messageBox.close();
	            window.location.reload();
	          });
	        }
	      });
	      messageBox.show();
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"book-list\">\n\t\t<bookrix-applied-filters/>\n\t\t<div class=\"book-list-deleting\" v-if=\"booksForDelete.length > 0\">\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u043A\u043D\u0438\u0433: {{this.booksForDelete.length}}\n\t\t\t<br><button class=\"ui-btn ui-btn-danger\" @click=\"showMessageBox()\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043A\u043D\u0438\u0433\u0438</button>\n\t\t</div>\n\t\t<div class=\"book-list-title\">\n\t\t\t{{title}}\n\t\t</div>\n\t\t<bookrix-book v-for=\"book in this.books\" :book=\"book\" :showDesc=\"!isMainPage\" :isDetailed=\"false\"/>\n\t\t</div>\n\t\t"
	});

	ui_vue.BitrixVue.component('bookrix-book-filters', {
	  props: [],
	  data: function data() {
	    return {
	      authors: [],
	      pages: {},
	      filters: {
	        title: '',
	        authors: {},
	        pagesMin: null,
	        pagesMax: null,
	        ratingMin: null,
	        ratingMax: null
	      }
	    };
	  },
	  mounted: function mounted() {
	    var _this = this;

	    main_core_events.EventEmitter.subscribe('reset-filter', function (e) {
	      _this.resetFilter(e.data.item.code);
	    });
	    this.getAuthors();
	    BooksGetter.getMinMaxPages().then(function (response) {
	      _this.pagesMax = response.max;
	    });
	  },
	  methods: {
	    getAuthors: function getAuthors() {
	      var _this2 = this;

	      BooksGetter.getAuthors().then(function (response) {
	        _this2.authors = response;
	      })["catch"](function (response) {
	        console.error(response.errors);
	      });
	    },
	    addAuthor: function addAuthor(item) {
	      if (BX.util.in_array(item.ID, BX.util.array_keys(this.filters.authors))) {
	        delete this.filters.authors[item.ID];
	      } else {
	        this.filters.authors[item.ID] = item.NAME;
	      }

	      return item.ID;
	    },
	    resetAuthors: function resetAuthors() {},
	    getAuthorClass: function getAuthorClass(item) {
	      return {
	        'bookrix-filter-author-selected': BX.util.in_array(item.ID, BX.util.array_keys(this.filters.authors))
	      };
	    },
	    getPagesMax: function getPagesMax() {
	      return this.pagesMax;
	    },
	    resetFilter: function resetFilter(code) {
	      switch (code) {
	        case 'title':
	          this.filters.title = '';
	          break;

	        case 'authors':
	          this.filters.authors = {};
	          this.resetAuthors();
	          break;

	        case 'pagesMin':
	          this.filters.pagesMin = null;
	          break;

	        case 'pagesMax':
	          this.filters.pagesMax = null;
	          break;

	        case 'ratingMin':
	          this.filters.ratingMin = null;
	          break;

	        case 'ratingMax':
	          this.filters.ratingMax = null;
	          break;
	      }

	      this.reloadFilters();
	    },
	    reloadFilters: function reloadFilters() {
	      main_core_events.EventEmitter.emit('Bookrix.refreshBooks', {
	        params: this.filters
	      });
	    }
	  },
	  computed: {},
	  // language=Vue
	  template: "\n\t\t<div class=\"bookrix-filters\">\n\t\t\t<div class=\"bookrix-filter-title\">\u0424\u0438\u043B\u044C\u0442\u0440\u044B</div>\n\t\t\t<div class=\"bookrix-filter\">\n\t\t\t\t<div class=\"bookrix-filter-subtitle\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438</div>\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n\t\t\t\t\t<input \n\t\t\t\t\t\ttype=\"text\" \n\t\t\t\t\t\tclass=\"ui-ctl-element\" \n\t\t\t\t\t\tname=\"book-name\" \n\t\t\t\t\t\tid=\"book-name\" \n\t\t\t\t\t\tv-model=\"filters.title\"\n\t\t\t\t\t>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"bookrix-filter\">\n\t\t\t\t<div class=\"bookrix-filter-subtitle\">\u0410\u0432\u0442\u043E\u0440</div>\n\t\t\t\t<div class=\"bookrix-filter-authors\">\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass=\"bookrix-filter-author\"\n\t\t\t\t\t\t:class=\"getAuthorClass(item)\"\n\t\t\t\t\t\tv-for=\"item in authors\"\n\t\t\t\t\t\t:id=\"item.ID\"\n\t\t\t\t\t\t@click=\"addAuthor(item)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{item.NAME}}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t<div class=\"bookrix-filter\">\n\t\t\t<div class=\"bookrix-filter-subtitle\">\u0421\u0442\u0440\u0430\u043D\u0438\u0446</div>\n\t\t\t<div class=\"bookrix-filter-pages\">\n\t\t\t\t\u043E\u0442 \n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t\n\t\t\t\t\t<input \n\t\t\t\t\t\ttype=\"number\" \n\t\t\t\t\t\tclass=\"ui-ctl-element\"\n\t\t\t\t\t\t:placeholder=\"0\"\n\t\t\t\t\t\tv-model=\"filters.pagesMin\">\n\t\t\t\t</div>\n\n\t\t\t\t\u0434\u043E \n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t\n\t\t\t\t\t<input \n\t\t\t\t\t\ttype=\"number\" \n\t\t\t\t\t\tclass=\"ui-ctl-element\"\n\t\t\t\t\t\t:placeholder=\"getPagesMax()\"\n\t\t\t\t\t\tv-model=\"filters.pagesMax\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t\t<div class=\"bookrix-filter\">\n\t\t\t<div class=\"bookrix-filter-subtitle\">\u0420\u0435\u0439\u0442\u0438\u043D\u0433</div>\n\t\t\t<div class=\"bookrix-filter-pages\">\n\t\t\t\t\u043E\u0442\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t\n\t\t\t\t\t<input \n\t\t\t\t\t\ttype=\"number\" \n\t\t\t\t\t\tclass=\"ui-ctl-element\" \n\t\t\t\t\t\tplaceholder=\"0\" \n\t\t\t\t\t\tv-model=\"filters.ratingMin\">\n\t\t\t\t</div>\n\t\t\t\t\u0434\u043E\n\t\t\t\t<div class=\"ui-ctl ui-ctl-textbox ui-ctl-w33\">\n\t\t\t\t\t\n\t\t\t\t\t<input \n\t\t\t\t\t\ttype=\"number\" \n\t\t\t\t\t\tclass=\"ui-ctl-element\" \n\t\t\t\t\t\tplaceholder=\"100\" \n\t\t\t\t\t\tv-model=\"filters.ratingMax\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<button class=\"ui-btn ui-btn-success\" @click=\"reloadFilters\">\u041D\u0430\u0439\u0442\u0438</button>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-add-book', {
	  data: function data() {
	    return {
	      title: '',
	      author: '',
	      rating: '',
	      pages: '',
	      description: '',
	      errorMessage: '',
	      failed: {}
	    };
	  },
	  methods: {
	    checkFields: function checkFields() {
	      this.failed = {};
	      var fields = ['rating', 'author', 'pages', 'description', 'title'];

	      for (var index in fields) {
	        if (!BX.type.isNotEmptyString(this[fields[index]])) {
	          this.failed[fields[index]] = {
	            name: fields[index],
	            errorMessage: 'Все поля обязательны к заполнению!',
	            "class": 'ui-ctl-danger'
	          };
	        }
	      }

	      if (Object.keys(this.failed).length !== 0) {
	        return;
	      }

	      if (!this.rating.match('^\\d{1,2}$|100')) {
	        this.failed.rating = {
	          name: fields.rating,
	          errorMessage: 'Поле "Рейтинг" должно быть числом до 100',
	          "class": 'ui-ctl-danger'
	        };
	        return;
	      }

	      if (!this.pages.match('^\\d*$')) {
	        this.failed.pages = {
	          name: fields.pages,
	          errorMessage: 'Поле "Страницы" должно быть числом',
	          "class": 'ui-ctl-danger'
	        };
	      }
	    },
	    save: function save() {
	      var _this = this;

	      this.checkFields();
	      console.log(this.failed);

	      if (Object.keys(this.failed).length !== 0) {
	        BX.UI.Notification.Center.notify({
	          content: this.failed[Object.keys(this.failed)[0]].errorMessage
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
	    },
	    getFailedClass: function getFailedClass(name) {
	      var result = BX.util.in_array(name, Object.keys(this.failed));
	      return result ? 'ui-ctl-danger' : '';
	    }
	  },
	  // language=Vue
	  template: "\n      <div class=\"add-container\">\n\t  <div class=\"add-book-title\">\n\t\t\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438\n\t  </div>\n      <div class=\"add-book\">\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\" :class=\"getFailedClass('title')\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"title\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\" :class=\"getFailedClass('author')\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"author\" placeholder=\"\u0410\u0432\u0442\u043E\u0440\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\" :class=\"getFailedClass('rating')\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"rating\" placeholder=\"\u0420\u0435\u0439\u0442\u0438\u043D\u0433\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w75\" :class=\"getFailedClass('pages')\">\n            <input type=\"text\" class=\"ui-ctl-element\" v-model=\"pages\" placeholder=\"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\">\n          </div>\n        </template>\n\n        <template>\n          <div class=\"ui-ctl ui-ctl-textarea\" :class=\"getFailedClass('description')\">\n            <textarea class=\"ui-ctl-element\" v-model=\"description\" placeholder=\"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435\"></textarea>\n          </div>\n        </template>\n        <br>\n        <button class=\"ui-btn ui-btn-icon-add ui-btn-success\" @click=\"save()\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n      </div>\n\n      <bookrix-book :book=\"{\n          'TITLE': title, \n          'AUTHORNAME': author, \n          'RATING': rating, \n          'PAGES': pages,\n          'DESCRIPTION': description\n      }\" :showDesc=\"true\"/>\n      </div>\n\t"
	});

	ui_vue.BitrixVue.component('bookrix-page', {
	  props: ['componentName', 'bookId'],
	  computed: {},
	  // language=Vue
	  template: "\n\t\t<div class=\"page-container\">\n\t\t\t<bookrix-add-book v-if=\"componentName === 'add'\"/>\n\t\t\t\n\t\t\t<div class=\"booklist-container\" v-else-if=\"componentName === 'booklist'\">\n\t\t\t\t<bookrix-book-filters/>\n\t\t\t\t<bookrix-booklist :isMainPage=\"false\"/>\n\t\t\t</div>\n\t\t\t\n\t\t\t<bookrix-book\n\t\t\t\tv-else-if=\"componentName === 'detailed'\"\n\t\t\t\t:bookId=\"bookId\" \n\t\t\t\t:showDesc=\"true\"\n\t\t\t\t:isDetailed=\"true\"\n\t\t\t/>\n\t\t\t\n\t\t\t<bookrix-booklist\n\t\t\t\tv-else\n\t\t\t\t:isMainPage=\"true\"\n\t\t\t/>\n\t\t</div>\n\t"
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
	          return {
	            data: _data
	          };
	        },
	        // language=Vue
	        template: "\n\t\t\t\t<div>\n\t\t\t\t\t<div class=\"header-container\">\n\t\t\t\t\t\t<bookrix-header/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"container\">\n\t\t\t\t\t\t<bookrix-navbar :componentName=\"data.COMPONENT\" :bookId=\"data.BOOK_ID\"/>\n\t\t\t\t\t\t<bookrix-page :componentName=\"data.COMPONENT\" :bookId=\"data.BOOK_ID\"/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<bookrix-footer/>\n\t\t\t\t</div>\n\t\t\t"
	      }).mount(this.rootNode);
	    }
	  }]);
	  return BookrixApp;
	}();

	exports.BookrixApp = BookrixApp;

}((this.BX = this.BX || {}),BX,BX.UI.Dialogs,BX.Event,BX));
