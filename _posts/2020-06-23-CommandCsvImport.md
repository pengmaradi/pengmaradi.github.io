---
layout: default
title:  "TYPO3 Custom Command"
date:   2020-06-23 18:06:01 -0100
categories: typo3
class: panel-red
description: Custom command
---

### recommend Symfony Console Commands

* FeUserImportCommand.php

```PHP
<?php
declare(strict_types = 1);
namespace Xp\CustomTemplate\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class FeUserImportCommand extends Command
{
    /**
     * csv path variable
     *
     * @var string
     */
    private $csvPath;

    /**
     * configure function
     *
     * @return void
     */
    protected function configure()
    {
        $this->setDescription('CustomTemplate: import fe users bei csv files')
            ->setHelp('Prints a list of recent sys_log entries.' . LF . 'If you want to get more detailed information, use the --verbose option.');
        $this->addArgument('userGroup', InputArgument::REQUIRED, 'User group (default 1)');
        $this->addArgument('pageUid', InputArgument::REQUIRED, 'Page ID with existing users');
    }

    /**
     * execute function
     *
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return integer
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $userGroup = (int)$input->getArgument('userGroup');
        $pageUid = (int)$input->getArgument('pageUid');

        try {
            $this->mapper($this->csvToArray($userGroup, $pageUid));
            $message = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Messaging\FlashMessage::class,
                'import fe users to page: '.$pageUid,
                'CustomTemplate Command',
                \TYPO3\CMS\Core\Messaging\FlashMessage::OK,
                true
            );
            $output->writeln($message);
            return 0;
        } catch (\Exception $e) {
            $message = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Messaging\FlashMessage::class,
                'information: '. $e->getMessage(),
                'CustomTemplate Command',
                \TYPO3\CMS\Core\Messaging\FlashMessage::WARNING,
                true
            );
            $output->writeln($message);
            throw new \Exception('Could not write, error: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Undocumented function
     *
     * @param integer $userGroup
     * @param integer $pageUid
     * @return void
     */
    private function csvToArray($userGroup = 1, $pageUid = 25)
    {
        $this->csvPath = \TYPO3\CMS\Core\Core\Environment::getPublicPath().'/fileadmin/user_upload/Import/';
        $csvs = $this->scanFold($this->csvPath);
        $usergroup = $userGroup;
        $pid = $pageUid;
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
                            array_push($header, 'pid');
                            array_push($header, 'usergroup');
                        } else {
                            array_push($row, $pid);
                            array_push($row, $usergroup);
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

        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable('fe_users');

        foreach($input as $k => $v) {
            $affectedRows = $queryBuilder
                ->insert('fe_users')
                ->values($v)
                ->execute();
        }
    }

    /**
     * scanFold function
     *
     * @param string $csvPath
     * @return void
     */
    private function scanFold($csvPath)
    {
        if(is_dir($csvPath)) {
            return array_diff(scandir($csvPath), ['.', '..']);
        }
    }
}
```

### typo3conf/ext/custom_template/Configuration/Services.yaml

```YAML
services:
  _defaults:
    autowire: true
    autoconfigure: true
    public: false

  Xp\CustomTemplate\:
    resource: '../Classes/*'

  # Command/FeUserImportCommand.php
  Xp\CustomTemplate\Command\FeUserImportCommand:
    tags:
      - name: 'console.command'
        command: 'customtemplate:feuserimport'
```

### create user.csv in fileadmin/user_upload/Import/

```CSV
"username","password","name","last_name","email"
"demo","pwd","Tom","Cat","tom@cat.tld"
```

### Execute console commands (scheduler) try it

# TYPO3 8

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
