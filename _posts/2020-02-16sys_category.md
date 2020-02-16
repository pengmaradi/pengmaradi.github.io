---
layout: default
title:  "TYPO3 sys_category"
date:   2020-02-16 12:53:01 -0100
categories: sys_category
class: panel-green
description: extbase add sys_category
---

# added sys_category in custom Extbase

### 1. add cat field in sql

```SQL
categories int(11) unsigned DEFAULT '0' NOT NULL,
````
### 2. added TCA config in custom tca php

```php
'interface' => [
    'showRecordFieldList' => 'hidden, *, categories',
],
'types' => [
    '1' => ['showitem' => 'hidden, --div--;categories'],
],

'categories' => [
    'exclude' => true,
    'label' => 'LLL:EXT:ext/Resources/Private/Language/locallang_db.xlf:tx_ext_domain_model_custom.categories',
    'config' => [
        'type' => 'input',
        'size' => 4,
        'eval' => 'int'
    ]
],
```
### 3. ext_name/Configuration/TCA/Overrides/sys_category.php

```php
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::makeCategorizable(
    'ext_mane',
    'custom_table',
    'categories',
    [
        'fieldConfiguration' => [
            'foreign_table_where' => ' AND sys_category.uid < 9 AND sys_category.sys_language_uid IN (-1, 0) ORDER BY sys_category.sorting ASC'
        ],
    ]
);
$GLOBALS['TCA']['custom_table']['columns']['categories']['config']['MM_match_fields']['sorting'] = 'sorting';
```
### 4. typo3conf/ext/ext_name/Classes/Domain/Model/Category.php

```php
<?php
namespace Vendor\ExtName\Domain\Model;
class Category extends \TYPO3\CMS\Extbase\Domain\Model\Category
{
}
```
### 5. typo3conf/ext/ext_name/Classes/Domain/Repository/CategoryRepository.php

```php
<?php
namespace Vendor\ExtName\Domain\Repository;

class CategoryRepository extends \TYPO3\CMS\Extbase\Domain\Repository\CategoryRepository
{
    /**
     * Returns all objects of this repository.
     *
     * @return QueryResultInterface|array
     */
    public function findAll()
    {
        $query = $this->createQuery();
        $query->matching(
            $query->lessThan('uid', 9)
        );
        return $query->execute();
    }
}
```
### 6. typo3conf/ext/ext_name/Classes/Domain/Model/Custom.php

```php
    /**
     * categories
     * 
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\TYPO3\CMS\Extbase\Domain\Model\Category>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     */
    protected $categories = null;
    
    /**
     * Returns the categories
     * 
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\TYPO3\CMS\Extbase\Domain\Model\Category>
     */
    public function getCategories()
    {
        return $this->categories;
    }
    
    /**
     * Sets the categories
     * 
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage $categories
     * @return void
     */
    public function setCategories(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $categories)
    {
        $this->categories = $categories;
    }
    /**
     * __construct
     */
    public function __construct()
    {
        $this->initStorageObjects();
    }
    /**
     * @return void
     */
    protected function initStorageObjects()
    {
        $this->categories = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
    }
```

### 7. typo3conf/ext/ext_name/Classes/Controller/CustomController.php

```php
    /**
     * categoryRepository
     * 
     * @var \Dyn\DynPwd\Domain\Repository\CategoryRepository
     * @TYPO3\CMS\Extbase\Annotation\Inject
     * 
     */
    protected $categoryRepository = null;
    
    /**
     * action list
     * 
     * @return void
     */
    public function listAction()
    {
        $categories = $this->categoryRepository->findAll();
        $this->view->assign('categories', $categories);
    }
```
### 8. enable the plugin use sys_category in TYPOSCRIPT

```TYPOSCRIPT
 plugin.tx_extname_plugin.persistence.classes {
 	Vendor\ExtName\Domain\Model\Category {
 		mapping {
 			recordType = 0
 			tableName = sys_category
 		}
 	}
 }
```

### 9. use sys_category in fluid html

```HTML
<div class="category">
  <ul class="category__menu">
    <li data-uid="0" class="active">all</li>
    <f:if condition="{categories}">
      <f:for each="{categories}" as="category" iteration="i">
        <li data-uid="{category.uid}">{category.title}</li>
      </f:for>
    </f:if>
  </ul>
  <!-- data-category="[4,5,0]" -->
</div>
data-category='[<f:if condition="{pwd.categories}">
<f:then><f:for each="{pwd.categories}" as="category" iteration="cat">{category.uid},</f:for></f:then>
</f:if>0]'
```


