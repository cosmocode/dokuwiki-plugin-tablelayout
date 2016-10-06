var tablelayout = tablelayout || {};

(function (exports) {
    'use strict';
    exports.getNumberOfTableCols = function ($table) {
        var $rows = $table.find('tr');
        var max = 0;
        $rows.each(function(index, row) {
            if (max < row.cells.length) {
                max = row.cells.length;
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
        if (layoutdata.colwidth && layoutdata.colwidth.length) {
            exports.styleColumnWidths($table, layoutdata.colwidth);
        }
        if (layoutdata.rowsFixed > 0 && layoutdata.rowsVisible > 0) {
            exports.freezeTableRows($table, layoutdata.rowsFixed, layoutdata.rowsVisible);
        }
        if (layoutdata.float === 'right' || layoutdata.float === 'left' || layoutdata.float === 'center') {
            exports.floatTable($table, layoutdata.float);
        }
    };

    exports.styleColumnWidths = function ($table, colwidths) {
        var numCols = tablelayout.getNumberOfTableCols($table);
        var $colgroup = jQuery('<colgroup>');
        colwidths.forEach(function (width, index) {
            if (index+1 > numCols) {
                return;
            }
            var $col = jQuery('<col>');
            if (width !== '-') {
                $col.css('width', width);
            }
            $colgroup.append($col);
        });
        $table.prepend($colgroup);
        if (colwidths.length === numCols) {
            // todo: should we throw an error if there are MORE widths defined than cols in the table?
            $table.css('min-width', 'unset');
            $table.css('width', 'unset');
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
            console.log('adding height of row ' + i + ' of ' + jQuery($tableRows[i]).height() + ' to result in a total of ' + height);
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
}(tablelayout));
