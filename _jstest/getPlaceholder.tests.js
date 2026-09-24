/* eslint-env qunit */

window.tablelayout = window.tablelayout || {};

(function (tablelayout) {
    'use strict';

    QUnit.module('Tests for tablelayout.getPlaceholder');

    QUnit.test('placeholder directly before the table', function (assert) {
        var $tableDiv = jQuery('#qunit-fixture').find('#placeholderFixture .table.direct');
        assert.deepEqual(tablelayout.getPlaceholder($tableDiv).data('tablelayout'), {rowsVisible: '5'});
    });

    QUnit.test('placeholder before the section highlight wrapper', function (assert) {
        var $tableDiv = jQuery('#qunit-fixture').find('#placeholderFixture .table.wrapped');
        assert.deepEqual(tablelayout.getPlaceholder($tableDiv).data('tablelayout'), {rowsVisible: '7'});
    });

    QUnit.test('table without placeholder', function (assert) {
        var $tableDiv = jQuery('#qunit-fixture').find('#placeholderFixture .table.without');
        assert.equal(tablelayout.getPlaceholder($tableDiv).length, 0);
    });
}(window.tablelayout));
