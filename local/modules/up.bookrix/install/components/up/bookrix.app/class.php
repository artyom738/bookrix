<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

use Bitrix\Main\Loader;
use Bitrix\Main\Localization\Loc;

Loader::includeModule('up.bookrix');

class BookrixApp extends CBitrixComponent
{
	protected function prepareResult(): array
	{
		global $APPLICATION;
		$uri = $this->arParams['URI'];
		$bookId = 0;

		switch ($uri[0])
		{
			case '':
				$component = 'main';
				$APPLICATION->SetTitle('Main Page');
				break;
			case 'books':
				if (isset($uri[1]))
				{
					$component = 'detailed';
					$bookId = $uri[1];
					$APPLICATION->SetTitle('About book');
				}
				else
				{
					$component = 'main';
				}
				break;
			case 'add':
				$component = 'add';
				$APPLICATION->SetTitle('Add a book');
				break;
			case 'booklist':
				$component = 'booklist';
				$APPLICATION->SetTitle('List of books');
				break;
			default:
				$component = 'main';
				$APPLICATION->SetTitle('Main page');
		}

		return [
			'COMPONENT' => $component,
			'BOOK_ID' => $bookId,
		];
	}

	protected function getApplication(): CMain
	{
		global $APPLICATION;
		return $APPLICATION;
	}

	public function executeComponent()
	{
		$this->arResult = $this->prepareResult();

		$this->includeTemplate();
	}

	protected function includeTemplate(): void
	{
		$this->includeComponentTemplate();
	}

}
