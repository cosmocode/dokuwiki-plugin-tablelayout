window.tablelayout = window.tablelayout || {};

jQuery(window).on('load', function(){
    'use strict';

    jQuery('.plugin_tablelayout_placeholder').each(function (index, element) {
        var $table = jQuery(element).next().find('table');
        var layoutdata = jQuery(element).data('tablelayout');
        var columnCount = $table.find('tr').toArray().reduce(function (max, row){
            return Math.max(max, jQuery(row).find('td,th').length);
        } , 0);

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
                window.tablelayout.splitMerges($rowsToBeSorted);
                var $this = jQuery(this);
                var sortDirection = $this.hasClass('sorted_asc') ? 'desc' : 'asc';
                $tableSortRowCells.removeClass('sorted_asc sorted_desc').addClass('unsorted');
                $this.addClass('sorted_' + sortDirection).removeClass('unsorted');
                var colIndex = jQuery(this).prevAll('td,th').length;
                var sortedRows = window.tablelayout.sortTable($rowsToBeSorted.detach(), colIndex, sortDirection);
                $table.append(sortedRows);
                return false;
            });
        }

        if (layoutdata.tableSearch) {
            var $searchRow = jQuery('<tr class="searchRow">' + '<td><input></td>'.repeat(columnCount) + '</tr>');
            var $rowsToBeSearched, $lastHeaderRow;
            if ($table.hasClass('tablelayout_body')) {
                $lastHeaderRow = $table.closest('.table').find('table.tablelayout_head tr').last();
                $rowsToBeSearched = $table.find('tr');
            } else {
                $lastHeaderRow = $table.find('tr').slice(layoutdata.rowsHeader - 1).first();
                $rowsToBeSearched = $table.find('tr').slice(layoutdata.rowsHeader);
            }
            var $searchInputs = $searchRow.find('input');
            $searchInputs.on('input', function () {
                window.tablelayout.splitMerges($rowsToBeSearched);
                $rowsToBeSearched.each(function (index, row) {
                    var hideRow = jQuery(row).find('td,th').toArray().some(function (cell, index) {
                        var $this = jQuery(cell);
                        var cellText = $this.text().trim().toLowerCase();
                        var searchText = $searchInputs.eq(index).val().trim().toLowerCase();
                        return cellText.indexOf(searchText) === -1;
                    });
                    jQuery(row).css('display', hideRow ? 'none' : 'table-row');
                });
            });
            $lastHeaderRow.after($searchRow);
        }

    });
});
