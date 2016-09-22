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
 * Class action_plugin_tablelayout
 *
 * Handles the adjusted tablelayout strings from edittable
 */
class action_plugin_tablelayout extends DokuWiki_Action_Plugin {

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler $controller) {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'handle_dokuwik_started');
    }

    public function handle_dokuwik_started (Doku_Event $event, $param) {
        global $JSINFO, $ID;
        $meta = p_get_metadata($ID);
        if (!empty($meta['plugin']['tablelayout'])) {
            $JSINFO['plugin']['tablelayout'] = $meta['plugin']['tablelayout'];
        }
    }
}

// vim:ts=4:sw=4:et:
