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

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Resource\Hook\FileDumpEIDHookInterface;
use TYPO3\CMS\Core\Resource\ProcessedFileRepository;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\HttpUtility;
//use TYPO3\CMS\Core\Controller\FileDumpController;

class Ajax //extends FileDumpController
{
  /**
   * Main method testAction
   *
   * @param ServerRequestInterface $request
   * @return ResponseInterface|null
   *
   * @throws \InvalidArgumentException
   * @throws \RuntimeException
   * @throws \TYPO3\CMS\Core\Resource\Exception\FileDoesNotExistException
   * @throws \UnexpectedValueException
   */
  public function testAction(ServerRequestInterface $request)
  {
    $parsedBody = $request->getParsedBody();
    $attributes = $request->getAttributes();
    $normalizedParams = $attributes['normalizedParams'];
    $httpHost = $normalizedParams->getHttpHost();
    $httpAcceptLanguage = $normalizedParams->getHttpAcceptLanguage();
    $target = $attributes['target'];
    $data = [];
    $request = [
      'requestHost' => $normalizedParams->getRequestHost(),
      'httpHost' => $httpHost,
      'httpAcceptLanguage' => $httpAcceptLanguage,
      'target' => $target
    ];
    array_push($data, $parsedBody, $request);
    echo json_encode($data, TRUE);
  }
}

```

## List.html

```html
<button class="ajaxButton" type="button" name="button">Ajax test</button>
<div class="ajaxShow"><div>
```

## ajax.js

```javascript
(function($){
  $('.ajaxButton').click(function(){
    $.ajax({
      type: 'post',
      url: 'index.php',
      data: {
        'eID':'product',
        'tx_product_eID[call]': 'test',
        'tx_product_eID[key]': 1,
        'tx_product_eID[uid]': 17,
        'tx_product_eID[cat]': 2
     },
     success: function(e) {
        //console.log(e);
        var element = jQuery.parseJSON(e);
        var row = [];
        $.each(element, function(index, data){
          console.log(data.tx_product_eID);
          $.each(data, function(i,k){
            if(i != 'tx_product_eID') {
              row.push('<li class="row">' +i + ' : ' + k + '</li>');
            } else {
              $.each(data.tx_product_eID, function(j,l){
                row.push('<li class="row2">' +j + ' : ' + l + '</li>');
              });
            }

          });
        });
        $('.ajaxShow').html('<ul>'+ row.join('\n') + '</ul>');
     }
    });
  });
})(jQuery);

```

