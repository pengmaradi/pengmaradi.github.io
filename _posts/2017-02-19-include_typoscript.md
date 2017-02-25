---
layout: default
title:  "typoscript include ts"
date:   2017-02-19 11:20:01 -0100
categories: jekyll update
class: panel-red
description: include the typoscript in file
---

#include config of backendlayout

-- BackendLayouts

    -- default.txt

    -- default1.txt

    -- default2.txt

    -- default3.txt

    -- default4.txt

    -- default5.txt

    -- ...

```typoscript
### include all folder txts
<INCLUDE_TYPOSCRIPT: source="DIR:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts" extensions="txt">

### include default.txt
<INCLUDE_TYPOSCRIPT: source="FILE:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts/default.txt">

### include default1.txt
<INCLUDE_TYPOSCRIPT: source="FILE:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts/default1.txt">
```

```php
var_dump($_SERVER); 




```








