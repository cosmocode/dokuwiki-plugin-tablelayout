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
 * Class action_plugin_tablelayout
 *
 * Handles the adjusted tablelayout strings from edittable
 */
class action_plugin_tablelayout_action extends DokuWiki_Action_Plugin
{

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('COMMON_WIKIPAGE_SAVE', 'BEFORE', $this, 'ensurePagesave');
        $controller->register_hook('PLUGIN_EDITTABLE_PREPROCESS_EDITOR', 'AFTER', $this, 'handlePreview');
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, 'addLayoutField');
    }

    public function addLayoutField(Doku_Event $event, $param)
    {
        global $INPUT;
        if ($event->data->_hidden['target'] !== 'table') {
            return;
        }

        /** @var Doku_Form $form */
        $form =& $event->data;
        $form->addHidden('tablelayout', $INPUT->str('tablelayout'));
    }

    public function handlePreview(Doku_Event $event, $param)
    {
        global $ACT, $TEXT, $INPUT;
        if (act_clean($ACT) !== 'preview') {
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
    public function ensurePagesave(Doku_Event $event, $param)
    {
        if ($event->data['revertFrom'] || empty($event->data['newContent']) || $event->data['contentChanged']) {
            return false;
        }
        global $RANGE, $INPUT;
        if (!$INPUT->has('tablelayout')) {
            return false;
        }
        list($start) = explode('-', $RANGE);
        $start = (int)$start;

        if (!$this->isTableSave($event->data['newContent'], $start)) {
            return false;
        }
        $pretext = explode("\n", rtrim(substr($event->data['newContent'], 0, $start - 1)));
        $tableAndSuffix = substr($event->data['newContent'],$start - 1);

        $oldSyntax = end($pretext);
        $newLayoutJSON = $INPUT->str('tablelayout');

        /** @var helper_plugin_tablelayout $helper */
        $helper = $this->loadHelper('tablelayout');
        $newSyntax = $helper->buildSyntaxFromJSON($newLayoutJSON);

        if ($oldSyntax !== $newSyntax) {
            if (strpos($oldSyntax, '{{tablelayout') === 0) {
                array_pop($pretext);
            }
            $pretext[] = $newSyntax;
            $event->data['newContent'] = implode("\n", $pretext) . "\n" . $tableAndSuffix;
            $event->data['contentChanged'] = true;
            return true;
        }
        return false;
    }

    private function isTableSave($text, $start)
    {
        // FIXME: not sure why we have to use $start-1 here. There might be a bug in how $RANGE is calculated
        $firstChar = $text[$start - 1];
        return $firstChar === '^' || $firstChar === '|';
    }
}

// vim:ts=4:sw=4:et:
