---
layout: default
title:  "extbase eID"
date:   2018-04-16 17:29:01 -0100
categories: typo3
class: panel-green
description: TYPO3 extbase eID
---

## ext_localconf.php

```php
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['product'] = Xp\Product\Utility\Ajax::class . '::testAction';
```

## Classes/Utility/Ajax.php

```php
<?php

namespace Xp\Product\Utility;

use DateTime;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\Stream;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;

class Ajax
{

  public function testAction(ServerRequestInterface $request): ResponseInterface
  {
        $configurationManager = GeneralUtility::makeInstance(ConfigurationManager::class);
        $typoScript = $configurationManager->getConfiguration(
            ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT,
            'intranet_template'
        );

        $settingsText = $typoScript['page.']['10.']['variables.']['maintenanceWindow.']['value'] ?? '';
        $maintenanceWindowContentUid = (int)$typoScript['page.']['10.']['variables.']['maintenanceWindowContentUid.']['value'] ?? 30133;

        $response = new Response();
        $body = $response->getBody();
        $body->rewind();
        $content = $body->getContents();

        $response = $response->withHeader('Content-Type', 'application/json');
        $arguments = $request->getParsedBody();
        $date = new DateTime();

        $dayOfMonth = $date->format('j');
        $numberOfWeek = $date->format('N');
        $show = false;
        $firstWednesday = strtotime('first Wednesday of this month 1:00 PM');
        $currentTime = time();
        if ($dayOfMonth <= 7 && $numberOfWeek <= 3 && $currentTime <= $firstWednesday) {
            $show = true;
        }

        $dateOfFirstWednesday = date('d.m.Y', strtotime('first Wednesday of this month'));

        $bodyText = $this->getContentByUid($maintenanceWindowContentUid);
        $text = $settingsText ? sprintf($settingsText, $dateOfFirstWednesday) : sprintf($bodyText, $dateOfFirstWednesday);

        $data = [
            'text' => $text,
            'show' => $show,
            'day' => $date->format('d'),
            'month' => $date->format('m'),
            'year' => $date->format('Y'),
            'dateOfFirstWednesday' => $dateOfFirstWednesday,
            'j' => $dayOfMonth,
            'n' => $numberOfWeek,
            'h' => $date->format('H'),
            'i' => $date->format('i'),
            's' => $date->format('s'),
            'currentTime' => $currentTime,
            'firstWednesday' => $firstWednesday,
        ];
        $body = new Stream('php://temp', 'rw');
        $content = json_encode($data);
        $body->write($content);

        if ($arguments['eID'] === 'banner') {
            $response->withStatus(200);
        }

        return $response->withBody($body);
  }
  
  private function getContentByUid(int $uid)
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tt_content');

        $row = $queryBuilder->select('bodytext')
            ->from('tt_content')
            ->where(
                $queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($uid, \PDO::PARAM_INT))
            )
            ->executeQuery()
            ->fetchAssociative();
        return $row['bodytext'] ?? '';
    }
}

```

## List.html

```html
<div class="banner-maintenance-window" style="background:#ECE857;"></div>
```

## ajax.js

```javascript
import $ from 'jquery';

export default class Banner {

    static initialize() {
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        function formatDate(date) {
            return [
                padTo2Digits(date.getDate()),
                padTo2Digits(date.getMonth() + 1),
                date.getFullYear(),
            ].join('.');
        }

        let today = new Date(),
          month = today.getMonth(),
          firstDayOfMonth = new Date(today.getFullYear(), month, 1),
          dayOfWeek = firstDayOfMonth.getDay(),
          daysToWednesday = (3 - dayOfWeek + 7) % 7,
          firstWednesday = formatDate(new Date(today.getFullYear(), month, daysToWednesday + 1));

        setInterval(function() {
            $.ajax({
                type : 'post',
                url : 'index.php',
                data: {
                    eID: 'banner',
                    tx_banner_show: {

                    }
                },
                success : function(data) {
                    let bannerContainer = $('.banner-maintenance-window');
                    if (data.show) {
                        let returnText = ``;
                        if (data.dateOfFirstWednesday && data.text) {
                            returnText = `
                            <div class="container-fluid" style="padding:2rem 0;">
                                    <div class="mask-breakingnews__title">
                                        ${data.text}
                                    </div>
                                </div>
                            `;
                        } else {
                            returnText = `
                                <div class="container-fluid" style="padding:2rem 0;">
                                    <div class="mask-breakingnews__title">
                                        Vorankündigung Wartungsfenster: Am Mittwoch, ${firstWednesday} zwischen 12:00 und 13:00 Uhr kann es infolge von Wartungsarbeiten zu Unterbrüchen in der Verfügbarkeit kommen.
                                    </div>
                                </div>
                            `;
                        }

                        bannerContainer.html(returnText);
                    } else {
                        // demo
                        //bannerContainer.html(` <div class="container-fluid" style="padding:2rem 0;"><span>${data.h}:${data.i}:${data.s}</span></div>`);
                        bannerContainer.html('');
                    }
                },
                error : function() {
                }
            });
    }, 1000);
    }
}


```

