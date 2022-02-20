odoo.define('text_diff.text_diff', function (require) {
    "use strict";

    var registry = require('web.field_registry');
    var FieldText = require('web.basic_fields').FieldText;
    var Diff = require('text-diff').Diff;
    console.log(Diff);

    var TextDiff = FieldText.extend({
        events: _.extend({}, FieldText.prototype.events, {
            'mouseover': '_onHover',
            'click button': 'initDiffFunc'
        }),

        _onHover: function (ev) {
            // console.log('hello world!!!');
        },

        start: function () {
            var self = this;
            this._super();
            var record_id = this.recordData.parent_id.res_id;
            if (record_id) {
                this._rpc({
                    model: 'text_diff.law_term',
                    method: 'search_read',
                    kwargs: {
                        domain: [['id', '=', record_id]],
                        fields: ['content']
                    }
                }).then(function (res) {
                    self.parent_content = res[0].content;
                })
            } else {
                self.parent_content = '';
            }

        },

        _renderReadonly: function () {
            var self = this;
            console.log(self);
            this._super();
            var modal_id = self.attrs.name + '_diff_modal';
            var $diffBtn = $(`<br><button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#${modal_id}">差异对比</button>`);
            var modal_body_id = modal_id + '_body';
            var modalTemp = `
                <div class="modal fade" id="${modal_id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">历史差异对比</h5>
                        </div>
                        <div class="modal-body" id="${modal_body_id}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
                </div>
            `;
            var $modal = $(modalTemp);
            self.$el.append($diffBtn);
            self.$el.append($modal);
        },

        initDiffFunc: function () {
            var self = this;
            var modalBodyId = self.attrs.name + '_diff_modal_body';
            var diff = new Diff();
            var content = self.recordData.content;
            var textDiff = diff.main(self.parent_content, content);
            var diffHtml = diff.prettyHtml(textDiff);
            var $body =$('#' + modalBodyId);
            $body.empty();
            $body.append($(diffHtml));
        }
    });

    registry
        .add('text_diff', TextDiff);
})