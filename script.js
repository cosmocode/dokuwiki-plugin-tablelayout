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
        var numCols = tablelayout.getNumberOfTableCols($table);
        var $colgroup = jQuery('<colgroup>');
        layoutdata.colwidth.forEach(function (width, index) {
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
        if (layoutdata.colwidth.length == numCols) {
            // todo: should we throw an error if there are MORE widths defined than cols in the table?
            $table.css('min-width', 'unset');
            $table.css('width', 'unset');
        }
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
        if (layoutdata.colwidth.length) {
            tablelayout.applyStylesToTable($table, layoutdata);
        }

    });
});
