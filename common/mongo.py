from pymongo import MongoClient


class MongoDB:

    def __init__(self, host, port):
        self.__client = MongoClient(host, port)
        self.__db = self.__client.get_database('information')
        self.__coll = self.__db.get_collection('version')

    def switch_database_collection(self, db, coll):
        self.__db = self.__client.get_database(db)
        self.__coll = self.__db.get_collection(coll)

    def find_one(self, db, coll, filter):
        self.switch_database_collection(db, coll)
        return self.__coll.find_one(filter)

    def find_all(self, db, coll, filter):
        self.switch_database_collection(db, coll)
        return list(self.__coll.find(filter))

    def aggregate(self, db, coll, pipeline):
        self.switch_database_collection(db, coll)
        return list(self.__coll.aggregate(pipeline))


