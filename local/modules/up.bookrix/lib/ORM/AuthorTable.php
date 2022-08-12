<?php

namespace Up\Bookrix\ORM;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

class AuthorTable extends DataManager
{
	public static function getTableName()
	{
		return 'up_author';
	}

	public static function getMap()
	{
		return [
			new IntegerField(
				'ID',
				[
					'primary' => true,
					'autocomplete' => true,
				]
			),
			new StringField(
				'NAME',
			),
		];
	}
}