---
layout: default
title:  "TYPO3 Command Line"
date:   2017-03-09 08:38:59 -0100
categories: TYPO3
class: panel-green
description: Command Lind for TYPO3
---

# TYPO3 Command Line

## AccordionCommandController.php

´´´php

namespace Cabag\BiozentrumAccordion\Command;
use \TYPO3\CMS\Core\Utility\GeneralUtility;

class AccordionCommandController extends \TYPO3\CMS\Extbase\Mvc\Controller\CommandController
{
	/**
	 * tx_templavoila_ds = 10	
	 * tx_templavoila_to = 11
	 * 
	 * to 
	 * CType = biozentrumaccordion_accordion
	 * header = header
	 * subheader = field_title.vDEF
	 * bodytext = field_inhalt.vDEF
	 * header_link = header_link
	 * php typo3/cli_dispatch.phpsh extbase biozentrum_accordion:accordion:accordion --dry-run=1
	 * Migrate default content Templavoilà objects to default textpic elements
	 *
	 * @param integer $templavoilaObjectId
	 * @param boolean $dryRun Dry run
	 * @return void
	 */
	public function accordionCommand($templavoilaObjectId = 10, $dryRun = true)
	{
		$where = ' ';
		//$where .= 'AND uid = 4587';
		
		$res = $GLOBALS['TYPO3_DB']->exec_SELECTgetRows(
			'uid,pid, tstamp,crdate,ExtractValue(tx_templavoila_flex, \'T3FlexForms/data/sheet/language/field[@index="field_inhalt"]/value[@index="vDEF"]\') as bodytext, ExtractValue(tx_templavoila_flex, \'T3FlexForms/data/sheet/language/field[@index="field_title"]/value\') as subheader, sys_language_uid,l18n_parent,\'biozentrumaccordion_accordion\' as CType', 
			'tt_content', 
			'tx_templavoila_ds = ' . intval($templavoilaObjectId) . ' AND tx_templavoila_to = 11'. $where, 
			'', 
			'l18n_parent ASC'
		);
		
		
		
		foreach($res as $index => $result) {
			$uid = $result['uid'];
			$result['bodytext'] = htmlspecialchars_decode($result['bodytext']);
			$this->updateContent($uid, $result, $dryRun);
		}
	}
	
	/**
	 * 
	 * @param integer $uid
	 * @param array $result
	 * @param boolean $dryRun
	 */
	private function updateContent($uid = 0, $result, $dryRun) {
		$updateWhere = 'uid = ' . $uid;

		if (!$dryRun) {
			$GLOBALS['TYPO3_DB']->exec_UPDATEquery(
				'tt_content', $updateWhere, $result
			);
		} else {
			echo $GLOBALS['TYPO3_DB']->UPDATEquery(
				'tt_content', $updateWhere, $result
			),';', chr(10);
		}
	}
}

´´´

## ext_localconf.php

´´´php

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['extbase']['commandControllers'][] = 'Cabag\\BiozentrumAccordion\\Command\\AccordionCommandController';

´´´
