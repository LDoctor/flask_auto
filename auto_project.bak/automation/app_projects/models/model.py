#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午1:50
# @Author  : nan
# @File    : model.py


import json

from app_projects.extensions import db


class ParamsData(db.Model):
    __tablename__ = 'params_data'
    __table_args__ = {"useexisting": True}
    id = db.Column(db.Integer, primary_key=True)
    keys = db.Column(db.String(100))
    values = db.Column(db.Text)

    def __repr__(self):
        return '<data %r>' % self.keys

    @classmethod
    def update_or_create(cls, key, data):
        resp = cls.query.filter_by(keys=key).first()
        if isinstance(data, dict):
            data = json.dumps(data)
        else:
            data = data
        if resp:
            resp.values = data
            db.session.commit()
        else:
            resp = cls(keys=key, values=data)
            db.session.add(resp)
            db.session.commit()

    @classmethod
    def get_params(cls, key, default=None):
        try:
            resp = cls.query.filter_by(keys=key).first()
            if resp:
                try:
                    return json.loads(resp.values)
                except:
                    return resp.values
            return {}
        except Exception as e:
            print(e)
            return '/mnt'


if __name__ == '__main__':
    db.create_all()
