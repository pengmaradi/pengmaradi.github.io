---
layout: default
title:  "TYPO3 fe_users import Command"
date:   2023-10-14 18:06:01 -0100
categories: typo3
class: panel-red
description: Custom command cli import json
---

### recommend Symfony Console Commands

* Register the command Services.yaml:
```yaml
services:
  _defaults:
    autowire: true
    autoconfigure: true
    public: false

  Xp\CustomTemplate\Command\ImportFeuserCommand:
    tags:
      -
        name: console.command
        command: 'custom-template:import-feuser'
        description: 'import fe users from json file'
        schedulable: true
```

* Create the command class ImportFeuserCommand.php

```PHP
<?php

declare(strict_types=1);

namespace Xp\CustomTemplate\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Crypto\PasswordHashing\PasswordHashFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use TYPO3\CMS\Extbase\Property\PropertyMapper;
use TYPO3\CMS\Extbase\Property\PropertyMappingConfigurationBuilder;
use Xp\CustomTemplate\Domain\Model\FrontendUser;
use Xp\CustomTemplate\Domain\Repository\FrontendUserRepository;

class ImportFeuserCommand extends Command
{
    protected FrontendUserRepository $userRepository;
    protected PersistenceManager $persistenceManager;

    protected function configure(): void
    {
        $this->setDescription('import fe users from json file')
            ->setHelp('run ./vendor/bin/typo3 custom-template:import-feuser <pid> <json_url>');
        $this->addArgument('pid', InputArgument::REQUIRED, 'set the pid');
        $this->addArgument('json_url', InputArgument::OPTIONAL, 'json url', 'https://jsonplaceholder.typicode.com/users');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('start ' . $this->getDescription());
        $json_url = $input->getArgument('json_url');
        $pid = (int)$input->getArgument('pid');
        $output->writeln('get default argument: ' . $json_url . ' pid ' . $pid);
        $jsonFile = $this->saveFile($json_url);
        $userArray = json_decode(file_get_contents($jsonFile), true);

        if (count($userArray)) {
            foreach ($userArray as $key => $value) {
                $this->saveUser($value, $pid, $output);
            }
        }

        return Command::SUCCESS;
    }

    private function saveUser(array $users, int $pid, OutputInterface $output)
    {
        $propertyMapper = GeneralUtility::makeInstance(PropertyMapper::class);
        $mappingConfiguration = GeneralUtility::makeInstance(PropertyMappingConfigurationBuilder::class)
            ->build();

        $hashInstance = GeneralUtility::makeInstance(PasswordHashFactory::class)->getDefaultHashInstance('FE');
        $pwd = $hashInstance->getHashedPassword($users['email']);

        /**@var $newUser FrontendUser */
        $newUser = $propertyMapper->convert(
            [
                'name' => $users['name'],
                'password' => $pwd,
                // ... more fields
                'usergroup' => '1',
                'pid' => $pid,
            ],
            'Xp\CustomTemplate\Domain\Model\FrontendUser',
            $mappingConfiguration
        );

        $this->userRepository = GeneralUtility::makeInstance(FrontendUserRepository::class);

        $this->persistenceManager = GeneralUtility::makeInstance(PersistenceManager::class);
        $this->userRepository->add($newUser);
        $this->persistenceManager->persistAll();

        $output->writeln('insert user: ' . $newUser->getUid());
    }

    private function saveFile(string $curl): string
    {
        $tempFolder = '/typo3temp/';
        $tempJson = 'temp.json';
        $importJson = Environment::getPublicPath() . $tempFolder . $tempJson;

        if (!file_exists($importJson)) {
            touch($importJson);
        }

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $curl);
            if (curl_exec($ch) === false) {
                echo 'Curl-Fehler: ' . curl_error($ch);
                return $importJson;
            }
            $fp = fopen($importJson, 'w+');
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_exec($ch);
            fclose($fp);

            curl_close($ch);

            return $importJson;
        } catch (\Exception $e) {
            die($e->getMessage());
        }
    }
}

```

* Create your FrontendUser Domain\Model and FrontendUserRepository

```php
// your FrontendUser
namespace Xp\CustomTemplate\Domain\Model;

use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

class FrontendUser extends AbstractEntity
{
    protected string $name;
    // ... more codes
}

// your FrontendUserRepository
namespace Xp\CustomTemplate\Domain\Repository;

use TYPO3\CMS\Extbase\Persistence\Repository;
class FrontendUserRepository extends Repository {}

```

* Custom Model mappaing Configuration/Extbase/Persistence/Classes.php

```php
<?php

declare(strict_types=1);

return [
    \Xp\CustomTemplate\Domain\Model\FrontendUser::class => [
        'tableName' => 'fe_users',
    ],
];

```




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
