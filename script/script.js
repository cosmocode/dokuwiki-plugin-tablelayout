var tablelayout = tablelayout || {};

jQuery(window).load(function(){
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
