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
class action_plugin_tablelayout_action extends DokuWiki_Action_Plugin {

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler $controller) {
        // todo: switch to COMMON_WIKIPAGE_SAVE with next major DokuWiki release that includes pull request #1696
        $controller->register_hook('COMMON_WIKIPAGE_SAVE', 'BEFORE', $this, 'ensure_pagesave');
        $controller->register_hook('IO_WIKIPAGE_WRITE', 'BEFORE', $this, 'handle_pagesave_before');
        $controller->register_hook('PLUGIN_EDITTABLE_PREPROCESS_EDITOR', 'AFTER', $this, 'handle_preview');
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, 'add_layout_field');
    }

    public function add_layout_field (Doku_Event $event, $param) {
        global $INPUT;
        if($event->data->_hidden['target'] !== 'table') {
            return;
        }

        /** @var Doku_Form $form */
        $form =& $event->data;
        $form->addHidden('tablelayout', $INPUT->str('tablelayout'));
    }

    public function handle_preview (Doku_Event $event, $param) {
        global $ACT, $TEXT, $INPUT;
        if (act_clean($ACT) != 'preview') {
            return;
        }

        /** @var helper_plugin_tablelayout $helper */
        $helper = $this->loadHelper('tablelayout');
        $newSyntax = $helper->buildSyntaxFromJSON($INPUT->str('tablelayout'));
        if (strlen($newSyntax) > 0) {
            $TEXT = $newSyntax . "\n" . $TEXT;
        }
    }

    /**
     * Check if page has to be saved because tablelayout has changed
     *
     * @param Doku_Event $event
     * @param $param
     * @return bool
     */
    public function ensure_pagesave(Doku_Event $event, $param) {
        if ($event->data['revertFrom'] || empty($event->data['newContent']) || $event->data['contentChanged']) {
            return false;
        }
        global $RANGE, $INPUT;
        list($start) = explode('-', $RANGE);
        $start = intval($start);

        if (!$this->isTableSave($event->data['newContent'], $start)) {
            return false;
        }
        $pretext = explode("\n", substr($event->data['newContent'], 0, $start - 2));
        $oldSyntax = end($pretext);
        $newLayoutJSON = $INPUT->str('tablelayout');

        /** @var helper_plugin_tablelayout $helper */
        $helper = $this->loadHelper('tablelayout');
        $newSyntax = $helper->buildSyntaxFromJSON($newLayoutJSON);

        if ($oldSyntax != $newSyntax) {
            $event->data['contentChanged'] = true;
            return true;
        }
        return false;
    }

    /**
     * Adjust tablelayout saved on page
     *
     * @param Doku_Event $event event object by reference
     * @param mixed $param [the parameters passed as fifth argument to register_hook() when this
     *                           handler was registered]
     * @return bool
     */
    public function handle_pagesave_before(Doku_Event $event, $param) {
        if ($event->data[3] !== false) {
            return false;
        }
        global $RANGE, $INPUT;
        list($start) = explode('-', $RANGE);
        $start = intval($start);

        if (!$this->isTableSave($event->data[0][1], $start)) {
            return false;
        }
        $pretext = explode("\n", substr($event->data[0][1], 0, $start - 2));
        $oldSyntax = end($pretext);
        $newLayoutJSON = $INPUT->str('tablelayout');

        /** @var helper_plugin_tablelayout $helper */
        $helper = $this->loadHelper('tablelayout');
        $newSyntax = $helper->buildSyntaxFromJSON($newLayoutJSON);

        // todo check that old syntax and new syntax differ

        if (substr($oldSyntax, 0, strlen('{{tablelayout')) == '{{tablelayout') {
            array_pop($pretext);
        }
        $pretext[] = $newSyntax;
        $event->data[0][1] = join("\n", $pretext) . "\n" . substr($event->data[0][1], $start - 1);
        return true;
    }

    private function isTableSave ($text, $start) {
        // FIXME: not sure why we have to use $start-1 here. There might be a bug in how $RANGE is calculated
        $firstChar = substr($text, $start-1, 1);
        return  $firstChar == '^' || $firstChar == '|';
    }
}

// vim:ts=4:sw=4:et:
