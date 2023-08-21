---
layout: default
title:  "TYPO3 Middleware"
date:   2023-08-20 15:20:01 -0100
categories: middleware
class: panel-green
description: TYPO3 Middleware, pageType, session, $GLOBALS['TSFE']
---

## TYPOSCRIPT enable page type

```TypoScript
yourPage = PAGE
yourPage {
	typeNum = 123456
	config {
		disableAllHeaderCode = 1
		xhtml_cleaning = 0
		admPanel = 0
		debug = 0
    }
}
```
## Configuration/RequestMiddlewares.php

```PHP
return [
    'frontend' => [
	    // unset some middelware
        'someIdendifie' => [
            'disabled' => true,
        ],
	// custom override
        'vendor/ext/set-phrase-request' => [
            'target' => \Vendor\Package\Middleware\GetPhraseMiddleware::class,
            'after' => [
                'typo3-cms/frontend/tsfe', // your middelware can now get $GLOBALS['TSFE']
            ],
        ],
    ],
];
```
## Configuration/Services.yaml
```YAML
services:
  _defaults:
    autowire: true
    autoconfigure: true
    public: false

  Vendor\Package\:
    resource: '../Classes/*'
    exclude: '../Classes/Domain/Model/*'

  Vendor\Package\Middleware\GetPhraseMiddleware:
    public: true
```
## Classes/Middleware/GetPhraseMiddleware.php
```PHP
class GetPhraseMiddleware implements MiddlewareInterface
{
 public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
{
    /** @var PageArguments $pageArguments */
    $pageArguments = $request->getAttribute('routing', null);
    if ($pageArguments->getPageType() !== '123456') {
        return $handler->handle($request);
    }

    // $request->getAttribute('frontend.controller') ?? $GLOBALS['TSFE'];
    // $feUser = $tsfe->fe_user;
    // $feUser->setKey('ses', 'sessionKey');
    // $feUser->getKey('ses', 'sessionKey');

    if($pageArguments->getArguments()['format'] === 'txt') {
        // url: index.php?type=123456&format=txt {f:uri.page(pageType:123456, additionalParams:{format:'txt'})}
        $response = $this->responseFactory->createResponse()
            ->withHeader('Content-Type', 'text/plain');
        $response->getBody()->write('some text here!');
    } else {
      // url: index.php?type=123456 {f:uri.page(pageType:123456)}
        // render image/jpeg or other content type
        $response = $this->responseFactory->createResponse()
            ->withHeader('Content-Type', '<your/type>');
        $response->getBody()->write(<what you want>);
    }
    return $response;
}
```
### description
now TYPO3 frontend can get or set sessions by use index.php?type=123456
much fun :)
