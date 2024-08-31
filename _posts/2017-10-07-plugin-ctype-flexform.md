---
layout: tailwind
title: "TYPO3 plugin as CType with flexform"
date: 2021-04-10 14:44:01 -0100
categories: typo3
class: panel-green
description: plugin as CType
---

## Custom plugin as CType with flexform

### ext_tables.php

- addStaticFile
- addPageTSConfig

```php
defined('TYPO3') or die();
// enable TypoScript in list - typo3conf/ext/custom_teaser/Configuration/TCA/Overrides/sys_template.php
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('ext_name', 'Configuration/TypoScript', 'your ext plugin');

// # autoload pageTS - typo3conf/ext/custom_teaser/Configuration/TCA/Overrides/pages.php
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:ext_name/Configuration/PageTS/pageSetup.txt">');

// or like this, include via backend root page property/resources
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
    'custom_teaser',
    'Configuration/TypoScript/PageTS/Page.tsconfig',
    'EXT:custom_teaser :: Custom Teaser TS config'
);
```

```PageTS
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

- configurePlugin

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

- configurePlugin

### Configuration /TCA /Overrides /tt_content.php

- addPiFlexFormValue CustomTimetable.xml

```HTML
<?xml version="1.0" encoding="UTF-8"?>
<T3DataStructure>
    <meta type="array">
        <langChildren type="integer">1</langChildren>
        <langDisable type="integer">1</langDisable>
    </meta>
    <sheets>
        <sDEF>
            <ROOT>
                <TCEforms>
                    <sheetTitle>Settings</sheetTitle>
                </TCEforms>
                <type>array</type>
                <el>
                    <settings.colorpicker>
                        <label>render type colorbox</label>
                        <config>
                            <type>input</type>
                            <renderType>colorpicker</renderType>
                            <size>10</size>
                        </config>
                    </settings.colorpicker>
                </el>
            </ROOT>
        </sDEF>
    </sheets>
</T3DataStructure>
```

- class FlexFormProcessor: Xp\CustomTeaser\DataProcessing\FlexFormProcessor

```PHP
<?php
declare(strict_types = 1);
namespace Xp\CustomTeaser\DataProcessing;

use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;

class FlexFormProcessor implements DataProcessorInterface
{

    /**
     * flexFormService variable
     *
     * @var FlexFormService
     * @\TYPO3\CMS\Extbase\Annotation\Inject
     */
    protected $flexFormService;

    /**
     * process function
     *
     * @param ContentObjectRenderer $cObj
     * @param array $contentObjectConfiguration
     * @param array $processorConfiguration
     * @param array $processedData
     * @return array
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    ): array {
        $originalValue = $processedData['data']['pi_flexform'];
        if (!is_string($originalValue)) {
            return $processedData;
        }
        $this->flexFormService = GeneralUtility::makeInstance(FlexFormService::class);
        $flexformData = $this->flexFormService->convertFlexFormContentToArray($originalValue);
        // in fluid template use {flexform->f:debug()}
        $processedData['flexform'] = $flexformData;
        return $processedData;
    }
}
```

- fluid html template

```HTML
style="{f:if(condition: '{flexform.settings.colorpicker}', then: 'background:{flexform.settings.colorpicker};')}"
```

- registerPlugin
- $GLOBALS['TCA']['tt_content']['types']['your_plugin'] = ['showitem'=>'pi_flexform'];

```php
<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {
        // add Flexform	to 	plugin
	// $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']['your_plugin'] = 'pi_flexform';
	// \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
	// 	'your_plugin',
	// 	'FILE:EXT:htmlio/Configuration/FlexForm/Your.xml'
	// );

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

## custom field in tt_content

1. ext_tables.sql

```SQL
#
# Table structure for table 'tt_content'
#
CREATE TABLE tt_content (
    tx_custom_show tinyint(3) unsigned DEFAULT '0' NOT NULL,
);
```

2. additionalColumns TCA config

```PHP
$additionalColumns = [
   'tx_custom_show' => [
      'exclude' => true,
      'label' => 'show list on self page',
      'config' => [
            'type' => 'check',
            'renderType' => 'checkboxToggle',
            'items' => [
               [
                  0 => '',
                  1 => '',
                  'invertStateDisplay' => true
               ]
            ],
      ]
   ]
];
```

3. addTCAcolumns

```PHP
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $additionalColumns);
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
   '',
   'FILE:EXT:custom_teaser/Configuration/FlexForms/CustomTimetable.xml',
   'timetable'
);

 $GLOBALS['TCA']['tt_content']['types']['timetable'] = [
   'showitem' => '
         --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;;general,
            header; timetable Title,
            subheader; To,
            bodytext;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:bodytext_formlabel,
            pi_flexform,

         --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
            --palette--;;frames,
            --palette--;;appearanceLinks,
         --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
         --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
            --palette--;;hidden,
            --palette--;;access,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
        --div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:sys_category.tabs.category, categories,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes, rowDescription,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended
      ',
   'columnsOverrides' => [
      'bodytext' => [
         'config' => [
            'enableRichtext' => true,
            'richtextConfiguration' => 'default',
         ],
      ],
   ],
 ];
```

4. addToAllTCAtypes

```PHP
 \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
   'tt_content',
   'tx_custom_show',
   'timetable',
   'before:bodytext'
);
```

5. fluid template

```HTML
<f:if condition="{data.tx_custom_show}">
   show list here: ...
</f:if>
```
