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

        if (layoutdata.tableSort || layoutdata.tableSearch) {
            var searchSortRow = jQuery('<tr class="searchSortRow">' + '<th><div></div></th>'.repeat(columnCount) + '</tr>');
            var $lastHeaderRow;
            if ($table.hasClass('tablelayout_body')) {
                $lastHeaderRow = $table.closest('.table').find('table.tablelayout_head tr').last();
            }else {
                $lastHeaderRow = $table.find('tr').slice(layoutdata.rowsHeader - 1).first();
            }
            $lastHeaderRow.after(searchSortRow);
        }

        if (layoutdata.tableSort) {
            var $rowsToBeSorted;
            if ($table.hasClass('tablelayout_body')) {
                $rowsToBeSorted = $table.find('tr');
            } else {
                $rowsToBeSorted = $table.find('tr').slice(parseInt(layoutdata.rowsHeader)+1);
            }
            var $tableSortRowCells = searchSortRow.find('td > div,th > div');
            $tableSortRowCells.append(jQuery('<button>'));
            var $tableSortRowCellsButtons = $tableSortRowCells.find('button');
            $tableSortRowCellsButtons.addClass('sortable unsorted');
            $tableSortRowCellsButtons.click(function () {
                window.tablelayout.splitMerges($rowsToBeSorted);
                var $this = jQuery(this);
                var sortDirection = $this.hasClass('sorted_asc') ? 'desc' : 'asc';
                $tableSortRowCellsButtons.removeClass('sorted_asc sorted_desc').addClass('unsorted');
                $this.addClass('sorted_' + sortDirection).removeClass('unsorted');
                var colIndex = $this.closest('td,th').prevAll('td,th').length;
                var sortedRows = window.tablelayout.sortTable($rowsToBeSorted.detach(), colIndex, sortDirection);
                $table.append(sortedRows);
                return false;
            });
        }

        if (layoutdata.tableSearch) {
            var $rowsToBeSearched;
            if ($table.hasClass('tablelayout_body')) {
                $rowsToBeSearched = $table.find('tr');
            } else {
                $rowsToBeSearched = $table.find('tr').slice(parseInt(layoutdata.rowsHeader)+1);
            }

            searchSortRow.find('td > div,th > div').prepend(jQuery('<input>'));
            var $searchInputs = searchSortRow.find('input');
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
        }

    });
});
