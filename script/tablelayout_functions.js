window.tablelayout = window.tablelayout || {};

(function (exports) {
    'use strict';
    var atomicrowIndex = null;
    exports.getNumberOfTableCols = function ($table) {
        var $rows = $table.find('tr');
        var max = 0;
        $rows.each(function(index, row) {
            if (max < row.cells.length) {
                max = row.cells.length;
                atomicrowIndex = index;
            }
        });
        return max;
    };

    exports.floatTable = function ($table, direction) {
        if ($table.width() > jQuery('div.page').width()) {
            return;
        }
        var $parentDiv = $table.closest('div.table');
        var $elements = jQuery([]);
        $elements = $elements.add($parentDiv.prev('div.plugin_tablelayout_placeholder'));
        $elements = $elements.add($parentDiv);
        $elements = $elements.add($parentDiv.next('div.secedit.editbutton_table'));
        $elements.wrapAll('<div class="floatwrapper">');
        $elements.parent('div.floatwrapper').addClass(direction);
    };

    exports.applyStylesToTable = function ($table, layoutdata) {
        if (!layoutdata.colwidth) {
            layoutdata.colwidth = [];
        }
        exports.styleColumnWidths($table, layoutdata.colwidth);
        if (layoutdata.rowsFixed > 0 && layoutdata.rowsVisible > 0) {
            exports.fixColumnWidths($table);
            exports.freezeTableRows($table, layoutdata.rowsFixed, layoutdata.rowsVisible);
        }
        if (layoutdata.float === 'right' || layoutdata.float === 'left' || layoutdata.float === 'center') {
            exports.floatTable($table, layoutdata.float);
        }
    };

    exports.fixColumnWidths = function ($table) {
        var $cols = $table.find('colgroup col');
        var $atomicrow = $table.find('.row'+atomicrowIndex);
        $cols.each(function (index, col) {
            var width = $atomicrow['0'].cells.item(index).offsetWidth;
            jQuery(col).css('width', width);
        });
        $table.addClass('widthsfixed');
    };

    exports.styleColumnWidths = function ($table, colwidths) {
        var numCols = exports.getNumberOfTableCols($table);
        var $colgroup = jQuery('<colgroup>');
        for (var i = 0; i < numCols; i += 1) {
            var $col = jQuery('<col>');
            if (colwidths[i]) {
                $col.css('width', colwidths[i]);
            }
            $colgroup.append($col);
        }
        $table.prepend($colgroup);

        if (colwidths.length === numCols) {
            // todo: should we throw an error if there are MORE widths defined than cols in the table?
            $table.addClass('flexiblewidth');
        }
    };

    exports.freezeTableRows = function ($table, rowsToFreeze, rowsVisible) {
        rowsToFreeze = parseInt(rowsToFreeze);
        rowsVisible = parseInt(rowsVisible);
        if ($table.find('tr').length <= rowsToFreeze + rowsVisible) {
            return;
        }
        var $frozenTable = $table.clone();
        var $frozenRows = $frozenTable.find('tr');
        for (var i = $table.find('tr').length - 1; i >= rowsToFreeze; i -= 1) {
            $frozenRows[i].remove();
        }
        if (!$frozenTable.find('tbody').children().length) {
            $frozenTable.find('tbody').remove();
        }
        var $tableRows = $table.find('tr');
        for (i = 0; i < rowsToFreeze; i += 1) {
            $tableRows[i].remove();
        }
        if (!$table.find('thead').children().length) {
            $table.find('thead').remove();
        }
        $table.parent().prepend($frozenTable);
        $frozenTable.wrap('<div></div>');
        var height = 0;
        for (i = rowsToFreeze; i < rowsToFreeze + rowsVisible; i += 1) {
            height += jQuery($tableRows[i]).height();
        }
        var tableWrapper = jQuery('<div></div>').css({'overflow-y': 'scroll', 'height': height +'px'});
        $table.wrap(tableWrapper);
    };

    exports.initLayout = function (json) {
        var layout = {};
        if (json) {
            layout = JSON.parse(json);
        }
        if (typeof layout.colwidth == 'undefined') {
            layout.colwidth = [];
        }
        return layout;
    };

    return exports;
}(window.tablelayout));
