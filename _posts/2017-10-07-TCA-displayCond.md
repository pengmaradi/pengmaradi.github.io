---
layout: default
title:  "TYPO3 tca displayCond"
date:   2017-02-19 11:20:01 -0100
categories: typo3
class: panel-green
description: Versucht die Zugriffsrechte
---

## Beschreibung


```php
<?php
return [
    'ctrl' => [
        'title' => 'your title',

        // code ...  
        
        // js "type" changed Refresh required
        // This change will affect which fields are available in the form. 
        // Would you like to save now in order to refresh the display?
        'requestUpdate' => 'type',
        // code ...
    ],
    'interface' => [
        'showRecordFieldList' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, type, title, description, img, source',
    ],
    'types' => [
        '1' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, type, title, description, img, source, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'],
    ],
    'columns' => [


        'type' => [
            'exclude' => true,
            'label' => 'LLL:EXT:anything_slider/Resources/Private/Language/locallang_db.xlf:tx_anythingslider_domain_model_slider.type',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['default (image)', 0],
                    ['text with image', 1],
                    ['video', 2],
                    ['text with video', 3],
                ],
                'size' => 1,
                'maxitems' => 1,
                'eval' => ''
            ],
        ],

        'description' => [
            'exclude' => true,
            'label' => 'LLL:EXT:anything_slider/Resources/Private/Language/locallang_db.xlf:tx_anythingslider_domain_model_slider.description',
            //'displayCond' => 'FIELD:type:=:1',
            'displayCond' => [
                'OR' => [
                    'FIELD:type:=:1',
                    'FIELD:type:=:3',
                ],
            ],
            
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 15,
                'eval' => 'trim',
            ],
            'defaultExtras' => 'richtext:rte_transform'
        ],
        'img' => [
            'exclude' => true,
            'label' => 'LLL:EXT:anything_slider/Resources/Private/Language/locallang_db.xlf:tx_anythingslider_domain_model_slider.img',
            'displayCond' => [
                'OR' => [
                    'FIELD:type:=:0',
                    'FIELD:type:=:1',
                ],
            ],
            'config' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::getFileFieldTCAConfig(
                'img',
                [
                    'appearance' => [
                        'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference'
                    ],
                    'foreign_types' => [
                        '0' => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_TEXT => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_IMAGE => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_AUDIO => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_VIDEO => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_APPLICATION => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ]
                    ],
                    'maxitems' => 1
                ],
                // gif,jpg,jpeg,tif,tiff,bmp,pcx,tga,png,pdf,ai,svg
                //$GLOBALS['TYPO3_CONF_VARS']['GFX']['imagefile_ext']
                'jpg,jpeg,png'  
            ),
        ],
        'source' => [
            'exclude' => true,
            'label' => 'LLL:EXT:anything_slider/Resources/Private/Language/locallang_db.xlf:tx_anythingslider_domain_model_slider.source',
            'displayCond' => [
                'OR' => [
                    'FIELD:type:=:2',
                    'FIELD:type:=:3',
                ],
            ],
            'config' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::getFileFieldTCAConfig(
                'source',
                [
                    'appearance' => [
                        'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:media.addFileReference'
                    ],
                    'foreign_types' => [
                        '0' => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_TEXT => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_IMAGE => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_AUDIO => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_VIDEO => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ],
                        \TYPO3\CMS\Core\Resource\File::FILETYPE_APPLICATION => [
                            'showitem' => '
                            --palette--;LLL:EXT:lang/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                            --palette--;;filePalette'
                        ]
                    ],
                    'maxitems' => 1
                ]
            ),
        ],
    
    ],
];

```

