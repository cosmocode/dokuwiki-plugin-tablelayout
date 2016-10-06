var tablelayout = tablelayout || {};

(function (tablelayout) {
    'use strict';

QUnit.module( 'Tests for tablelayout.freezeTableRows' );
QUnit.test('fix 1 row and have 2 visible', function(assert) {
    var $fixture = jQuery( '#qunit-fixture' );
    var $table = $fixture.find( 'table' );
    var expected_html = '<div class="plugin_tablelayout_placeholder" data-tablelayout="0"></div> <div class="table sectionedit8"><div><table class="inline"> ' +
        '<thead> ' +
        '<tr class="row0"> ' +
        '    <th class="col0 leftalign"> Column 1  </th><th class="col1 leftalign"> Column 2  </th> ' +
        '</tr> ' +
        '</thead> </table></div>' +
        '<div style="overflow-y: scroll; height: 42px;"><table class="inline"> ' +
        '<thead> ' +
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
        '</tbody></table></div></div> <div class="secedit editbutton_table editbutton_2" style="display: block; margin-top: -12px;"></div>';
    tablelayout.freezeTableRows($table, 1, 2);
    var actual_html = $fixture.html().replace(/\s\s+/g, ' ').trim();

    var actual_height = parseInt(actual_html.substr(actual_html.indexOf('height: ')+'height: '.length, '42'.length));
    actual_html = actual_html.replace(actual_height+'px', 'px');
    var expected_height = parseInt(expected_html.substr(expected_html.indexOf('height: ')+'height: '.length, '42'.length));
    expected_html = expected_html.replace(expected_height+'px', 'px');

    assert.ok(expected_height - 5 < actual_height && actual_height < expected_height + 5, 'calculated height is ok');
    assert.deepEqual(actual_html, expected_html.replace(/\s\s+/g, ' ').trim(), 'html is ok');
});

}(tablelayout));
