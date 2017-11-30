window.tablelayout = window.tablelayout || {};

jQuery(window).on('load', function () {
    'use strict';

    /**
     *
     * @param {jQuery} $secedit_form jQuery object of the section edit form associated with the table
     *
     * @return {void}
     */
    function addPrintButtonToTable($secedit_form) {
        var range = $secedit_form.find('input[name="range"]').val();
        var target = $secedit_form.closest('form').attr('action');
        var params = [
            'do=tablelayout_printtable',
            'range=' + encodeURIComponent(range),
            'id=' + encodeURIComponent(window.JSINFO.id)
        ];
        var href = target + '?' + params.join('&');
        var $link = jQuery('<a>' + window.LANG.plugins.tablelayout.print + '</a>').attr({
            'href': href,
            'target': '_blank'
        }).addClass('button print');
        $secedit_form.closest('div.secedit').append($link);
    }

    /**
     * Add a row for the search fields and filter buttons below the table header
     *
     * @param {JQuery} $table jQuery-object of the table
     * @param {int} numHeaderRows the number of rows in the header of the table
     * @param {int} columnCount the number of columns in the table
     * @return {JQuery} the searchSortRow object, that has been added to the table
     */
    function addSearchSortRow($table, numHeaderRows, columnCount) {
        var $searchSortRow = jQuery('<tr class="searchSortRow">' + '<th><div></div></th>'.repeat(columnCount) + '</tr>');
        var $lastHeaderRow;
        if ($table.hasClass('tablelayout_body')) {
            $lastHeaderRow = $table.closest('.table').find('table.tablelayout_head tr').last();
            $lastHeaderRow.after($searchSortRow);
        } else if(numHeaderRows === 0) {
            $table.find('tr').first().before($searchSortRow);
        } else {
            $lastHeaderRow = $table.find('tr').slice(numHeaderRows - 1).first();
            $lastHeaderRow.after($searchSortRow);
        }
        return $searchSortRow;
    }

    /**
     *
     * @param {JQuery} $table jQuery-object of the table
     * @param {JQuery} $searchSortRow the special row where the sort-buttons will be placed
     * @param {int} numHeaderRows the number of rows in the header of the table
     *
     * @return {void}
     */
    function addSortFunctionality($table, $searchSortRow, numHeaderRows) {
        var $rowsToBeSorted;
        if ($table.hasClass('tablelayout_body')) {
            $rowsToBeSorted = $table.find('tr');
        } else {
            $rowsToBeSorted = $table.find('tr').slice(parseInt(numHeaderRows) + 1);
        }
        var $tableSortRowCells = $searchSortRow.find('td > div,th > div');
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

    /**
     *
     * @param {JQuery} $table jQuery-object of the table
     * @param {JQuery} $searchSortRow the special row where the sort-buttons will be placed
     * @param {int} numHeaderRows the number of rows in the header of the table
     *
     * @return {void}
     */
    function addSearchFunctionality($table, $searchSortRow, numHeaderRows) {
        var $rowsToBeSearched;
        var $container = $searchSortRow.closest('.table');
        $container.addClass('hasSearch');
        if ($table.hasClass('tablelayout_body')) {
            $rowsToBeSearched = $table.find('tr');
        } else {
            $rowsToBeSearched = $table.find('tr').slice(parseInt(numHeaderRows) + 1);
        }

        $searchSortRow.find('td > div,th > div').prepend(jQuery('<input>'));
        var $globalSearch = jQuery('<div class="globalSearch"><label><span>' + window.LANG.plugins.tablelayout.search + '</span><input name="globalSearch" type="text"></label></div>');
        $container.prepend($globalSearch);
        var $searchInputs = $searchSortRow.find('input').add($globalSearch.find('input'));
        $searchInputs.on('input', function () {
            window.tablelayout.splitMerges($rowsToBeSearched);
            var globalSearchText = $globalSearch.find('input').val().trim().toLowerCase();
            $rowsToBeSearched.each(function (index, row) {
                var globalRowShow = false;
                var hideRow = jQuery(row).find('td,th').toArray().some(function (cell, index) {
                    var $this = jQuery(cell);
                    var cellText = $this.text().trim().toLowerCase();
                    globalRowShow = globalRowShow || (cellText.indexOf(globalSearchText) !== -1);
                    var colFilterIndex = index + 1;
                    var searchText = $searchInputs.eq(colFilterIndex).val().trim().toLowerCase();
                    return cellText.indexOf(searchText) === -1;
                });
                jQuery(row).css('display', (globalRowShow && !hideRow) ? 'table-row' : 'none');
            });
        });
    }

    /**
     *
     * @param {JQuery} $table jQuery-object of the table
     * @param {JQuery} $secedit_form the section edit form element for the table
     * @param {object} layoutdata the configuration object
     *
     * @return {void}
     */
    function applyFunctionalityToTable($table, $secedit_form, layoutdata) {
        if (layoutdata.tablePrint) {
            addPrintButtonToTable($secedit_form);
        }

        if (layoutdata.tableSort || layoutdata.tableSearch) {
            var columnCount = $table.find('tr').toArray().reduce(function (max, row) {
                return Math.max(max, jQuery(row).find('td,th').length);
            }, 0);
            var searchSortRow = addSearchSortRow($table, layoutdata.rowsHeader, columnCount);
        }

        if (layoutdata.tableSort) {
            addSortFunctionality($table, searchSortRow, layoutdata.rowsHeader);
        }

        if (layoutdata.tableSearch) {
            addSearchFunctionality($table, searchSortRow, layoutdata.rowsHeader)
        }
    }

    if (jQuery('#tablelayout_printthis').length) {
        window.print();
        return;
    }

    jQuery('.content .table').each(function (index, element) {
        var $table = jQuery(element).find('table');
        var layoutdata = jQuery(element).prev().data('tablelayout');
        if (typeof layoutdata === 'undefined') {
            var featureDefault = Boolean(window.JSINFO.plugins.tablelayout.features_active_by_default);
            layoutdata = {
                rowsHeaderSource: 'Auto',
                tableSearch: featureDefault,
                tableSort: featureDefault,
                tablePrint: featureDefault
            };
        }
        var numHeaderRowsAuto = $table.find('thead tr').length;
        layoutdata.rowsHeader = layoutdata.rowsHeaderSource === 'Auto' ? numHeaderRowsAuto : layoutdata.rowsHeaderSource;

        var $secedit_form = jQuery(element).next('.secedit').find('form div.no');
        var $input = jQuery('<input name="tablelayout" type="hidden">').val(JSON.stringify(layoutdata));
        $secedit_form.prepend($input);
        if (layoutdata.colwidth || layoutdata.rowsVisible) {
            window.tablelayout.applyStylesToTable($table, layoutdata);
        }
        applyFunctionalityToTable($table, $secedit_form, layoutdata)

    });
});
