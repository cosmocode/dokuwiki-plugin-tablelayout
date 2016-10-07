<?php
/**
 * DokuWiki Plugin tablelayout (Syntax Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Michael Große <dokuwiki@cosmocode.de>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) die();

class syntax_plugin_tablelayout extends DokuWiki_Syntax_Plugin {

    /**
     * @return string Syntax mode type
     */
    public function getType() {
        return 'container';
    }

    /**
     * @return string Paragraph type
     */
    public function getPType() {
        return 'block';
    }

    /**
     * @return int Sort order - Low numbers go before high numbers
     */
    public function getSort() {
        return 20;
    }

    /**
     * Connect lookup pattern to lexer.
     *
     * @param string $mode Parser mode
     */
    public function connectTo($mode) {
        $this->Lexer->addSpecialPattern('{{tablelayout\?[^\n]*?}}(?=\s*?\n[|^])',$mode,'plugin_tablelayout');
    }

    /**
     * Handle matches of the tablelayout syntax
     *
     * @param string $match The match of the syntax
     * @param int    $state The state of the handler
     * @param int    $pos The position in the document
     * @param Doku_Handler    $handler The handler
     * @return array Data for the renderer
     */
    public function handle($match, $state, $pos, Doku_Handler $handler){
        $options = explode('&', substr($match, strlen('{{tablelayout?'), strlen($match)-(strlen('{{tablelayout?}}'))));
        $options = array_filter($options);
        $data = array();
        if (empty($options)) {
            return $data;
        }
        foreach ($options as $option) {
            list($key, $value) = explode('=', $option);
            switch ($key) {
                case 'float':
                case 'rowsVisible':
                case 'rowsFixed':
                    $data[$key] = $value;
                    break;
                case 'colwidth':
                    $value = array_map('trim', explode(',', trim($value, '"\'')));
                    $data[$key] = $value;
                    break;
                default:
                    msg('Unknown option: ' . hsc($key), -1);
            }
        }
        if (empty($data)) {
            return $data;
        }

        return $data;
    }

    /**
     * Render xhtml output or metadata
     *
     * @param string         $mode      Renderer mode (supported modes: xhtml)
     * @param Doku_Renderer  $renderer  The renderer
     * @param array          $data      The data from the handler() function
     * @return bool If rendering was successful.
     */
    public function render($mode, Doku_Renderer $renderer, $data) {
        if (empty($data)) return false;
        if ($mode != 'xhtml') {
            return false;
        }

        $renderer->doc .= "<div class='plugin_tablelayout_placeholder' data-tablelayout='".json_encode($data)."'></div>";
        return true;
    }
}

// vim:ts=4:sw=4:et:
