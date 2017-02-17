# H1
## H2
### H3

```php
<?php


'INSTALL' => array(
	'wizardDone' => array(
			'tx_coreupdates_installnewsysexts' => '1',
	),
),


```


 /**
 * Adds an entry
 * @var Vendor\MyExtension\Domain\Model\User $formdata
 */
public function saveFormAction(Vendor\MyExtension\Domain\Model\User $formdata) {

    //Store your normal form stuff 
    //you don't need to do anything with your image field here!
    //Persist your new model, that we have a valid uid


    //declare the new image path in fileadmin
    //if not exists, it will automaticly added
    $newImagePath = 'my_blog';

    //\TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($_FILES);

    //image Handling
    if ($_FILES['tx_simpleblog_bloglisting']['name']['image']) {

        //be careful - you should validate the file type! This is not included here       
        $tmpName = $_FILES['tx_simpleblog_bloglisting']['name']['image'];
        $tmpFile  = $_FILES['tx_simpleblog_bloglisting']['tmp_name']['image'];

        $storageRepository = $this->objectManager->get('TYPO3\\CMS\\Core\\Resource\\StorageRepository');
        $storage = $storageRepository->findByUid('1'); //this is the fileadmin storage
        //build the new storage folder
        if(!$storage->hasFolder($newImagePath)) {
            $targetFolder = $storage->createFolder($newImagePath);
        }
        

        //file name, be shure that this is unique
        $newFileName = $tmpName;

        //build sys_file
        $movedNewFile = $storage->addFile($originalFilePath, $targetFolder, $newFileName);
        $this->objectManager->get('TYPO3\\CMS\\Extbase\\Persistence\\Generic\\PersistenceManager')->persistAll();

        //now we build the file reference
        //see private function anotiations!
        $this->buildRelations($myModel->getUid(), $movedNewFile, 'image', 'tx_myextension_domain_model_mymodel', $storagePid);
    }
}      