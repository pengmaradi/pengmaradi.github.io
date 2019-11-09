---
layout: default
title:  "TYPO3 Extbase Flexform"
date:   2019-09-28 18:30:01 -0100
categories: TYPO3
class: panel-green
description: TYPO3 switchable Controller Actions
---
# TYPO3 Extbase: Standard Action per Flexform festlegen - switchableControllerActions

* configure Plugin

```php
\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Xp.Test',
            'Pi1',
            [
                'Test' => 'list,show'
            ],
            // non-cacheable actions
            [
                'Test' => ''
            ]
        );
```

* add PiFlexForm (ext_tables.php or Configuration/TCA/Overrides/tt_content.php)

```php
$GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']['test_pi1'] = 'pi_flexform';
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
            'test_pi1', 
            'FILE:EXT:test/Configuration/FlexForms/contentPlugin.xml'
        );
```

* FlexForm

```xml
<T3DataStructure>
	<sheets>
		<!--
			################################
			  SHEET General Settings
			################################
		-->
		<sDEF>
			<ROOT>
				<TCEforms>
					<sheetTitle>LLL:EXT:news/Resources/Private/Language/locallang_be.xlf:flexforms_tab.settings</sheetTitle>
				</TCEforms>
				<type>array</type>
				<el>
					<!-- View -->
					<switchableControllerActions>
						<TCEforms>
							<label>LLL:EXT:news/Resources/Private/Language/locallang_be.xlf:flexforms_general.mode</label>
							<onChange>reload</onChange>
							<config>
								<type>select</type>
								<!-- <itemsProcFunc>GeorgRinger\News\Hooks\ItemsProcFunc->user_switchableControllerActions</itemsProcFunc> -->
								<renderType>selectSingle</renderType>
								<items>
									<numIndex index="1">
										<numIndex index="0">list</numIndex>
										<numIndex index="1">Test->list</numIndex>
									</numIndex>
									<numIndex index="2">
										<numIndex index="0">show</numIndex>
										<numIndex index="1">Test->show</numIndex>
									</numIndex>
									</items>
							</config>
						</TCEforms>
					</switchableControllerActions>


				</el>
			</ROOT>
		</sDEF>
		<!--
					################################
					  SHEET Additional
					################################
				-->
		<additional>
			<ROOT>
				<TCEforms>
					<sheetTitle>additional</sheetTitle>
				</TCEforms>
				<type>array</type>
				<el>


					<!-- disable overrideDemand -->
					<settings.disableOverrideDemand>
						<TCEforms>
							<label>disable Override Demand</label>
							<config>
								<type>check</type>
								<default>1</default>
							</config>
						</TCEforms>
					</settings.disableOverrideDemand>
				</el>
			</ROOT>
		</additional>

	</sheets>
</T3DataStructure>
```

* Action link

```html
<f:link.action action="show" pageUid="54">show</f:link.action>
<f:link.action action="list" pageUid="4">back</f:link.action>
```



