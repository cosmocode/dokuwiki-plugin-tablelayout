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
        $controller->register_hook('PLUGIN_EDITTABLE_PREPROCESS_EDITOR', 'AFTER', $this, 'handleTablePost');
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

    public function handleTablePost(Doku_Event $event, $param)
    {
        global $TEXT, $INPUT;

        switch (act_clean($event->data)) {
            case 'preview':
                /** @var helper_plugin_tablelayout $helper */
                $helper = $this->loadHelper('tablelayout');
                $newSyntax = $helper->buildSyntaxFromJSON($INPUT->str('tablelayout'));
                if (strlen($newSyntax) > 0) {
                    $TEXT = $newSyntax . "\n" . $TEXT;
                }
                break;
            case 'save':
                if ($INPUT->post->has('edittable__new')) {
                    /** @var helper_plugin_tablelayout $helper */
                    $helper = $this->loadHelper('tablelayout');
                    $newSyntax = $helper->buildSyntaxFromJSON($INPUT->str('tablelayout'));
                    if (strlen($newSyntax) > 0) {
                        $TEXT = $newSyntax . "\n" . $TEXT;
                    }
                };
                break;
            case 'edit':
                if ($INPUT->post->has('edittable__new')) {
                    $featuresDefaultState = $this->getConf('features_active_by_default') === 1;
                    // FIXME this duplicates the default layout-data in the javascript
                    $INPUT->post->set('tablelayout', json_encode(array(
                            'rowsHeaderSource' => 'Auto',
                            'tableSearch' => $featuresDefaultState,
                            'tableSort' => $featuresDefaultState,
                            'tablePrint' => $featuresDefaultState,
                        ))
                    );
                };
            default:
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
        $start = (int)$start-1; // $RANGE is 1-based

        if (!$this->isTableSave($event->data['newContent'], $start)) {
            return false;
        }
        $pretext = explode("\n", rtrim(substr($event->data['newContent'], 0, $start)));
        $tableAndSuffix = substr($event->data['newContent'],$start);

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

    /**
     * Determine if this is saving a table
     *
     * @todo: this might be somewhat redundant, since only table-saves should have the tablelayout-key
     *
     * @param string $text
     * @param int $start
     * @return bool
     */
    private function isTableSave($text, $start)
    {
        $firstChar = $text[$start];
        return $firstChar === '^' || $firstChar === '|';
    }
}

// vim:ts=4:sw=4:et:
