<?php

use dokuwiki\Extension\ActionPlugin;
use dokuwiki\Extension\EventHandler;
use dokuwiki\Extension\Event;
use dokuwiki\Form\Form;

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
class action_plugin_tablelayout_action extends ActionPlugin
{
    /**
     * Registers a callback function for a given event
     *
     * @param EventHandler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(EventHandler $controller)
    {
        $controller->register_hook('COMMON_WIKIPAGE_SAVE', 'BEFORE', $this, 'ensurePagesave');
        $controller->register_hook('PLUGIN_EDITTABLE_PREPROCESS_EDITOR', 'AFTER', $this, 'handleTablePost');
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, 'addLayoutField');
        $controller->register_hook('FORM_EDIT_OUTPUT', 'BEFORE', $this, 'addLayoutField');
    }

    /**
     * Adds tablelayout options to hidden fields, and so makes them accessible
     * to tablelayout form.
     *
     * @param Event $event
     * @return void
     */
    public function addLayoutField(Event $event)
    {
        global $INPUT;

        /** @var Doku_Form||\dokuwiki\Form\Form $form */
        $form =& $event->data;

        if (is_a($form, Form::class) && $INPUT->str('target') === 'table') {
            $form->setHiddenField('tablelayout', $INPUT->str('tablelayout'));
        }

        if (is_a($form, Doku_Form::class) && $event->data->_hidden['target'] !== 'table') {
            $form->addHidden('tablelayout', $INPUT->str('tablelayout'));
        }
    }

    public function handleTablePost(Event $event, $param)
    {
        global $TEXT, $INPUT;

        switch (act_clean($event->data)) {
            case 'preview':
                /** @var helper_plugin_tablelayout $helper */
                $helper = $this->loadHelper('tablelayout');
                $newSyntax = $helper->buildSyntaxFromJSON($INPUT->str('tablelayout'));
                if ((string) $newSyntax !== '') {
                    $TEXT = $newSyntax . "\n" . $TEXT;
                }
                break;
            case 'save':
                if ($INPUT->post->has('edittable__new')) {
                    /** @var helper_plugin_tablelayout $helper */
                    $helper = $this->loadHelper('tablelayout');
                    $newSyntax = $helper->buildSyntaxFromJSON($INPUT->str('tablelayout'));
                    if ((string) $newSyntax !== '') {
                        $TEXT = $newSyntax . "\n" . $TEXT;
                    }
                };
                break;
            case 'edit':
                if ($INPUT->post->has('edittable__new')) {
                    $featuresDefaultState = $this->getConf('features_active_by_default') === 1;
                    // FIXME this duplicates the default layout-data in the javascript
                    $INPUT->post->set('tablelayout', json_encode([
                            'rowsHeaderSource' => 'Auto',
                            'tableSearch' => $featuresDefaultState,
                            'tableSort' => $featuresDefaultState,
                            'tablePrint' => $featuresDefaultState,
                        ]));
                };
            default:
        }
    }

    /**
     * Check if page has to be saved because tablelayout has changed
     *
     * @param Event $event
     * @param $param
     * @return void
     */
    public function ensurePagesave(Event $event, $param)
    {
        if ($event->data['revertFrom'] || empty($event->data['newContent'])) {
            return;
        }
        global $RANGE, $INPUT;
        if (!$INPUT->has('tablelayout')) {
            return;
        }
        [$start] = explode('-', $RANGE);
        $start = (int)$start - 1; // $RANGE is 1-based

        if (!$this->isTableSave($event->data['newContent'], $start)) {
            return;
        }
        $pretext = explode("\n", rtrim(substr($event->data['newContent'], 0, $start)));
        $tableAndSuffix = substr($event->data['newContent'], $start);

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
            return;
        }
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
