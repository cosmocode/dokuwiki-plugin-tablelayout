window.tablelayout = window.tablelayout || {};

(function (tablelayout) {
    'use strict';

    QUnit.module( 'Tests for tablelayout.floatTable' );
    QUnit.test('float table right', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' );
        var $table = $fixture.find( 'table' );
        var expected_html = '<div class="floatwrapper right"><div class="plugin_tablelayout_placeholder" data-tablelayout="0"></div><div class="table sectionedit8"><table class="inline"> ' +
            '<thead> ' +
            '<tr class="row0"> ' +
            '    <th class="col0 leftalign"> Column 1  </th><th class="col1 leftalign"> Column 2  </th> ' +
            '</tr> ' +
            '<tr class="row1"> ' +
            '    <th class="col0 leftalign"> 2         </th><th class="col1 leftalign">           </th> ' +
            '</tr> ' +
            '</thead> ' +
            '<tbody><tr class="row2"> ' +
            '    <td class="col0 leftalign"> 3         </td><td class="col1 leftalign">           </td> ' +
            '</tr> ' +
            '<tr class="row3"> ' +
            '    <th class="col0 leftalign"> 4         </th><th class="col1 leftalign">           </th> ' +
            '</tr> ' +
            '<tr class="row4"> ' +
            '    <td class="col0 leftalign"> 5         </td><td class="col1 leftalign">           </td> ' +
            '</tr> ' +
            '</tbody></table></div><div class="secedit editbutton_table editbutton_2" style="display: block; margin-top: -12px;"></div></div>';
        tablelayout.floatTable($table, 'right');
        var actual_html = $fixture.html().replace(/\s\s+/g, ' ').trim();

        assert.deepEqual(actual_html, expected_html.replace(/\s\s+/g, ' ').trim(), 'html is ok');
    });


    QUnit.test('float table center', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' );
        var $table = $fixture.find( 'table' );
        var expected_html = '<div class="floatwrapper center"><div class="plugin_tablelayout_placeholder" data-tablelayout="0"></div><div class="table sectionedit8"><table class="inline"> ' +
            '<thead> ' +
            '<tr class="row0"> ' +
            '    <th class="col0 leftalign"> Column 1  </th><th class="col1 leftalign"> Column 2  </th> ' +
            '</tr> ' +
            '<tr class="row1"> ' +
            '    <th class="col0 leftalign"> 2         </th><th class="col1 leftalign">           </th> ' +
            '</tr> ' +
            '</thead> ' +
            '<tbody><tr class="row2"> ' +
            '    <td class="col0 leftalign"> 3         </td><td class="col1 leftalign">           </td> ' +
            '</tr> ' +
            '<tr class="row3"> ' +
            '    <th class="col0 leftalign"> 4         </th><th class="col1 leftalign">           </th> ' +
            '</tr> ' +
            '<tr class="row4"> ' +
            '    <td class="col0 leftalign"> 5         </td><td class="col1 leftalign">           </td> ' +
            '</tr> ' +
            '</tbody></table></div><div class="secedit editbutton_table editbutton_2" style="display: block; margin-top: -12px;"></div></div>';
        tablelayout.floatTable($table, 'center');
        var actual_html = $fixture.html().replace(/\s\s+/g, ' ').trim();

        assert.deepEqual(actual_html, expected_html.replace(/\s\s+/g, ' ').trim(), 'html is ok');
    });

}(window.tablelayout));
