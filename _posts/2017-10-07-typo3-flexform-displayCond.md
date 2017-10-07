---
layout: default
title:  "TYPO3 flexform displayCond"
date:   2017-10-07 09:23:00 -0100
categories: typo3
class: panel-green
description: TYPO3 flexform displayCond and onChange reload
---

## Beschreibung


```xml
<?xml version="1.0" encoding="UTF-8"?>
<T3DataStructure>
    <meta type="array">
        <langChildren type="integer">1</langChildren>
        <langDisable type="integer">1</langDisable>
    </meta>
    <sheets>
        <sDEF>
            <ROOT>
                <TCEforms>
                <sheetTitle>Settings</sheetTitle>
                </TCEforms>
                <type>array</type>
                <el>
                    <settings.procent>
                        <TCEforms>
                            <label>Width of the iframe in 100%</label>
                            <onChange>reload</onChange> 
                            <config>
                                <type>check</type>
                                <default>1</default>
                            </config>
                        </TCEforms>
                    </settings.procent>
                    <settings.width>
                        <TCEforms>
                            <displayCond>FIELD:settings.procent:=:0</displayCond>
                            <label>Width of the iframe (in px)</label>
                            <config>
                                <type>input</type>
                                <eval>trim</eval>
                                <size>4</size>
                                <max>4</max>
                                <eval>int</eval>
                            </config>
                        </TCEforms>
                    </settings.width>
                    <settings.height>
                        <TCEforms>
                            <label>Height of the iframe (in px)</label>
                            <config>
                                <type>input</type>
                                <eval>trim</eval>
                                <size>4</size>
                                <max>4</max>
                                <eval>int</eval>
                            </config>
                        </TCEforms>
                    </settings.height>
                    <settings.issuu>
                        <TCEforms>
                            <label><![CDATA[Link for the iframe (example: http://www.google.com/)]]></label>
                            <config>
                                <type>input</type>
                                <eval>trim</eval>
                                <size>50</size>
                                <eval>required</eval>
                            </config>
                        </TCEforms>
                    </settings.issuu>
                    <settings.text>
                        <TCEforms>
                            <label>Description of iframe</label>
                            <config>
                                <type>text</type>
                                <cols>48</cols>
                                <rows>5</rows>
                                <wizards>
                                    <_PADDING>4</_PADDING>
                                    <_VALIGN>middle</_VALIGN>
                                    <RTE>
                                        <notNewRecords>1</notNewRecords>
                                        <RTEonly>1</RTEonly>
                                        <type>script</type> <title>LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:bodytext.W.RTE</title>
                                        <icon>actions-open</icon>
                                    </RTE>
                                </wizards>
                            </config>
                            <defaultExtras>richtext[bold|italic|underline|lefttoright|righttoleft|left|center|right|orderedlist|unorderedlist| insertcharacter|link|image|findreplace|removeformat|copy|cut|paste|undo|redo|toggleborders|chMode]:rte_transform[mode=ts]</defaultExtras>
                        </TCEforms>
                    </settings.text>
                </el>
            </ROOT>
        </sDEF>
    </sheets>
</T3DataStructure>

```
