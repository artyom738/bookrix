<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/BookrixApp.bundle.css',
	'js' => 'dist/BookrixApp.bundle.js',
	'rel' => [
		'main.core',
		'bitrix/modules/main/install/js/main/core/events/src/events.js',
		'ui.vue',
	],
	'skip_core' => false,
];