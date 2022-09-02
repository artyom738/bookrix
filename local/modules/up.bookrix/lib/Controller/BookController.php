<?php

namespace Up\Bookrix\Controller;

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
		$result = [];
		$getResult = BookService::getAuthors();
		foreach ($getResult as $author)
		{
			$result[] = [
				'ID' => $author['AUTHOR_ID_a'],
				'NAME' => $author['AUTHOR_NAME_a'],
			];
		}
		return $result;
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
		/**
		 * @var Main\Type\DateTime $date
		 */
		$date = $book['DATE_ADD'];
		return $date->format('d.m.Y H:i');
	}

	public function deleteBooksAction(array $ids)
	{
		foreach ($ids as $id)
		{
			BookTable::delete($id);
		}
	}

	public function configureActions()
	{
		return [
			'getBooks' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
			'addBook' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
			'getAuthors' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
			'getMinMaxPages' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
			'getById' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
			'deleteBooks' => [
				'-prefilters' => [
					Main\Engine\ActionFilter\Csrf::class,
					Main\Engine\ActionFilter\Authentication::class,
				]
			],
		];
	}
}