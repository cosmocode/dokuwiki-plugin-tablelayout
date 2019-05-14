<?php
/**
 * DokuWiki Plugin tablelayout (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) {
    die();
}

/**
 * Class action_plugin_tablelayout_print
 *
 * Handles the adjusted tablelayout strings from edittable
 */
class action_plugin_tablelayout_print extends DokuWiki_Action_Plugin
{
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('ACTION_ACT_PREPROCESS', 'BEFORE', $this, 'allowTablelayoutPrint');
        $controller->register_hook('TPL_ACT_UNKNOWN', 'BEFORE', $this, 'printTable');
    }

    public function allowTablelayoutPrint(Doku_Event $event, $param)
    {
        if ($event->data !== 'tablelayout_printtable') {
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

    public function printTable(Doku_Event $event, $param)
    {
        if ($event->data !== 'tablelayout_printtable') {
            return;
        }
        $event->preventDefault();
        global $INPUT, $ID;
        list(, $table, ) = rawWikiSlices($INPUT->str('range'), $ID);
        echo '<span id="tablelayout_printthis"></span>';

        // pass layout to javascript, so that it can apply column width styles
        if ($INPUT->str('colwidth')) {
            $json = hsc(
                json_encode(
                    [
                        'colwidth' => explode(',', $INPUT->str('colwidth')),
                    ]
                )
            );
            echo "<div class='plugin_tablelayout_placeholder' data-tablelayout=\"$json\"></div>";
        }

        echo p_render('xhtml', p_get_instructions($table), $info);
    }
}
