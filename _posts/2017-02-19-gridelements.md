---
layout: tailwind
title:  "typo3 gridelements"
date:   2017-02-18 09:58:01 -0100
categories: typo3
class: panel-info
description: gridelements works with fluid templates
---

# gridelements works with page TS, typoscript, dataProcessing and fluid templates


## page TS config

``` typoscript

tx_gridelements.setup {
    accordion {
        title = Accordion
        alias = accordion
        icon = EXT:custom_template/Resources/Public/Icons/accordion.svg
        description = this is the test accordion
        top_level_layout = 1
        //flexformDS = FILE:EXT:custom_template/Configuration/FlexForm/Accordion.xml
        frame = 1
        config {
            colCount = 1
            rowCount = 1
            rows {
                1 {
                    columns {
                        1 {
                            name = Accordion
                            colPos = 10
                            allowed = header,textmedia,bullets,table,uploads,multimedia,media,menu
                        }
                    }
                }
            }
        }
    }
}
```

## tt_content

``` typoscript
tt_content_accordion < tt_content
tt_content_accordion.stdWrap {
    dataWrap >
    dataWrap (
        <div class="panel {field:tx_nabintra_accordeon_color}">
            <div class="item panel-heading" id="heading_{field:uid}"><h4 class="panel-title">
                <a href="#collapse_{field:uid}" data-toggle="collapse" class="collapsed" role="button"  aria-expanded="false" aria-controls="collapse_{field:uid}">{field:tx_nabintra_accordeon_title}</a></h4>
            </div>
            <div id="collapse_{field:uid}" class="panel-collapse collapse">
                <a name="collapse_{field:uid}" class="anchorLink"></a>
                <div class="panel-body panel-body-search ">|</div>
            </div>
        </div>
    )

    dataWrap.override.if.isTrue.field = tx_nabintra_tt_content_open
    dataWrap.override (
        <div class="panel {field:tx_nabintra_accordeon_color}">
            <div class="item panel-heading" id="heading_{field:uid}">
                <h4 class="panel-title"><a href="#collapse_{field:uid}" data-toggle="collapse" class="" role="button"  aria-expanded="false" aria-controls="collapse_{field:uid}">{field:tx_nabintra_accordeon_title}</a></h4>
            </div>
            <div id="collapse_{field:uid}" class="panel-collapse collapse in">
                <a name="collapse_{field:uid}" class="anchorLink"></a>
                <div class="panel-body panel-body-search">|</div>
            </div>
        </div>
    )
}

tt_content.gridelements_pi1.20.10.setup {
    accordion {
        wrap = <div class="accordion"><div class="panel-group" id="accordion_{field:uid}">|</div></div>
        wrap.insertData = 1
        columns {
            default {
                renderObj =< tt_content_accordion
            }
        }
    }
}


################################################################################
#
lib.fluidContent {
    // add header layout h1, h2, h3 ...
    partialRootPaths {
        100 = EXT:custom_template/Resources/Private/Partials/
    }

    templateRootPaths {
        100 = EXT:custom_template/Resources/Private/Templates
    }
}

tt_content.gridelements_pi1.20.10.setup {
    panel < lib.gridelements.defaultGridSetup
    panel {
        # way 1: with fluid template
        cObject = FLUIDTEMPLATE
        cObject {
            file = EXT:custom_template/Resources/Private/Templates/FCE/Panel.html
        }
    }

 ###
 # accordion
    accordion < lib.gridelements.defaultGridSetup
    accordion {
        columns.default.renderObj.20 =< tt_content
        columns.default.renderObj.20 {
             # way 2:
            header =< lib.fluidContent
            header {
                templateRootPaths {
                    200 = EXT:custom_template/Resources/Private/Templates/Template
                }
                # # way 2: fluid template EXT:custom_template/Resources/Private/Templates/Template/AccordionRaster.html
                templateName = AccordionRaster
                dataProcessing {
                    20 = Xp\CustomTemplate\DataProcessing\AccordionProcessor
                }
            }
            textmedia < .header
            textmedia {
                templateName = Textmedia
                dataProcessing =< tt_content.textmedia.dataProcessing
                dataProcessing.20 =  TYPO3\CMS\Frontend\DataProcessing\GalleryProcessor
            }
        }
        wrap = <div class="accordion accordion-gc" style="border:1px solid green; padding: 5px;margin:10px">|</div>
    }
}
```
## html

```html
<html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers" xmlns:ce="http://typo3.org/ns/TYPO3/CMS/FluidStyledContent/ViewHelpers" data-namespace-typo3-fluid="true">
<div class="accordion accordion-{data.CType} ce_{data.uid}">
    <h1>{data.header}</h1>
    <div class="text">{data.bodytext->f:format.html()}</div>

    <div id="c{data.uid}">

        <div class="ce-textpic ce-{gallery.position.horizontal} ce-{gallery.position.vertical}{f:if(condition: gallery.position.noWrap, then: ' ce-nowrap')}">
            <f:if condition="{gallery.position.vertical} != 'below'">
                <f:render partial="MediaGallery" arguments="{_all}" />
            </f:if>

            <f:if condition="{gallery.position.vertical} == 'below'">
                <f:render partial="MediaGallery" arguments="{_all}" />
            </f:if>
        </div>

    </div>
</div>
</html>
```
