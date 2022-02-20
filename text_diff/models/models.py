from odoo import models, fields, api
from odoo.exceptions import UserError


class LawTerm(models.Model):
    _name = 'text_diff.law_term'
    _description = '法律条款'
    _rec_name = "name"

    name = fields.Char()
    content = fields.Char('content')
    description = fields.Html()
    parent_id = fields.Many2one('text_diff.law_term', string='parent', copy=False)
    child_ids = fields.One2many('text_diff.law_term', 'parent_id', string='child')

    @api.constrains('child_ids')
    def _constrains_child_ids(self):
        for record in self:
            if len(record.child_ids) > 1:
                raise UserError('two childs!')

    def generate_other_version(self):
        self.ensure_one()
        new_record = self.copy()
        new_record.parent_id = self
        action_id = self.env.ref('text_diff.law_term_act')
        action_id['res_id'] = new_record.id
        return action_id
