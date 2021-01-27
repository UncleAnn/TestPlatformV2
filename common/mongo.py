import re
from pymongo import MongoClient


class MongoDB:

    def __init__(self, host, port, db='information', coll='version'):
        self.__client = MongoClient(host, port)
        self.__db = self.__client.get_database(db)
        self.__coll = self.__db.get_collection(coll)

    def switch_database_collection(self, db, coll):
        self.__db = self.__client.get_database(db)
        self.__coll = self.__db.get_collection(coll)

    def find_one(self, filter_condition):
        return self.__coll.find_one(filter_condition)

    def find_all(self, filter_condition):
        return list(self.__coll.find(filter_condition))

    def insert_one(self, data):
        return self.__coll.insert_one(data)

    def update_one(self, query, data):
        result = self.__coll.update_one(query, {'$set': data})
        print(result)
        return result.modified_count

    def aggregate(self, pipeline):
        return list(self.__coll.aggregate(pipeline))

    def close(self):
        self.__client.close()

    def page_query(self, filter_condition=None, page_size=10, page_no=1):
        if filter_condition is None:
            filter_condition = {}
        skip = page_size * (page_no - 1)
        return list(self.__coll.find(filter_condition).limit(page_size).skip(skip))

    def delete(self, filter_condition):
        return self.__coll.delete_many(filter_condition)


if __name__ == '__main__':
    db = MongoDB('localhost', 27017, 'interface', 'api')
    # print(db.page_query(filter={'team': '公共安全产品线', 'product': '深目', 'version': '2.4.3-hotfix', 'title': re.compile(r'.*地域.*')}, page_no=1))
