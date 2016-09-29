var tablelayout = function () {
    "use strict";
    var exports = {};
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

    exports.applyStylesToTable = function ($table, layoutdata) {
        if (layoutdata.colwidth && layoutdata.colwidth.length) {
            exports.styleColumnWidths($table, layoutdata.colwidth);
        }
        if (layoutdata.rowsFixed > 0 && layoutdata.rowsVisible > 0) {
            exports.freezeTableRows($table, layoutdata.rowsFixed, layoutdata.rowsVisible);
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
            if (width != '-') {
                $col.css('width', width);
            }
            $colgroup.append($col);
        });
        $table.prepend($colgroup);
        if (colwidths.length == numCols) {
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
            // height += parseInt(jQuery($tableRows[i]).css('height'));
        }
        var tableWrapper = jQuery('<div></div>').css({"overflow-y": "scroll", "height": height +'px'});
        $table.wrap(tableWrapper);
    };

    return exports;
}();

jQuery(function(){
    'use strict';

    jQuery('.plugin_tablelayout_placeholder').each(function (index, element) {
        var id = jQuery(element).data('tablelayout');
        var $table = jQuery(element).next().find('table');
        var layoutdata;

        if (id == 'preview') {
            layoutdata = JSON.parse(jQuery('#dw__editform').find('input[name="tablelayout"]').val());
            tablelayout.applyStylesToTable($table, layoutdata);
            return;
        }

        if (typeof JSINFO.plugin == 'undefined') {
            console.dir(JSINFO);
            return;
        }
        layoutdata = JSINFO.plugin.tablelayout[id];
        var $secedit_form = jQuery(element).siblings('.secedit').find('form div.no');
        var $input = jQuery('<input name="tablelayout" type="hidden">').val(JSON.stringify(layoutdata));
        $secedit_form.prepend($input);
        if (layoutdata) {
            tablelayout.applyStylesToTable($table, layoutdata);
        }

    });
});
