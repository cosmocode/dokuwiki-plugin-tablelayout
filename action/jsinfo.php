<?php

use dokuwiki\Extension\ActionPlugin;
use dokuwiki\Extension\EventHandler;

/**
 * DokuWiki Plugin tablelayout
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große, Andreas Gohrs <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) {
    die();
}

class action_plugin_tablelayout_jsinfo extends ActionPlugin
{
    /**
     * Registers a callback function for a given event
     *
     * @param EventHandler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(EventHandler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'BEFORE', $this, 'populateJSINFO');
    }

    public function populateJSINFO()
    {
        global $JSINFO;

        if (!isset($JSINFO['plugins'])) {
            $JSINFO['plugins'] = [];
        }

        $JSINFO['plugins']['tablelayout'] = [
            'features_active_by_default' => $this->getConf('features_active_by_default'),
        ];
    }
}
