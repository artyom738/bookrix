export class BooksGetter
{
	static getBooks(params)
	{
		let books = [];
		return BX.ajax.runAction('up:bookrix.bookcontroller.getBooks', {data: { params: params }})
		.then(response => {
			response.data.forEach(item => {
				books.push(item);
			});
			return books;
		})
		.catch()
	}

	static getBookById(bookId)
	{
		return BX.ajax.runAction('up:bookrix.bookcontroller.getById', {data: { 'id': bookId } })
		.then(response => {
			return response.data;
		})
	}

	static getAuthors()
	{
		let authors = [];
		return BX.ajax.runAction('up:bookrix.bookcontroller.getAuthors')
		.then(response => {
			response.data.forEach(item => {
				authors.push(item);
			});
			return authors;
		});
	}

	static getMinMaxPages()
	{
		let pages = {};
		return BX.ajax.runAction('up:bookrix.bookcontroller.getMinMaxPages')
		.then(response => {
			pages.min = response.data.min;
			pages.max = response.data.max;
			return pages;
		});
	}
}