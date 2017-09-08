window.tablelayout = window.tablelayout || {};

(function (tablelayout) {
    'use strict';

    QUnit.module( 'Tests for tablelayout.splitMerges' );
    QUnit.test('sort desc', function(assert) {
        var $fixture = jQuery( '#qunit-fixture').find('#mergeFixture' );
        var $tableRows = $fixture.find( 'table tr' );
        var $actualSplitRows = tablelayout.splitMerges($tableRows, 0, 'desc');
        var actualText = $actualSplitRows.text().split('\n').filter(function(rowText) {return rowText.trim().length;}).map(function(rowText){return rowText.replace(/\s/g,'');});
        var expectedText = ['A1B1C1D1', 'A2MMD2', 'A3MMD3', 'A4B4C4D4'];
        assert.deepEqual(actualText, expectedText);
    });

}(window.tablelayout));
