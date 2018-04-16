---
layout: default
title:  "easy plugin"
date:   2018-04-16 16:16:01 -0100
categories: typo3
class: panel-green
description: TYPO3 Extbase
---

## ext_localconf.php

```php
<?php
defined('TYPO3_MODE') || die('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	'Xp.Product',
	'Pi1',
	array(
		'Product' => 'list',
	),
	array(
		'Product' => '',

	)//,
	//\TYPO3\CMS\Extbase\Utility\ExtensionUtility::PLUGIN_TYPE_CONTENT_ELEMENT
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
	'<INCLUDE_TYPOSCRIPT: source="FILE:EXT:product/Configuration/PageTS/pageSetup.txt">'
);

```
## Configuration/TCA/Overrides/tt_content.php

```php
<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {
    		\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
    			'Xp.Product',
    			'Pi1',
    			'my product'
    		);
    }
);
```

### Configuration/TCA/Overrides/sys_template.php

```php
<?php
defined('TYPO3_MODE') || die('Access denied.');

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
	'product',
	'Configuration/TypoScript',
	'hi the Product plugin'
);
```
## Classes/Controller/ProductController.php

```php
<?php
namespace Xp\Product\Controller;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Core\Utility\GeneralUtility;


/**
 * ProductController
 */
class ProductController extends ActionController
{

    /**
     * action list
     *
     * @return void
     */
    public function listAction()
    {
      $GLOBALS['TYPO3_DB']->debugOutput = 1;
      $data = $this->configurationManager->getContentObject()->data;
      $this->view->assign('data', $data);
      $categoryRepository = $this->objectManager->get(\TYPO3\CMS\Extbase\Domain\Repository\CategoryRepository::class);
      //
      $queryBuilder = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Database\ConnectionPool::class)->getQueryBuilderForTable('tt_content');
      $statement = $queryBuilder
         ->select('*')
         ->from('sys_category_record_mm')
         ->where(
            $queryBuilder->expr()->eq('uid_foreign', $data['uid'])
         )
         ->execute();
      // debug($queryBuilder->getSQL());
      $categories = [];
      $files = [];
      while ($row = $statement->fetch()) {
         array_push($categories,$categoryRepository->findByUid($row['uid_local']));
         $fileStatement = $queryBuilder
            ->select('*')
            ->from('sys_category_record_mm')
            ->where(
              $queryBuilder->expr()->eq('uid_local', $row['uid_local'])
            )->andWhere(
              $queryBuilder->expr()->eq('tablenames', $queryBuilder->createNamedParameter('sys_file_metadata'))
            )->execute();
        while ($rowFiles = $fileStatement->fetch()) {
          $uid_foreign = $rowFiles['uid_foreign'];
          $queryBuilder = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Database\ConnectionPool::class)->getQueryBuilderForTable('sys_file');
          $statementFiles = $queryBuilder->select('sys_file.*', 'sys_file_metadata.*')
          ->from('sys_file')
          ->leftJoin('sys_file','sys_file_metadata', 'sys_file_metadata',
            $queryBuilder->expr()->eq('sys_file_metadata.file', $queryBuilder->quoteIdentifier('sys_file.uid'))
          )
          ->where(
            $queryBuilder->expr()->eq('sys_file_metadata.uid', $rowFiles['uid_foreign'])
          )->execute();

          //debug($queryBuilder->getSQL());
          while ($getFiles = $statementFiles->fetch()) {
            //debug($getFiles);
            array_push($files,$getFiles);
          }
        }

      }
      $uniques = array_unique(array_column($files, 'uid'));
      $this->view->assign('files', array_intersect_key($files, $uniques));
      $this->view->assign('categories', $categories);
    }
}

```



