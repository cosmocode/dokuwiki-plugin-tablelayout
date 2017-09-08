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

        if (layoutdata.tableSort) {
            var $tableSortRow, $rowsToBeSorted;
            if ($table.hasClass('tablelayout_body')) {
                $tableSortRow = $table.closest('.table').find('table.tablelayout_head tr').last();
                $rowsToBeSorted = $table.find('tr');
            } else {
                $tableSortRow = $table.find('tr').slice(layoutdata.rowsHeader - 1).first();
                $rowsToBeSorted = $table.find('tr').slice(layoutdata.rowsHeader);
            }
            var $tableSortRowCells = $tableSortRow.find('td,th');
            $tableSortRowCells.addClass('sortable unsorted');
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
