#!/usr/bin/env python
"""update icon"""
import os
import click
import mac_finder

MODULE_NAME = "mac_finder.icon.update"
PROG_NAME = 'python -m %s' % MODULE_NAME
USAGE = "python -m %s path image" % MODULE_NAME


def _fullpath(path):
    return os.path.abspath(os.path.expanduser(path))


@click.command()
@click.argument('path', required=True)
@click.argument('image', required=True)
def _cli(path, image):
    mac_finder.icon.update(path, image)


if __name__ == '__main__':
    _cli(prog_name=PROG_NAME)
