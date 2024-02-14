---
layout: default
title:  "TYPO3 update"
date:   2024-02-14 08:50:01 -0100
categories: typo3
class: panel-green
description: TYPO3 update
---

## SQL gridselement 2 container

```
update tt_content
set CType = 'contentStage'
where tx_gridelements_backend_layout = 'contentStage'
	and CType = 'gridelements_pi1';
update tt_content
set colPos              = 1000,
		tx_container_parent = tx_gridelements_container
where tx_gridelements_container in (SELECT uid FROM (SELECT uid FROM tt_content WHERE tx_gridelements_backend_layout = 'contentStage') as t)
	and tx_gridelements_columns = 0;

update tt_content
set CType = 'fourColumns25-25-25-25'
where tx_gridelements_backend_layout = 'fourColumns25-25-25-25'
	and CType = 'gridelements_pi1';

update tt_content
set colPos              = 200,
		tx_container_parent = tx_gridelements_container
where tx_gridelements_container in
			(SELECT uid FROM (SELECT uid FROM tt_content WHERE tx_gridelements_backend_layout = 'fourColumns25-25-25-25') as t)
	and tx_gridelements_columns = 0;

update tt_content
set colPos              = 201,
		tx_container_parent = tx_gridelements_container
where tx_gridelements_container in
			(SELECT uid FROM (SELECT uid FROM tt_content WHERE tx_gridelements_backend_layout = 'fourColumns25-25-25-25') as t)
	and tx_gridelements_columns = 1;

update tt_content
set colPos              = 202,
		tx_container_parent = tx_gridelements_container
where tx_gridelements_container in
			(SELECT uid FROM (SELECT uid FROM tt_content WHERE tx_gridelements_backend_layout = 'fourColumns25-25-25-25') as t)
	and tx_gridelements_columns = 2;

update tt_content
set colPos              = 203,
		tx_container_parent = tx_gridelements_container
where tx_gridelements_container in
			(SELECT uid FROM (SELECT uid FROM tt_content WHERE tx_gridelements_backend_layout = 'fourColumns25-25-25-25') as t)
	and tx_gridelements_columns = 3;

```

### powermail sql
```
## run first of ./vendor/bin/typo3cms database:updateSchema -v
mysql -udev -pdev -hmysql typo3 -e "RENAME TABLE tx_powermail_domain_model_answers TO tx_powermail_domain_model_answer;"
mysql -udev -pdev -hmysql typo3 -e "RENAME TABLE tx_powermail_domain_model_fields TO tx_powermail_domain_model_field;"
mysql -udev -pdev -hmysql typo3 -e "RENAME TABLE tx_powermail_domain_model_forms TO tx_powermail_domain_model_form;"
mysql -udev -pdev -hmysql typo3 -e "RENAME TABLE tx_powermail_domain_model_mails TO tx_powermail_domain_model_mail;"
mysql -udev -pdev -hmysql typo3 -e "RENAME TABLE tx_powermail_domain_model_pages TO tx_powermail_domain_model_page;"
mysql -udev -pdev -hmysql typo3 -e "ALTER TABLE tx_powermail_domain_model_page CHANGE forms form INT(11) UNSIGNED NOT NULL DEFAULT '0';"
mysql -udev -pdev -hmysql typo3 -e "ALTER TABLE tx_powermail_domain_model_field CHANGE pages page INT(11) UNSIGNED NOT NULL DEFAULT '0';"

# custom field class
-- mysql -udev -pdev -hmysql typo3 -e "UPDATE tx_powermail_domain_model_field SET css = 'col-sm-6' WHERE css = 'split';"
```

## v7 to v11
```
#!/usr/bin/env bash

cat <<EOF
****************************************
TYPO3 Core from 7.6 to 11.5 update
$(date +%F)
****************************************
EOF

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
### v12
```
#!/bin/bash

cat <<EOF
****************************************
TYPO3 Core from 11.5 to 12.4 update
$(date +%F)
****************************************
EOF

echo "update db schema (table.add + field.add)"
./vendor/bin/typo3 database:updateschema table.add
./vendor/bin/typo3 database:updateschema field.add

./vendor/bin/typo3 upgrade:run -vvv

```

