window.tablelayout = window.tablelayout || {};

jQuery(window).on('load', function(){
    'use strict';

    jQuery('.plugin_tablelayout_placeholder').each(function (index, element) {
        var $table = jQuery(element).next().find('table');
        var layoutdata = jQuery(element).data('tablelayout');

        var $secedit_form = jQuery(element).next().next('.secedit').find('form div.no');
        var $input = jQuery('<input name="tablelayout" type="hidden">').val(JSON.stringify(layoutdata));
        $secedit_form.prepend($input);
        if (layoutdata) {
            window.tablelayout.applyStylesToTable($table, layoutdata);
        }

        if (layoutdata.tableSortRow && layoutdata.tableSortRow > 0) {
            var $tableSortRowCells = $table.find('tr').slice(layoutdata.tableSortRow - 1).first().find('td,th');
            $tableSortRowCells.addClass('sortable unsorted');
            var $rowsToBeSorted = $table.find('tr').slice(layoutdata.tableSortRow);
            $tableSortRowCells.click(function () {
                var $this = jQuery(this);
                var sortDirection = $this.hasClass('sorted_asc') ? 'desc' : 'asc';
                $tableSortRowCells.removeClass('sorted_asc sorted_desc').addClass('unsorted');
                $this.addClass('sorted_' + sortDirection).removeClass('unsorted');
                var colIndex = 0;
                jQuery(this).prevAll('td,th').each(function () {
                    colIndex += this.colSpan;
                });
                var sortedRows = window.tablelayout.sortTable($rowsToBeSorted.detach(), colIndex, sortDirection);
                $table.append(sortedRows);
                return false;
            });
        }

    });
});
