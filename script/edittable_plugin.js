var edittable_plugins = edittable_plugins || {};
var tablelayout = tablelayout || {};

(function (edittable_plugins) {
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
            console.log('Set size of col ' + index + ' to ' + currentValue);
            colWidths[index] = parseInt(currentValue);
        });

        if (colWidths.length) {
            handsontable_config.manualColumnResize = colWidths;
        }

        if (layout.rowsFixed && layout.rowsVisible) {
            handsontable_config.fixedRowsTop = parseInt(layout.rowsFixed);
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
            originalBeforeRemoveCol.call(this, index, amount);
            layout.colwidth.splice(index, amount);
            $layoutfield.val(JSON.stringify(layout));
        };

        var originalAfterRemoveCol = handsontable_config.afterRemoveCol;
        handsontable_config.afterRemoveCol = function (index, amount) {
            originalAfterRemoveCol.call(this, index, amount);
            forcePreview = true;
        };

        var originalAfterCreateCol = handsontable_config.afterCreateCol;
        handsontable_config.afterCreateCol = function (index, amount) {
            originalAfterCreateCol.call(this, index, amount);
            layout.colwidth.splice(index, 0, null);
            $layoutfield.val(JSON.stringify(layout));
            forcePreview = true;
        };

        handsontable_config.afterRender = function () {
            if (forcePreview) {
                forcePreview = false;
                $form.find('button[name="do[preview]"]').click();
            }
        };

    };

    edittable_plugins.tablelayout = {modifyHandsontableConfig: modifyHandsontableConfig};
}(edittable_plugins));
