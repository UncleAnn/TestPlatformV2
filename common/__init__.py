from uuid import uuid1
from time import strftime
from common.mongo import MongoDB


def generate_id():
    prefix = strftime('%Y%m%d%H%M%S')
    li = str(uuid1()).split('-')
    suffix = li[0] + li[3]
    return prefix + suffix


if __name__ == '__main__':
    print('vs_' + generate_id())
