<?php
/**
 * DokuWiki Plugin MagicMatcher (Action Component for toolbar button)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große, Andreas Gohrs <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) {
    die();
}

class action_plugin_tablelayout_layoutform extends DokuWiki_Action_Plugin
{

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('AJAX_CALL_UNKNOWN', 'BEFORE', $this, 'handleAjaxCall');
    }

    /**
     * List available templates
     *
     * @param Doku_Event $event event object by reference
     * @param mixed $param [the parameters passed as fifth argument to register_hook() when this
     *                           handler was registered]
     * @return void
     */
    public function handleAjaxCall(Doku_Event $event, $param)
    {
        if ($event->data !== 'plugin_tablelayout_form') {
            return;
        }
        $event->preventDefault();
        $event->stopPropagation();

        header('Content-Type: text/html; charset=utf-8');

        $form = new \dokuwiki\Form\Form();
        $form->addFieldsetOpen($this->getLang('legend:tablelayout'))->addClass('borderless');
        $form->addTagOpen('div')->attr('style', 'display: none;');
        $form->addDropdown('rowsHeaderSource',
            ['Auto', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            $this->getLang('label:rowsHeader'));
        $form->addTextInput('rowsVisible', $this->getLang('label:rowsVisible'))
            ->attrs(array('type' => 'number', 'min' => '0'))
            ->val(0);
        $options = array(
            'default' => $this->getLang('option:default'),
            'left' => $this->getLang('option:float left'),
            'right' => $this->getLang('option:float right'),
            'center' => $this->getLang('option:center'),
        );
        $form->addDropdown('float', $options, $this->getLang('label:alignment'))->val('default');
        $form->addCheckbox('tableSort', $this->getLang('label:tableSort'));
        $form->addCheckbox('tableSearch', $this->getLang('label:tableSearch'));
        $form->addCheckbox('tablePrint', $this->getLang('label:tablePrint'));
        $form->addButton('', $this->getLang('button:apply'))->attr('type', 'submit');
        $form->addTagClose('div');
        $form->addFieldsetClose();


        echo '<div id="tablelayoutoptions">' . $form->toHTML() . '</div>';
    }
}

// vim:ts=4:sw=4:et:
