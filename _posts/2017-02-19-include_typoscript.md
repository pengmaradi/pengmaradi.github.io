---
layout: tailwind
title:  "typoscript include ts"
date:   2017-02-19 11:20:01 -0100
categories: typo3
class: panel-red
description: include the typoscript in file
---

#include config of backendlayout

```HTML
-- BackendLayouts/
   |-- default.ts
   |-- default1.ts
   |-- default2.ts
   |-- default3.ts
   |-- default4.ts
   |-- default5.ts
   |-- ...
```

```typoscript
### include all folder tses extensions="ts"
<INCLUDE_TYPOSCRIPT: source="DIR:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts" extensions="ts">

### old way to include default.ts
<INCLUDE_TYPOSCRIPT: source="FILE:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts/default.ts">
<INCLUDE_TYPOSCRIPT: source="FILE:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts/default1.ts">
  ...
<INCLUDE_TYPOSCRIPT: source="FILE:EXT:custom_template/Configuration/TypoScript/PageTSconfig/BackendLayouts/defaultn.ts">
```








