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
		'main.core.events',
		'ui.vue',
	],
	'skip_core' => false,
];