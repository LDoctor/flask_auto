#!/usr/bin/env python
"""get/update Finder comment"""
import click
import xattr
import public

kMDItemFinderComment = "kMDItemFinderComment"


@public.add
def get(path):
    """return string with Finder comment"""
    try:
        comment = xattr.getxattr(path, kMDItemFinderComment)
        return comment.decode("utf-8")
    except OSError:
        pass


@public.add
def update(path, comment=None):
    """update Finder comment"""
    if comment is None:
        xattr.removexattr(path, kMDItemFinderComment)
        return
    old = get(path)
    if comment != old:
        if comment is not None and hasattr(comment, "encode"):
            comment = comment.encode("utf-8")  # str/bytes required
        xattr.setxattr(path, kMDItemFinderComment, comment)


MODULE_NAME = "mac_finder.comment"
PROG_NAME = 'python -m %s' % MODULE_NAME
USAGE = 'python -m %s path [comment]' % MODULE_NAME


@click.command()
@click.argument('path', required=True)
@click.argument('comment', required=False)
def _cli(path, comment=None):
    if comment is not None:
        return update(path, comment)
    comment = get(path)
    if comment:
        print(comment)


if __name__ == '__main__':
    _cli(prog_name=PROG_NAME)