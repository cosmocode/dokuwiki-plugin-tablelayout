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
    'use strict';
    if (!jQuery('#edittable__editor').length) {
        $btn.css('display', 'none');
        return '';
    }
    var pickerid = 'picker' + (pickercounter += 1);
    var $picker = jQuery(createPicker(pickerid, [], edid))
            .attr('aria-hidden', 'true')
            .addClass('plugin-tablelayout')
        ;

    // when the toolbar button is clicked
    $btn.click(
        function (e) {
            $picker.html('<div>' + LANG.plugins.magicmatcher.loading + '</div>');
            jQuery.post(
                DOKU_BASE + 'lib/exe/ajax.php',
                {
                    call: 'plugin_tablelayout_toolbar'
                }
            ).done(function (data) {
                $picker.html(data);
                var $layoutfield = jQuery('#dw__editform').find('input[name=tablelayout]');
                var layout = tablelayout.initLayout($layoutfield.val());
                if (layout.rowsFixed && layout.rowsVisible) {
                    $picker.find('input[name="rowsFixed"]').val(layout.rowsFixed);
                    $picker.find('input[name="rowsVisible"]').val(layout.rowsVisible);
                }
                if (layout.float) {
                    $picker.find('select[name="float"]').val(layout.float);
                }
                $picker.find('form').submit(function (event) {
                    event.preventDefault();
                    var layout = tablelayout.initLayout($layoutfield.val());
                    var rowsFixed = parseInt($picker.find('input[name="rowsFixed"]').val());
                    var rowsVisible = parseInt($picker.find('input[name="rowsVisible"]').val());
                    var float = $picker.find('select[name="float"]').val();
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
                    $layoutfield.val(JSON.stringify(layout));
                    jQuery('#dw__editform').find('button[name="do[preview]"]').click();
                });
            }).fail(function (jqXhr) {
                $picker.html(jqXhr.responseText);
            });

            // open/close the picker
            pickerToggle(pickerid, $btn);
            e.preventDefault();
            return '';
        }
    );

    return pickerid;
}

