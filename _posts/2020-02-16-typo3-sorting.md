---
layout: tailwind
title: "extbase sorting"
date: 2020-02-16 13:30:01 -0100
categories: typo3
class: panel-green
description: extbase sorting
---

### 1. add sorting field in sql

```SQL
sorting int(11) unsigned DEFAULT '0' NOT NULL,
```

### 2. add sorting in TCA

```php
'ctrl' => [
        'sortby' => 'sorting',
        'default_sortby' => 'sorting DESC',
],
// codes ...
'sorting' => [
    'config' => [
        'type' => 'passthrough',
    ],
],
```

### 2. Model.php

```php
    /**
     * @var int
     */
    protected $sorting;

    /**
     * Get sorting
     *
     * @return int
     */
    public function getSorting()
    {
        return $this->sorting;
    }

    /**
     * Set sorting
     *
     * @param int $sorting sorting
     */
    public function setSorting($sorting)
    {
        $this->sorting = $sorting;
    }

```

### 3. Repository

```php
protected $defaultOrderings = array(
    'sorting' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING,
);

```

### it will sorting by ASC automatic

### if object has sub object, but has no owner repository, can also use Custom VieHelpers oder VHS sort VieHelpers

```php
<?php
namespace Xp\CustomTemplate\ViewHelpers;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithContentArgumentAndRenderStatic;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Extbase\Persistence\Generic\LazyObjectStorage;
use TYPO3\CMS\Extbase\Persistence\ObjectStorage;
use TYPO3\CMS\Extbase\Persistence\QueryResultInterface;
use TYPO3\CMS\Extbase\Reflection\ObjectAccess;

/**
 * xmlns:x="http://typo3.org/ns/Xp/CustomTemplate/ViewHelpers"
 * <f:for each="{shop.aktions->x:sort(subject: shop.aktions ,sortBy:'sorting')}" as="aktion" iteration="a">
 * </f:for>
 */

class SortViewHelper extends AbstractViewHelper
{
	use CompileWithContentArgumentAndRenderStatic;

	/**
     * objectManager variable
     *
     * @var \TYPO3\CMS\Extbase\Object\ObjectManager
     */
    private $objectManager = null;

    /**
     * Contains all flags that are allowed to be used
     * with the sorting functions
     *
     * @var array
     */
    protected static $allowedSortFlags = [
        'SORT_REGULAR',
        'SORT_STRING',
        'SORT_NUMERIC',
        'SORT_NATURAL',
        'SORT_LOCALE_STRING',
        'SORT_FLAG_CASE'
    ];

    public function initializeArguments()
    {
        $this->registerArgument('subject', 'mixed', 'The array/Traversable instance to sort');
        $this->registerArgument(
            'sortBy',
            'string',
            'Which property/field to sort by - leave out for numeric sorting based on indexes(keys)'
        );
        $this->registerArgument(
            'order',
            'string',
            'ASC, DESC, RAND or SHUFFLE. RAND preserves keys, SHUFFLE does not - but SHUFFLE is faster',
            false,
            'ASC'
        );
        $this->registerArgument(
            'sortFlags',
            'string',
            'Constant name from PHP for `SORT_FLAGS`: `SORT_REGULAR`, `SORT_STRING`, `SORT_NUMERIC`, ' .
            '`SORT_NATURAL`, `SORT_LOCALE_STRING` or `SORT_FLAG_CASE`. You can provide a comma seperated list or ' .
            'array to use a combination of flags.',
            false,
            'SORT_REGULAR'
        );
        //$this->registerAsArgument();
    }

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    ) {
        return static::sortArray($arguments['subject'],$arguments);
    }

    /**
     * Sort an array
     *
     * @param array|\Iterator $array
     * @param array $arguments
     * @return array
     */
    protected static function sortArray($array, $arguments)
    {
        $sorted = [];
        foreach ($array as $index => $object) {
            if (true === isset($arguments['sortBy'])) {
                $index = static::getSortValue($object, $arguments);
            }
            while (isset($sorted[$index])) {
                $index .= '.1';
            }
            $sorted[$index] = $object;
        }
        if ('ASC' === $arguments['order']) {
            ksort($sorted);
        } elseif ('RAND' === $arguments['order']) {
            $sortedKeys = array_keys($sorted);
            shuffle($sortedKeys);
            $backup = $sorted;
            $sorted = [];
            foreach ($sortedKeys as $sortedKey) {
                $sorted[$sortedKey] = $backup[$sortedKey];
            }
        } elseif ('SHUFFLE' === $arguments['order']) {
            shuffle($sorted);
        } else {
            krsort($sorted, $arguments['sortFlags']);
        }
        return $sorted;
    }

    /**
     * Gets the value to use as sorting value from $object
     *
     * @param mixed $object
     * @param array $arguments
     * @return mixed
     */
    protected static function getSortValue($object, $arguments)
    {
        $field = $arguments['sortBy'];
        $value = ObjectAccess::getPropertyPath($object, $field);
        if (true === $value instanceof \DateTimeInterface) {
            $value = (integer) $value->format('U');
        } elseif (true === $value instanceof ObjectStorage || true === $value instanceof LazyObjectStorage) {
            $value = $value->count();
        } elseif (is_array($value)) {
            $value = count($value);
        }
        return $value;
    }


}

```

```html
xmlns:x="http://typo3.org/ns/Xp/CustomTemplate/ViewHelpers"
<f:for
  each="{shop.aktions->x:sort(subject: shop.aktions ,sortBy:'sorting')}"
  as="aktion"
  iteration="a"
></f:for>
```
