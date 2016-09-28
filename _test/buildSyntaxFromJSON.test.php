<?php

/**
 * Tests for the function buildSyntaxFromJSON of the tablelayout plugin
 *
 * @group plugin_tablelayout
 * @group plugins
 *
 */
class buildSyntaxFromJSON_plugin_tablelayout_test extends DokuWikiTest {

    protected $pluginsEnabled = array('tablelayout');


    /**
     * Testdata for @see buildSyntaxFromJSON_plugin_tablelayout_test::test_buildSyntaxFromJSON
     *
     * @return array Array of testcases
     */
    public static function buildSyntaxFromJSON_testdata() {
        return array(
            array(
                '{"colwidth":["2px","3px"]}',
                '{{tablelayout?colwidth="2px,3px"}}',
                'Simple column widths'
            ),
            array(
                '{"colwidth":["2px",null,"3px"]}',
                '{{tablelayout?colwidth="2px,,3px"}}',
                'One undefined column-width in between'
            )
        );
    }

    /**
     * @dataProvider buildSyntaxFromJSON_testdata
     *
     * @param string $json
     * @param array $expected_syntax
     * @param string $msg
     */
    public function test_buildSyntaxFromJSON($json, $expected_syntax, $msg) {
        /** @var helper_plugin_tablelayout $helper*/
        $helper = plugin_load('helper', 'tablelayout');

        $actual_syntax = $helper->buildSyntaxFromJSON($json);

        $this->assertSame($expected_syntax, $actual_syntax, $msg);
    }
}
