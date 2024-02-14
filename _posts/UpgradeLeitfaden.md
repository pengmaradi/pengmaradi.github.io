---
layout: default
title:  "TYPO3 update"
date:   2024-02-14 08:50:01 -0100
categories: typo3
class: panel-green
description: TYPO3 update
---

## v7 to v9
```
#!/usr/bin/env bash
 
./vendor/bin/typo3cms database:updateSchema -v
 
./vendor/bin/typo3cms cleanup:updatereferenceindex --show-progress
./vendor/bin/typo3cms upgrade:wizard fillTranslationSourceField -v
./vendor/bin/typo3cms upgrade:wizard pagesSlugs -v
./vendor/bin/typo3cms upgrade:wizard pagesLanguageOverlay -v
./vendor/bin/typo3cms upgrade:wizard pagesLanguageOverlayBeGroupsAccessRights -v
./vendor/bin/typo3cms upgrade:wizard sectionFrameToFrameClassUpdate -v
./vendor/bin/typo3cms upgrade:wizard uploadContentElementUpdate -v
./vendor/bin/typo3cms upgrade:wizard splitMenusUpdate -v
./vendor/bin/typo3cms upgrade:wizard startModuleUpdate -v
./vendor/bin/typo3cms upgrade:wizard frontendUserImageUpdateWizard -v
./vendor/bin/typo3cms upgrade:wizard commandLineBackendUserRemovalUpdate -v
./vendor/bin/typo3cms upgrade:wizard migrateFeSessionDataUpdate -v
./vendor/bin/typo3cms upgrade:wizard separateSysHistoryFromLog -v
./vendor/bin/typo3cms upgrade:wizard backendUsersConfiguration -v
./vendor/bin/typo3cms upgrade:wizard databaseRowsUpdateWizard -v
 
if [ -d "web/typo3conf/ext/news" ]
then
  ./vendor/bin/typo3cms upgrade:wizard newsSlug -v
  ./vendor/bin/typo3cms upgrade:wizard sysCategorySlugs -v
fi
```


