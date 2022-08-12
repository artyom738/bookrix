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
	}

	public function getByIdAction($id)
	{
		return BookTable::getById($id)->fetch();
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