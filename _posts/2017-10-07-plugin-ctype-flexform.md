---
layout: default
title:  "TYPO3 plugin as CType with flexform"
date:   2017-10-07 15:36:01 -0100
categories: typo3
class: panel-green
description: plugin as CType
---

## Just set plugin as CType with flexform

### ext_tables.php

* addStaticFile
* addPageTSConfig

```php
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('ext_name', 'Configuration/TypoScript', 'your ext plugin');

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:ext_name/Configuration/PageTS/pageSetup.txt">');
```
```TYPOSCRIPT
mod.wizards.newContentElement.wizardItems.common.elements.your_plugin {
		iconIdentifier = content-special-html
		title = your CType title
		description = about your CType
		tt_content_defValues {
			CType = your_plugin
		}
}
mod.wizards.newContentElement.wizardItems.common.show := addToList(your_plugin)
```

### ext_localconf.php

* configurePlugin

```php
\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	'Vendor.' . $_EXTKEY,
	'Pi1',
	array(
		'Class' => 'show',
	),
	array(
		'Class' => '',
		
	),
	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::PLUGIN_TYPE_CONTENT_ELEMENT
);
```

* configurePlugin

### Configuration /TCA /Overrides /tt_content.php

* addPiFlexFormValue
* registerPlugin
* $GLOBALS['TCA']['tt_content']['types']['your_plugin'] = ['showitem'=>'pi_flexform'];


```php
<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {
        // add Flexform	to 	plugin
//		$GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']['your_plugin'] = 'pi_flexform';
//		\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
//			'your_plugin',
//			'FILE:EXT:htmlio/Configuration/FlexForm/Your.xml'
//		);
		
		// Add a flexform to the htmlio_pi1 CType
		\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
			'',
			'FILE:EXT:htmlio/Configuration/FlexForm/Your.xml',
			'your_plugin'
		);
		
		\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
			'Xp.htmlio',
			'Pi1',
			'your plugin'
		);
		
		
		$GLOBALS['TCA']['tt_content']['types']['your_plugin'] = [
			'showitem'=> '
--palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general, pi_flexform,
--div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access,hidden;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:field.default.hidden,
--palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
--div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.extended,
--div--;LLL:EXT:lang/locallang_tca.xlf:sys_category.tabs.category,categories,
        '];

    }
);

```

