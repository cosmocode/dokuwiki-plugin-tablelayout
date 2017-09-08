window.tablelayout = window.tablelayout || {};

jQuery(function () {
    'use strict';
    if (!jQuery('#edittable__editor').length) {
        return;
    }
    jQuery('#dw__editform').before('<div id="layoutcontainer">' + LANG.plugins.tablelayout.loading + '</div>');
    var $layoutcontainer = jQuery('#layoutcontainer');
    jQuery.get(
        DOKU_BASE + 'lib/exe/ajax.php',
        {
            call: 'plugin_tablelayout_form'
        }
    ).done(function (data) {
        $layoutcontainer.html(data);
        $layoutcontainer.find('fieldset legend').click(function () {
            $layoutcontainer.find('fieldset').toggleClass('borderless');
            $layoutcontainer.find('fieldset > div').slideToggle();
        });
        var $layoutfield = jQuery('#dw__editform').find('input[name=tablelayout]');
        var layout = window.tablelayout.initLayout($layoutfield.val());
        $layoutcontainer.find('input[name="rowsHeader"]').val(layout.rowsHeader || 0);
        if (layout.rowsHeader && layout.rowsVisible) {
            $layoutcontainer.find('input[name="rowsVisible"]').val(layout.rowsVisible);
        }
        if (layout.float) {
            $layoutcontainer.find('select[name="float"]').val(layout.float);
        }
        if (typeof layout.tableSort !== 'undefined' && layout.tableSort === true) {
            $layoutcontainer.find('input[name="tableSort"]').attr('checked', true);
        }
        if (typeof layout.tableSort !== 'undefined' && layout.tableSearch === true) {
            $layoutcontainer.find('input[name="tableSearch"]').attr('checked', true);
        }
        $layoutcontainer.find('form').submit(function (event) {
            event.preventDefault();
            var layout = window.tablelayout.initLayout($layoutfield.val());

            // validation
            var rowsHeader = parseInt($layoutcontainer.find('input[name="rowsHeader"]').val());
            var rowsVisible = parseInt($layoutcontainer.find('input[name="rowsVisible"]').val());
            var float = $layoutcontainer.find('select[name="float"]').val();
            if (!rowsHeader || rowsHeader < 1) {
                layout.rowsHeader = 1;
            } else {
                layout.rowsHeader = rowsHeader;
            }
            if (!(rowsVisible && rowsVisible > 0)) {
                delete layout.rowsVisible;
            } else {
                layout.rowsVisible = rowsVisible;
            }
            if (float && (float === 'left' || float === 'right' || float === 'center')) {
                layout.float = float;
            } else {
                delete layout.float;
            }
            var tableSort = $layoutcontainer.find('input[name="tableSort"]').is(':checked');
            layout.tableSort = tableSort;
            var tableSearch = $layoutcontainer.find('input[name="tableSearch"]').is(':checked');
            layout.tableSearch = tableSearch;

            $layoutfield.val(JSON.stringify(layout));
            jQuery('#dw__editform').find('button[name="do[preview]"]').click();
        });
    }).fail(function (jqXhr) {
        $layoutcontainer.html(jqXhr.responseText);
    });
});

