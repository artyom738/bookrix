<?php

namespace Up\Bookrix\Service;

use Bitrix\Main\Type\Date;
use Up\Bookrix\ORM\AuthorTable;
use Up\Bookrix\ORM\BookTable;

class BookService
{
	public function getBooks(array $params): array
	{
		$params = $this->setLimitOffset($params);
		$params = $this->applyFilters($params);

		$dataParams = [
			'select' => [
				'ID' => 'ID',
				'TITLE' => 'TITLE',
				'AUTHOR' => 'AUTHOR',
				'RATING' => 'RATING',
				'PAGES' => 'PAGES',
				'DATE_ADD' => 'DATE_ADD',
				'DESCRIPTION' => 'DESCRIPTION',
			],
		];

		$dataParams = array_merge($dataParams, $params);

		$books = BookTable::getList($dataParams)->fetchAll();
		return $books;
	}

	private function setLimitOffset(array $params)
	{
		if(!isset($params['limit']))
		{
			$params['limit'] = 10;
		}

		if(!isset($params['offset']))
		{
			$params['offset'] = 0;
		}

		return $params;
	}

	private function applyFilters($params)
	{
		$result = [];
		foreach ($params as $param => $value)
		{
			if ($param !== 'filter')
			{
				$result[$param] = $value;
				continue;
			}
			foreach ($value as $name => $filter)
			{
				if (!$filter)
				{
					continue;
				}

				if ($name === 'title')
				{
					$result['filter']['%=TITLE'] = "%$filter%";
				}
				elseif ($name === 'authors')
				{
					$result['filter']['@AUTHOR_ID'] = array_keys($filter);
				}
				elseif ($name === 'pagesMin' || $name === 'pagesMax')
				{
					$result['filter']['><PAGES'] = [(int)$value['pagesMin'], (int)$value['pagesMax']];
				}
				elseif ($name === 'ratingMin' || $name === 'ratingMax')
				{
					$result['filter']['><RATING'] = [(int)$value['ratingMin'], (int)$value['ratingMax']];
				}
			}
		}
		return $result;
	}

	public static function getAuthorByName(string $name): ?int
	{
		$authorId = AuthorTable::getList([
			'select' => ['ID'],
			'filter' => ['=NAME' => $name]
			])->fetch()['ID'];

		if (!$authorId)
		{
			$addResult = AuthorTable::add(['NAME' => $name]);
			if ($addResult->isSuccess())
			{
				return $addResult->getId();
			}
			return null;
		}

		return $authorId;
	}

	public static function getAuthors(): array
	{
		return AuthorTable::getList([
			'select' => ['ID', 'NAME'],
			'order' => ['NAME']
		])->fetchAll();
	}

	public static function getMinMaxPages()
	{
		$minPages = BookTable::getList([
			'select' => ['PAGES'],
			'order' => ['PAGES' => 'ASC'],
			'limit' => 1,
		])->fetch()['PAGES'];

		$maxPages = BookTable::getList([
			   'select' => ['PAGES'],
			   'order' => ['PAGES' => 'DESC'],
			   'limit' => 1,
		])->fetch()['PAGES'];

		return [
			'min' => $minPages,
			'max' => $maxPages
		];
	}
}