var tablelayout = function () {
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
    return exports;
}();

jQuery(function(){
    'use strict';

    jQuery('.plugin_tablelayout_placeholder').each(function (index, element) {
        var id = jQuery(element).data('tablelayout');
        var $table = jQuery(element).next().find('table');

        if (typeof JSINFO.plugin == 'undefined') {
            console.dir(JSINFO);
            return;
        }

        var $secedit_form = jQuery(element).siblings('.secedit').find('form div.no');
        var $input = jQuery('<input name="tablelayout" type="hidden">').val(JSON.stringify(JSINFO.plugin.tablelayout[id]));
        $secedit_form.prepend($input);
        if (JSINFO.plugin.tablelayout[id].colwidth.length) {
            var numCols = tablelayout.getNumberOfTableCols($table);
            var $colgroup = jQuery('<colgroup>');
            JSINFO.plugin.tablelayout[id].colwidth.forEach(function (width) {
                var $col = jQuery('<col>');
                if (width != '-') {
                    $col.css('width', width);
                }
                $colgroup.append($col);
            });
            $table.prepend($colgroup);
            if (JSINFO.plugin.tablelayout[id].colwidth.length == numCols) {
                // todo: should we throw an error if there are MORE widths defined than cols in the table?
                $table.css('min-width', 'unset');
            }
        }

    });
});
