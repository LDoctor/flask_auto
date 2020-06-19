#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-7-4 上午11:31
# @Author  : nan
# @File    : get_privkey.py

import os
import rsa
import base64

from app_projects.tools.file_path import PathDir, GetModel
from app_projects.models.model import ParamsData as model
from flask import current_app


def key_verify(message):
    # 数据库里面的私钥
    file_name = message[0: 117]
    privkey = rsa.PrivateKey.load_pkcs1(base64.b64decode(GetModel.get_privkey()))
    if os.path.exists(PathDir.prk(file_name)):
        with open(PathDir.prk(file_name), 'r') as f:
            crypto = f.read()
        privkey_message = ''
        if len(message) > 117:
            for i in crypto.split('---'):
                if i:
                    privkey_message += rsa.decrypt(i, privkey)
        else:
            privkey_message += rsa.decrypt(crypto, privkey)
        if privkey_message == message:
        # if message:
            return True
        # return True
        return False
    raise ValueError('u盘加密ID不存在')


if __name__ == '__main__':
    import rsa

    # 生成密钥
    (pubkey, privkey) = rsa.newkeys(1024)

    # 保存密钥
    # with open('public.pem', 'w+') as f:
    #     f.write(pubkey.save_pkcs1().decode())
    #
    # with open('private.pem', 'w+') as f:
    #     f.write(privkey.save_pkcs1().decode())

    # 导入密钥
    with open('public.pem', 'r') as f:
        pubkey = rsa.PublicKey.load_pkcs1(f.read().encode())

    with open('private.pem', 'r') as f:
        privkey = rsa.PrivateKey.load_pkcs1(f.read().encode())

    # 明文
    message = 'hello'

    # 公钥加密
    crypto = rsa.encrypt(message.encode(), pubkey)

    # 私钥解密
    message = rsa.decrypt(crypto, privkey).decode()
    print(message)

    # 私钥签名
    # signature = rsa.sign(message.encode(), privkey, 'SHA-1')

    # 公钥验证
    # rsa.verify(message.encode(), signature, pubkey)

