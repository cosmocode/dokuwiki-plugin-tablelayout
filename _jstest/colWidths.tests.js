window.tablelayout = window.tablelayout || {};

(function (tablelayout) {
    'use strict';

    QUnit.module( 'Tests for tablelayout.styleColumnWidths' );
    QUnit.test('float style both rows', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' ).find('#smallTable');
        var $table = $fixture.find( 'table' );
        var expected_html = '<div class="plugin_tablelayout_placeholder" data-tablelayout="0"></div> <div class="table sectionedit8"><table class="inline flexiblewidth">' +
            '<colgroup><col style="width: 80px;"><col style="width: 80px;"></colgroup> <thead> ' +
            '<tr class="row0"> ' +
            '    <th class="col0 leftalign"> Column 1  </th><th class="col1 leftalign"> Column 2  </th> ' +
            '</tr> ' +
            '<tr class="row1"> ' +
            '    <th class="col0 leftalign"> 2         </th><th class="col1 leftalign"> T          </th> ' +
            '</tr> ' +
            '</thead> ' +
            '<tbody><tr class="row2"> ' +
            '    <td class="col0 leftalign"> 3         </td><td class="col1 leftalign"> v          </td> ' +
            '</tr> ' +
            '<tr class="row3"> ' +
            '    <th class="col0 leftalign"> 4         </th><th class="col1 leftalign"> A          </th> ' +
            '</tr> ' +
            '<tr class="row4"> ' +
            '    <td class="col0 leftalign"> 5         </td><td class="col1 leftalign"> b          </td> ' +
            '</tr> ' +
            '</tbody></table></div> <div class="secedit editbutton_table editbutton_2" style="display: block; margin-top: -12px;"></div>';
        tablelayout.styleColumnWidths($table, ['80px', '80px']);
        var actual_html = $fixture.html().replace(/\s\s+/g, ' ').trim();

        assert.deepEqual(actual_html, expected_html.replace(/\s\s+/g, ' ').trim(), 'html is ok');
    });

    QUnit.test('float style first row only', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' ).find('#smallTable');
        var $table = $fixture.find( 'table' );
        var expected_html = '<div class="plugin_tablelayout_placeholder" data-tablelayout="0"></div> <div class="table sectionedit8"><table class="inline">' +
            '<colgroup><col style="width: 80px;"><col></colgroup> <thead> ' +
            '<tr class="row0"> ' +
            '    <th class="col0 leftalign"> Column 1  </th><th class="col1 leftalign"> Column 2  </th> ' +
            '</tr> ' +
            '<tr class="row1"> ' +
            '    <th class="col0 leftalign"> 2         </th><th class="col1 leftalign"> T          </th> ' +
            '</tr> ' +
            '</thead> ' +
            '<tbody><tr class="row2"> ' +
            '    <td class="col0 leftalign"> 3         </td><td class="col1 leftalign">  v         </td> ' +
            '</tr> ' +
            '<tr class="row3"> ' +
            '    <th class="col0 leftalign"> 4         </th><th class="col1 leftalign"> A          </th> ' +
            '</tr> ' +
            '<tr class="row4"> ' +
            '    <td class="col0 leftalign"> 5         </td><td class="col1 leftalign"> b          </td> ' +
            '</tr> ' +
            '</tbody></table></div> <div class="secedit editbutton_table editbutton_2" style="display: block; margin-top: -12px;"></div>';
        tablelayout.styleColumnWidths($table, ['80px']);
        var actual_html = $fixture.html().replace(/\s\s+/g, ' ').trim();

        assert.deepEqual(actual_html, expected_html.replace(/\s\s+/g, ' ').trim(), 'html is ok');
    });

    QUnit.test('number of table columns', function(assert) {
        var $table = jQuery( '#qunit-fixture' ).find('#smallTable').find( 'table' );
        var actual_number = tablelayout.getNumberOfTableCols($table);
        var expected_number = 2;
        assert.equal(actual_number, expected_number, 'number of columns correctly counted');
    });

}(window.tablelayout));
