var tablelayout = tablelayout || {};

(function (tablelayout) {
    "use strict";

QUnit.module( "Tests for tablelayout.freezeTableRows" );
QUnit.test("fix 1 row and have 2 visible", function(assert) {
    var $fixture = $( "#qunit-fixture" );
    var $table = $fixture.find( "table" );
    var expected_html = '<div class="table sectionedit8"><div><table class="inline"> ' +
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
    '</tbody></table></div></div>';
    tablelayout.freezeTableRows($table, 1, 2);
    assert.deepEqual($fixture.html().replace(/\s\s+/g, ' ').trim(), expected_html.replace(/\s\s+/g, ' ').trim());
});

}(tablelayout));
