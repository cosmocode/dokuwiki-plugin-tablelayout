<?php
/**
 * DokuWiki Plugin MagicMatcher (Action Component for toolbar button)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große, Andreas Gohrs <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

class action_plugin_tablelayout_toolbarbutton extends DokuWiki_Action_Plugin {

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler $controller) {

        $controller->register_hook('TOOLBAR_DEFINE', 'AFTER', $this, 'handle_toolbar_define');
        $controller->register_hook('AJAX_CALL_UNKNOWN', 'BEFORE', $this, 'handle_ajax_call');
    }

    /**
     * Register a new toolbar button
     *
     * @param Doku_Event $event event object by reference
     * @param mixed $param [the parameters passed as fifth argument to register_hook() when this
     *                           handler was registered]
     * @return void
     */
    public function handle_toolbar_define(Doku_Event $event, $param) {
        $event->data[] = array(
            'type' => 'Plugin_tablelayout',
            'title' => $this->getLang('title:tablelayout'),
            'icon'  => DOKU_BASE . 'lib/plugins/edittable/images/add_table.png',
        );
    }

    /**
     * List available templates
     *
     * @param Doku_Event $event event object by reference
     * @param mixed $param [the parameters passed as fifth argument to register_hook() when this
     *                           handler was registered]
     * @return void
     */
    public function handle_ajax_call(Doku_Event $event, $param) {
        if($event->data != 'plugin_tablelayout_toolbar') return;
        $event->preventDefault();
        $event->stopPropagation();

        header('Content-Type: text/html; charset=utf-8');

        $form = new \dokuwiki\Form\Form();
        $form->addTextInput('rowsFixed', $this->getLang('label:rowsFixed'))->attrs(array('type' => 'number', 'min' => '0'))->val(0);
        $form->addTextInput('rowsVisible', $this->getLang('label:rowsVisible'))->attrs(array('type' => 'number', 'min' => '0'))->val(0);
        $options = array(
            'default' => $this->getLang('option:default'),
            'left' => $this->getLang('option:float left'),
            'right' => $this->getLang('option:float right'),
            'center' => $this->getLang('option:center'),
        );
        $form->addDropdown('float', $options, $this->getLang('label:alignment'))->val('default');
        $form->addButton('', $this->getLang('button:apply'))->attr('type', 'submit');


        echo '<div id="tablelayoutoptions">' . $form->toHTML() . '</div>';
    }
}

// vim:ts=4:sw=4:et:
