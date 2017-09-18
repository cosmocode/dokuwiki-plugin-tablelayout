window.edittable_plugins = window.edittable_plugins || {};
window.tablelayout = window.tablelayout || {};

(function (edittable_plugins, tablelayout) {
    'use strict';
    var modifyHandsontableConfig = function (handsontable_config, $form) {
        var $layoutfield = $form.find('input[name=tablelayout]');
        if (!$layoutfield.length) {
            return;
        }

        var colWidths = [];
        var layout = tablelayout.initLayout($layoutfield.val());
        layout.colwidth.forEach(function (currentValue, index) {
            var undefinedValue;
            if (!currentValue || currentValue.substr(-'px'.length) !== 'px') {
                colWidths.push(undefinedValue);
                return;
            }
            colWidths[index] = parseInt(currentValue);
        });

        if (colWidths.length) {
            handsontable_config.manualColumnResize = colWidths;
        }

        if (layout.rowsHeader && layout.rowsVisible) {
            handsontable_config.fixedRowsTop = parseInt(layout.rowsHeader);
        }

        handsontable_config.afterColumnResize = function (col, width) {
            if ($layoutfield) {
                layout.colwidth[col] = width + 'px';
                $layoutfield.val(JSON.stringify(layout));
            }
        };

        var forcePreview = false;
        var originalBeforeRemoveCol = handsontable_config.beforeRemoveCol;
        handsontable_config.beforeRemoveCol = function (index, amount) {
            if (originalBeforeRemoveCol) {
                originalBeforeRemoveCol.call(this, index, amount);
            }
            layout.colwidth.splice(index, amount);
            $layoutfield.val(JSON.stringify(layout));
        };

        var originalAfterRemoveCol = handsontable_config.afterRemoveCol;
        handsontable_config.afterRemoveCol = function (index, amount) {
            if (originalAfterRemoveCol) {
                originalAfterRemoveCol.call(this, index, amount);
            }
            forcePreview = true;
        };

        var originalAfterCreateCol = handsontable_config.afterCreateCol;
        handsontable_config.afterCreateCol = function (index, amount) {
            if (originalAfterCreateCol) {
                originalAfterCreateCol.call(this, index, amount);
            }
            layout.colwidth.splice(index, 0, null);
            $layoutfield.val(JSON.stringify(layout));
        };

        handsontable_config.afterRender = function () {
            if (forcePreview) {
                forcePreview = false;
                $form.find('button[name="do[preview]"]').click();
            }
        };

    };

    edittable_plugins.tablelayout = {modifyHandsontableConfig: modifyHandsontableConfig};
}(window.edittable_plugins, window.tablelayout));
