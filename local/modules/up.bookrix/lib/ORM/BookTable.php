<?php

namespace Up\Bookrix\ORM;

use Bitrix\Main\ORM;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\DateField;
use Bitrix\Main\ORM\Fields\DatetimeField;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\Type\Date;
use Bitrix\Main\Type\DateTime;

class BookTable extends DataManager
{
	public static function getTableName()
	{
		return 'up_book';
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
				'TITLE',
			),
			new IntegerField(
				'AUTHOR_ID',
			),
			new IntegerField(
				'RATING',
			),
			new IntegerField(
				'PAGES',
			),
			new StringField(
				'DESCRIPTION',
			),
			new DatetimeField(
				'DATE_ADD',
				[
					'default_value' => function() { return new DateTime(); }
				]
			),
			new ORM\Fields\Relations\Reference(
				'AUTHOR',
				AuthorTable::class,
				ORM\Query\Join::on('this.AUTHOR_ID', 'ref.ID')
			),
			new ExpressionField('DISTINCT_AUTHOR_ID',
				'DISTINCT %s', ['AUTHOR.ID']
			)
		];
	}
}