<?php
/**
 * DokuWiki Plugin tablelayout (Helper Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

class helper_plugin_tablelayout extends DokuWiki_Plugin {

    public function buildSyntaxFromJSON($json) {
        $layout = json_decode($json);
        // todo check for decoding errors
        $syntax = array();
        if (!empty($layout->rowsHeader)) {
            $syntax[] = "rowsHeader=" . $layout->rowsHeader;
        }
        if (!empty($layout->rowsVisible)) {
            $syntax[] = "rowsVisible=" . $layout->rowsVisible;
        }
        if (!empty($layout->colwidth)) {
            $syntax[] = 'colwidth="' . join(',',$layout->colwidth) . '"';
        }
        if (!empty($layout->float)) {
            $syntax[] = "float=" . $layout->float;
        }
        if (!empty($layout->tableSort)) {
            $syntax[] = 'tableSort=1';
        }

        if (count($syntax) == 0) {
            return "";
        }
        $syntax = '{{tablelayout?' . join('&', $syntax) . '}}';
        return $syntax;
    }
}
