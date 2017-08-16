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
        if (layout.rowsFixed && layout.rowsVisible) {
            $layoutcontainer.find('input[name="rowsFixed"]').val(layout.rowsFixed);
            $layoutcontainer.find('input[name="rowsVisible"]').val(layout.rowsVisible);
        }
        if (layout.float) {
            $layoutcontainer.find('select[name="float"]').val(layout.float);
        }
        if (typeof layout.tableSortRow !== 'undefined') {
            $layoutcontainer.find('input[name="tableSortRow"]').val(layout.tableSortRow);
        }
        $layoutcontainer.find('form').submit(function (event) {
            event.preventDefault();
            var layout = window.tablelayout.initLayout($layoutfield.val());

            // validation
            var rowsFixed = parseInt($layoutcontainer.find('input[name="rowsFixed"]').val());
            var rowsVisible = parseInt($layoutcontainer.find('input[name="rowsVisible"]').val());
            var float = $layoutcontainer.find('select[name="float"]').val();
            if (!(rowsFixed && rowsFixed > 0 && rowsVisible && rowsVisible > 0)) {
                delete layout.rowsFixed;
                delete layout.rowsVisible;
            } else {
                layout.rowsFixed = rowsFixed;
                layout.rowsVisible = rowsVisible;
            }
            if (float && (float === 'left' || float === 'right' || float === 'center')) {
                layout.float = float;
            } else {
                delete layout.float;
            }
            var tableSortRow = parseInt($layoutcontainer.find('input[name="tableSortRow"]').val());
            layout.tableSortRow = tableSortRow;

            $layoutfield.val(JSON.stringify(layout));
            jQuery('#dw__editform').find('button[name="do[preview]"]').click();
        });
    }).fail(function (jqXhr) {
        $layoutcontainer.html(jqXhr.responseText);
    });
});

