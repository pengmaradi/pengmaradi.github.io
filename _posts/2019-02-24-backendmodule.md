---
layout: default
title:  "TYPO3 Module"
date:   2019-02-24 14:23:08 -0100
categories: typo3
class: panel-green
description: TYPO3 Backend Module
---

## TYPO3 Version 9 Backend Module use ajax

### Mudule register
* ext_tables.php
```PHP
if (TYPO3_MODE === 'BE') {
	
	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
		'Xp.CustomTemplate',
		'tools',
		'customtools',
		'',
		['Administration' => 'index, shell'],
		[
			'access' => 'systemMaintainer',
			'icon' => 'EXT:custom_template/Resources/Public/Icons/xp.svg',
			'labels' => 'LLL:EXT:custom_template/Resources/Private/Language/locallang_mod.xlf'
		]
	);
}
```

### ajax register
* Configuration/Backend/AjaxRoutes.php
```PHP
<?php
return [
	'run_shell' => [
		'path' => '/run/shell',
		'target' => \Xp\CustomTemplate\Controller\AdministrationController::class. '::runShellAction'
	],
];
```
### AdministrationController.php

```PHP
public function runShellAction(
		ServerRequestInterface $request,
		ResponseInterface $response
	): ResponseInterface
	{
    // some code hier!
  }
```
### JavaScript
* custom_template/Resources/Public/JavaScript/AdministrationModule.js
```JavaScript
define(['jquery'], function($) {
// hier can use $ - jQuery
});
```


### JS im Fluid Template

* Layout/Default includeRequireJsModules, includeCssFiles, includeJsFiles
```HTML
<html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers">
	<f:be.container
		pageTitle="custom_template: shell"
		includeRequireJsModules="{0: 'jquery'}"
		includeCssFiles="{0: '{f:uri.resource(path:\'Css/Backend/administration.css\')}'}"
		includeJsFiles="{0: '{f:uri.resource(path:\'JavaScript/runShell.js\')}'}"
		>
		<div class="administration">
			<f:flashMessages/>
			<f:render section="content"/>
		</div>
	</f:be.container>
</html>

```
* Template: Shell.html includeRequireJsModules: TYPO3/CMS/CustomTemplate/AdministrationModule
```HTML
<html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers"
	  data-namespace-typo3-fluid="true">
<f:layout name="Backend/Ajax" />

<f:section name="content">
	<f:be.pageRenderer includeRequireJsModules="{0:'TYPO3/CMS/CustomTemplate/AdministrationModule'}" />
  // your other html code
</f:section>
</html>  
```




