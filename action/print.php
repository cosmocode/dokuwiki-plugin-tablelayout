<?php
/**
 * DokuWiki Plugin tablelayout (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

/**
 * Class action_plugin_tablelayout_print
 *
 * Handles the adjusted tablelayout strings from edittable
 */
class action_plugin_tablelayout_print extends DokuWiki_Action_Plugin {
    public function register(Doku_Event_Handler $controller) {
        $controller->register_hook('ACTION_ACT_PREPROCESS', 'BEFORE', $this, 'allow_tablelayout_print');
        $controller->register_hook('TPL_ACT_UNKNOWN', 'BEFORE',  $this, 'print_table');
    }

    public function allow_tablelayout_print(Doku_Event $event, $param) {
        if ($event->data != 'tablelayout_printtable') {
            return;
        }
        global $ID;
        if (auth_quickaclcheck($ID) < AUTH_READ) {
            msg('Not Authorized for page ' . hsc($ID), -1);
            $event->data = 'show';
            return;
        }
        $event->preventDefault();
    }

    public function print_table(Doku_Event $event, $param) {
        if($event->data != 'tablelayout_printtable') return;
        $event->preventDefault();
        global $INPUT, $ID;
        list($prefix, $table, $suffix) = rawWikiSlices($INPUT->str('range'), $ID);
        echo '<span id="tablelayout_printthis"></span>';
        echo p_render('xhtml', p_get_instructions($table), $info);
    }

}
