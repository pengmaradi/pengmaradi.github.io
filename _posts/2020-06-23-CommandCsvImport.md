---
layout: default
title:  "TYPO3 Custom Command"
date:   2020-06-23 18:06:01 -0100
categories: typo3
class: panel-red
description: Custom command
---

# recommend Symfony Console Commands

### ext_localconf.php

```php
if (TYPO3_MODE === 'BE') {
    $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['extbase']['commandControllers']['YourCsvCommandController'] = \Vendor\ExtbaseName\Command\CsvCommandController::class;
}
```

### CsvCommandController.php

```php
<?php
declare(strict_types = 1);
namespace Vendor\ExtbaseName\Command;

use TYPO3\CMS\Extbase\Mvc\Controller\CommandController;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Vendor\ExtbaseName\Domain\Model\Job;
use Vendor\ExtbaseName\Domain\Repository\JobRepository;
/**
 * Command for CSV file import
 * CsvCommandController class
 */
class CsvCommandController extends CommandController
{
    /**
     * jobRepository variable
     *
     * @var \Vendor\ExtbaseName\Domain\Repository\JobRepository
     * @inject
     */
    protected $jobRepository = null;

    /**
     * csv path variable
     *
     * @var string
     */
    private $csvPath;
    /**
     * construct function
     */
    public function __construct()
    {
        $this->csvPath = \TYPO3\CMS\Core\Core\Environment::getPublicPath().'/fileadmin/user_upload/Import/';
    }

    /**
     * runImportCommand function
     *
     * @return void
     */
    public function runImportCommand()
    {
        $input = $this->csvToArray();
        $output = $this->mapper($input);
    }

    /**
     * getCsv function
     *
     * @return void
     */
    private function csvToArray()
    {
        $csvs = $this->scanFold();
        $delimiter = ',';
        if($csvs) {
            $header = NULL;
            $data = [];
            $csvFormat = '/\.csv/';
            $csvs = preg_grep($csvFormat, $csvs);
            foreach($csvs as $csv) {
                if(!file_exists($this->csvPath.$csv) || !is_readable($this->csvPath.$csv)) {
                    return false;
                }

                if(($handle = fopen($this->csvPath.$csv, 'r')) !== FALSE) {
                    while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
                        if(!$header) {
                            $header = $row;
                        } else {
                            $data[] = array_combine($header, $row);
                        }
                    }
                    fclose($handle);
                }
                //$content = trim(file_get_contents($this->csvPath.$csv));
            }
        }
        return $data;
    }

    /**
     * scanModel function
     *
     * @return void
     */
    private function scanModel()
    {
        $model = GeneralUtility::makeInstance(Job::class);
        //$keys = \TYPO3\CMS\Extbase\Reflection\ObjectAccess::getGettableProperties($model);
        $keys = \TYPO3\CMS\Extbase\Reflection\ObjectAccess::getSettablePropertyNames($model);
    }

    /**
     * mapper function
     *
     * @param array $input
     * @return void
     */
    private function mapper(array $input)
    {
        if(!is_array($input)) {
            return false;
        }

        //\TYPO3\CMS\Core\Utility\DebugUtility::debug($input);
        foreach($input as $k => $v) {
            //\TYPO3\CMS\Core\Utility\DebugUtility::debug([$k, $v]);
            $v['pid'] = 60;
            if(!$v['subtitle']) {
                $v['subtitle'] = '';
            }
            $mappingConfiguration = $this->objectManager
                ->get('TYPO3\CMS\Extbase\Property\PropertyMappingConfigurationBuilder')
                ->build();
        //    $mappingConfiguration->forProperty('img')
        //        ->allowAllProperties();
            $output = $this->objectManager->get(\TYPO3\CMS\Extbase\Property\PropertyMapper::class)
                ->convert(
                    $v,
                    'Vendor\ExtbaseName\Domain\Model\Job',
                    $mappingConfiguration
                );
            // $job = $this->objectManager->get(\Vendor\ExtbaseName\Domain\Model\Job::class);
            // $job->setPid(60);
            //\TYPO3\CMS\Core\Utility\DebugUtility::debug($output);die(__LINE__);
            $this->jobRepository->add($output);
        }
    }

    /**
     * getCsvs function
     *
     * @return void
     */
    private function scanFold()
    {
        if(is_dir($this->csvPath)) {
            return array_diff(scandir($this->csvPath), ['.', '..']);
        }
    }

}

```
