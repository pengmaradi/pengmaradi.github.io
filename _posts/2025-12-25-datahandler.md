---
layout: tailwind
title: "TYPO3 dataHandler import Command"
date: 2025-12-25 11:06:01 -0100
categories: typo3
class: panel-green
description: use TYPO3 dafault Datahandler import data with TCA
---

### simulate a backend user

- trait CliBackendUserTrait

DataHandler defaults to "anonymous user" in the CLI/Scheduler.
👉 No backend write permissions, 👉 therefore write access is directly denied.
Therefore, it is necessary to simulate a backend user.
```
protected function initializeBackendUser(): void
{
    $request = new ServerRequest('http://cli/');
    /** @var BackendUserAuthentication $beUser */
    $beUser = GeneralUtility::makeInstance(BackendUserAuthentication::class);
    $beUser->start($request);
    $beUser->user = [
        'uid' => 0,
        'username' => '_cli_',
        'admin' => 1,
    ];
    $beUser->setWorkspace(0); // live workspace
    $GLOBALS['BE_USER'] = $beUser;
}
```

- Create the command class ImportTableCommand.php

```php
#[AsCommand(
    name: 'package:command',
    description: 'Import data command with DataHandler FAL inline',
    help: 'This command allows you to import data from a YAML file using DataHandler with FAL inline.'
)]
final class ImportTableCommand extends Command
{
    use CliBackendUserTrait;
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->initializeBackendUser();

        $io = new SymfonyStyle($input, $output);
        $io->title($this->getDescription());

        $pid = (int)$input->getArgument('pid');
        $records = $this->getImportData();

        $io->progressStart(count($records));

        $this->importService->import($records, $pid);

        $output->writeln(
            sprintf('Imported %d data', count($records))
        );

        $io->progressAdvance();

        $io->progressFinish();
        $io->success('Data imported successfully.');
        return Command::SUCCESS;
    }
}
```

- class ImportService

```php
final class ImportProjectService
{
    private const TABLE = 'tx_package_domain_model_project';
    private const UPLOAD_PATH = 'user_upload/project/';
    public function __construct(
        private readonly DataHandler $dataHandler,
        private readonly StorageRepository $storageRepository,
    ) {}

    public function import(array $records, int $pid): void
    {
        $data = [];

        foreach ($records as $record) {
            $newId = 'NEW' . uniqid();
            $newFileReferenceId = 'NEW' . uniqid();
            $data[self::TABLE][$newId] = [
                'pid' => $pid,
                'sys_language_uid' => 0,
                'name' => $record['name'],
                'description' => $record['description'],
                'color' => $record['color'],
                'lightbox' => (int)$record['lightbox'],
                'sold' => (int)$record['sold'],
                'file' => $newFileReferenceId, // Placeholder, to be processed later.
            ];

            if (!empty($record['file'])) {
                $fileUid = $this->downloadRemoteFile($record['file'], $record['name']);

                if ($fileUid) {
                    // ✅ inline insert sys_file_reference
                    $data['sys_file_reference'][$newFileReferenceId] = [
                        'pid' => $pid,
                        'uid_local' => $fileUid,
                        'uid_foreign' => $newId,
                        'tablenames' => self::TABLE,
                    ];
                }
            }
        }

        $this->dataHandler->start($data, []);
        $this->dataHandler->process_datamap();
    }

    private function downloadRemoteFile(string $url, string $filename): int|null
    {
        $imageContent = GeneralUtility::getUrl($url);
        if ($imageContent === false) {
            return null;
        }

        $format = '.jpeg';

        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_buffer($finfo, $imageContent);
            $format = match ($mimeType) {
                'image/jpeg' => '.jpeg',
                'image/png' => '.png',
                'image/gif' => '.gif',
                'image/webp' => '.webp',
                default => '.jpeg',
            };
        }

        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $filename) ?: 'image';
        $filename .= $format;

        $storage = $this->storageRepository->getStorageObject(1);

        if (!$storage->isOnline()) {
            throw new \RuntimeException('Storage is offline');
        }

        if (!$storage->hasFolder(self::UPLOAD_PATH)) {
            $storage->createFolder(self::UPLOAD_PATH);
        }
        $targetFolderObject = $storage->getFolder(self::UPLOAD_PATH);

        $tempFile = GeneralUtility::tempnam('upload_', $format);

        GeneralUtility::writeFile($tempFile, $imageContent);

        try {
            $file = $storage->addFile(
                $tempFile,
                $targetFolderObject,
                $filename,
                DuplicationBehavior::REPLACE,
                true
            );

            return $file->getUid();
        } catch (FileException $e) {
            GeneralUtility::unlink_tempfile($tempFile);
            error_log($e->getMessage());
            return null;
        } finally {
            GeneralUtility::unlink_tempfile($tempFile);
        }
    }
}

```
