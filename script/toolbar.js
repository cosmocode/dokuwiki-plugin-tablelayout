/* exported addBtnActionPlugin_tablelayout */
var tablelayout = tablelayout || {};
/**
 * Attaches the mechanics on our plugin's button
 *
 * @param {jQuery} $btn the button itself
 * @param {object} props unused
 * @param {string} edid the editor's ID
 * @return {string}
 */
function addBtnActionPlugin_tablelayout($btn, props, edid) {
    "use strict";
    var pickerid = 'picker' + (pickercounter += 1);
    var $picker = jQuery(createPicker(pickerid, [], edid))
            .attr('aria-hidden', 'true')
            .addClass('plugin-tablelayout')
        ;

    // when the toolbar button is clicked
    $btn.click(
        function (e) {
            var $layoutfield = jQuery('#dw__editform').find('input[name=tablelayout]');
            var layout = tablelayout.initLayout($layoutfield.val());
            var $rowsFixedInput = jQuery('<input name="rowsFixed">').val(layout.rowsFixed);
            var $rowsFixedLabel = jQuery('<label>').append(jQuery('<span>').text(LANG.plugins.tablelayout['label:rowsFixed'])).append($rowsFixedInput);
            var $rowsVisibleInput = jQuery('<input name="rowsVisible">').val(layout.rowsVisible);
            var $rowsVisibleLabel = jQuery('<label>').append(jQuery('<span>').text(LANG.plugins.tablelayout['label:rowsVisible'])).append($rowsVisibleInput);
            var $applyButton = jQuery('<button type="submit">').text(LANG.plugins.tablelayout['button:apply']);
            var $layoutForm = jQuery('<form id="tablelayoutForm">');
            $layoutForm.submit(function (event) {
                event.preventDefault();
                var layout = tablelayout.initLayout($layoutfield.val());
                var rowsFixed = parseInt(jQuery('input[name="rowsFixed"]').val());
                var rowsVisible = parseInt(jQuery('input[name="rowsVisible"]').val());
                if (!(rowsFixed && rowsFixed > 0 && rowsVisible && rowsVisible > 0)) {
                    delete layout.rowsFixed;
                    delete layout.rowsVisible;
                } else {
                    layout.rowsFixed = rowsFixed;
                    layout.rowsVisible = rowsVisible;
                }
                $layoutfield.val(JSON.stringify(layout));
                jQuery('#dw__editform').find('button[name="do[preview]"]').click();
            });
            $layoutForm.append($rowsFixedLabel).append($rowsVisibleLabel).append($applyButton);
            $picker.html($layoutForm.wrap('<div>'));

            // open/close the picker
            pickerToggle(pickerid, $btn);
            e.preventDefault();
            return '';
        }
    );

    return pickerid;
}

jQuery(function () {
    "use strict";
    // add a new toolbar button, but first check if there is a toolbar
    if (typeof window.toolbar !== 'undefined' && jQuery('#edittable__editor').length) {
        window.toolbar[window.toolbar.length] = {
            type: "Plugin_tablelayout", // we have a new type that links to the function
            title: "Adjust table layout",
            icon: "../../plugins/edittable/images/add_table.png"
        };
    }
});

