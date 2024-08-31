---
layout: tailwind
title: "TYPO3 7.6 GIFBUILDER"
date: 2018-10-29 14:09:01 -0100
categories: typo3
class: panel-green
description: TYPO3 GIFBUILDER from page property
---

## typoscript

```typoscript
temp.movieNavigation = HMENU
temp.movieNavigation {
  special = directory
  special.value = 10

  includeNotInMenu = 0

  1 = TMENU
  1 {

    wrap = <div id="movieNavControlUp"><a id="mncUp" href="#"></a></div><div id="movieNavContainer"><div id="movieNavSlider">|</div></div><div id="movieNavControlDown"><a id="mncDn" href="#"></a></div>

    NO {
      doNotLinkIt = 1
      stdWrap.cObject = COA
      stdWrap.cObject {
        wrap = <div class="movieNavFirst">|</div> |*| <div class="movieNav">|</div> |*| <div class="movieNavLast">|</div>

     10 = TEXT
     10.typolink.parameter.field = uid
     10.typolink.returnLast = url
     10.wrap = <a href="|"

     15 = TEXT
     15.value = style="background-image: url('/


  20 = IMG_RESOURCE
  20 {

      file = GIFBUILDER
      file {
        XY = 120,136
        format = jpg
        backColor = #000000

        10 = IMAGE
        10 {
          file.import.stdWrap.cObject = FILES
          file.import.stdWrap.cObject {
            references {
              table = pages
              fieldName = media
            }
            renderObj = TEXT
            renderObj {
              data = file:current:publicUrl
            }
          }
          file.width = 120c
          file.height = 68c
          mask = fileadmin/files/ich_bin/videos/mask.jpg
        }


        20 = IMAGE
        20 {
          file.import.stdWrap.cObject = FILES
          file.import.stdWrap.cObject {
            references {
              table = pages
              fieldName = media
            }
            renderObj = TEXT
            renderObj {
              data = file:current:publicUrl
            }
          }
          file.width = 120c
          file.height = 68c
          offset = 0,68
        }

      }
    }


    25 = TEXT
    25.value = ');"

    30 = TEXT
    30.field = title
    30.wrap = title ="|"

    40 = TEXT
    40.field = title
    40.wrap = >|</a>

    }
    ACT < .NO
    ACT = 1
    ACT.stdWrap.cObject.wrap = <div class="movieNavFirst cur">|</div> |*| <div class="movieNav cur">|</div> |*| <div class="movieNavLast cur">|</div>
  }
}
```
