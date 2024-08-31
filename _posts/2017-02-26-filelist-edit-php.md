---
layout: tailwind
title: "filelist edit php"
date: 2017-02-26 16:40:01
categories: typo3
class: panel-red
description: enable filelist edit php files
---

## Beschreibung

```php
<?php
// 1. fileDenyPattern // \.(php[3-7]?|phpsh|phtml)(\..*)?$|^\.htaccess$
  $GLOBALES['BE']['fileDenyPattern'] = '\\.(php[3-7]+|phpsh|phtml)(\\..*)?$|^\\.htaccess$';
// 2.
  $GLOBALES['SYS']['textfile_ext'] = 'php,txt,ts,typoscript,html,htm,css,tmpl,';
```
