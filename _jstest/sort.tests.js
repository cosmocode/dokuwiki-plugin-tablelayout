window.tablelayout = window.tablelayout || {};

(function (tablelayout) {
    'use strict';

    QUnit.module( 'Tests for tablelayout.sortTable' );
    QUnit.test('sort desc', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' );
        var $tableRows = $fixture.find( 'table tr' ).slice(1);
        var $actualSortedRows = tablelayout.sortTable($tableRows, 0, 'desc');

        var expectedClasses = ['row4', 'row3', 'row2', 'row1'];
        expectedClasses.forEach(function (expectedClassName, index) {
            assert.equal($actualSortedRows[index].className, expectedClassName);
        });
    });


    QUnit.test('sort asc', function(assert) {
        var $fixture = jQuery( '#qunit-fixture' );
        var $tableRows = $fixture.find( 'table tr' ).slice(1);
        var $actualSortedRows = tablelayout.sortTable($tableRows, 1, 'asc');

        var expectedClasses = ['row3', 'row4', 'row1', 'row2'];
        expectedClasses.forEach(function (expectedClassName, index) {
            assert.equal($actualSortedRows[index].className, expectedClassName);
        });
    });

}(window.tablelayout));
