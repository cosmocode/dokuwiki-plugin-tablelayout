<?php

/**
 * Tests for the function buildSyntaxFromJSON of the tablelayout plugin
 *
 * @group plugin_tablelayout
 * @group plugins
 *
 */
class buildSyntaxFromJSON_plugin_tablelayout_test extends DokuWikiTest
{

    protected $pluginsEnabled = array('tablelayout');


    /**
     * Testdata for @see buildSyntaxFromJSON_plugin_tablelayout_test::test_buildSyntaxFromJSON
     *
     * @return array Array of testcases
     */
    public static function dataBuildSyntaxFromJSON()
    {
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
            ),
            array(
                '{"rowsHeaderSource":2,"rowsVisible":10}',
                '{{tablelayout?rowsHeaderSource=2&rowsVisible=10}}',
                '2 fixed and 10 visible rows'
            ),
            array(
                '{"colwidth":["2px",null,"3px"],"rowsHeaderSource":2,"rowsVisible":10}',
                '{{tablelayout?rowsHeaderSource=2&rowsVisible=10&colwidth="2px,,3px"}}',
                '2 fixed and 10 visible rows and col-widths'
            ),
            array(
                '{"rowsHeaderSource":2,"colwidth":["2px",null,"3px"],"rowsVisible":10}',
                '{{tablelayout?rowsHeaderSource=2&rowsVisible=10&colwidth="2px,,3px"}}',
                '2 fixed and 10 visible rows and col-widths, differently sorted'
            ),
            array(
                '{"rowsHeaderSource":2,"colwidth":["2px",null,"3px"],"rowsVisible":10,"tableSort":1}',
                '{{tablelayout?rowsHeaderSource=2&rowsVisible=10&colwidth="2px,,3px"&tableSort=1}}',
                '2 fixed and 10 visible rows and col-widths, set tableSort to true'
            )
        );
    }

    /**
     * @dataProvider dataBuildSyntaxFromJSON
     *
     * @param string $json
     * @param array $expected_syntax
     * @param string $msg
     */
    public function testBuildSyntaxFromJSON($json, $expected_syntax, $msg)
    {
        /** @var helper_plugin_tablelayout $helper */
        $helper = plugin_load('helper', 'tablelayout');

        $actual_syntax = $helper->buildSyntaxFromJSON($json);

        $this->assertSame($expected_syntax, $actual_syntax, $msg);
    }
}
