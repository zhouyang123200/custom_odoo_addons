# -*- coding: utf-8 -*-

from odoo import models, fields, api


class LawTerm(models.Model):
    _name = 'text_diff.law_term'
    _description = '法律条款'

    name = fields.Char()
    description = fields.Html()

