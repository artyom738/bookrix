<?php

namespace Up\Bookrix\Controller;

use Bitrix\Forum\Dev\Generator\Book;
use Bitrix\Main;
use Up\Bookrix\ORM\BookTable;
use Up\Bookrix\Service\BookService;

class BookController extends Main\Engine\Controller
{
	public function getBooksAction($params): array
	{
		$service = new BookService();
		$books = $service->getBooks($params);
		foreach ($books as $i => $book)
		{
			$books[$i]['DATE_ADD'] = $this->prepateDates($book);
		}
		return $books;
	}

	public function getAuthorsAction(): array
	{
		return BookService::getAuthors();
	}

	public function getMinMaxPagesAction(): array
	{
		return BookService::getMinMaxPages();
	}

	public function addBookAction($data)
	{
		$authorId = BookService::getAuthorByName($data['AUTHOR']);
		unset($data['AUTHOR']);
		$data['AUTHOR_ID'] = $authorId;

		$addResult = BookTable::add($data);
		if (!$addResult->isSuccess())
		{
			$this->errorCollection->add($addResult->getErrors());
		}
		$bookId = $addResult->getId();
		return ['ID' => $bookId];
	}

	public function getByIdAction($id)
	{
		$book = BookTable::getById($id)->fetch();
		$book['DATE_ADD'] = $this->prepateDates($book);
		return $book;
	}

	private function prepateDates(array $book)
	{
		return FormatDate('d F Y', MakeTimeStamp($book['DATE_ADD']));
	}

	public function configureActions()
	{
		return [
			'getBooks' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
				]
			],
			'addBook' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
				]
			],
			'getAuthors' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
				]
			],
			'getMinMaxPages' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
				]
			],
			'getById' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
				]
			],
		];
	}
}