---
layout: default
title:  "TYPO3 container"
date:   2023-08-29 08:22:01 -0100
categories: container
class: panel-green
description: TYPO3 b13/container, container use fluid default layout
---

1. add field to tt_content custom CType accordion

```
// Accordion
\TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\B13\Container\Tca\Registry::class)->configureContainer(
    (
        new \B13\Container\Tca\ContainerConfiguration(
            'accordion',
            'LLL:EXT:your_ext/Resources/Private/Language/locallang_db.xlf:ctypes.accordion.title',
            'LLL:EXT:your_ext/Resources/Private/Language/locallang_db.xlf:ctypes.accordion.description',
            [
                [
                    [
                        'name' => 'LLL:EXT:your_ext/Resources/Private/Language/locallang_db.xlf:ctypes.accordion.title',
                        'colPos' => 1100,
                    ]
                ]
            ]
        )
    )
    ->setIcon('content-accordion')
);
// add pi_flexform
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
    '',
    'FILE:EXT:your_ext/Configuration/FlexForms/Accordion.xml',
    'accordion'
);
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes('tt_content', 'pi_flexform', 'accordion', 'after:header');

/** add accordion header_layout */
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
    'tt_content',
    'header_layout',
    'accordion',
    'after:header'
);
```

2. reset container default header label "Name (in der Webseite nicht sichtbar)"

```pageTS
TCEFORM.tt_content.header.types.accordion {
	label = LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.header
}
```

3. define your CType Template

```TS
lib.contentElement {
    templateRootPaths.220 = EXT:your_ext/Resources/Extensions/toolbox/html/Templates/
    templateRootPaths.300 = EXT:your_ext/Resources/Extensions/toolbox/html/Templates/
}
tt_content.accordion < lib.containerElement
tt_content.accordion {
    templateName = Accordion
}
```

4. fluid template

```html
<html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers" data-namespace-typo3-fluid="true">
<f:layout name="Default" />
<f:section name="Main">
some html code ...
</f:section>
</html>
```

So, your accordion gets header, header_layout and pi_flexform fields. And it renders auto header
