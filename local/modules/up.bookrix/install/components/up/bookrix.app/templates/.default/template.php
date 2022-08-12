<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

\Bitrix\Main\UI\Extension::load('up.bookrix-app');
\Bitrix\Main\UI\Extension::load('ui.forms');
\Bitrix\Main\UI\Extension::load("ui.buttons");
\Bitrix\Main\UI\Extension::load("ui.buttons.icons");
\Bitrix\Main\UI\Extension::load("ui.notification");

?>

<div id="book-vue-app"></div>
<script type="module">
	BX.ready(function() {
		let data = {
			'COMPONENT': '<?= $arResult['COMPONENT'] ?>',
			'BOOK_ID': <?= $arResult['BOOK_ID'] ?>
		}
		window.bookrixApplication = new BX.BookrixApp({
			rootNodeId: 'book-vue-app',
			data: data,
		});
		window.bookrixApplication.start();
	})
</script>
