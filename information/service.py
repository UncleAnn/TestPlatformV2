from common import MongoDB
from config import MONGODB


class Service:
    def __init__(self):
        self._mongo = MongoDB(MONGODB, 27017)
        self._mongo.switch_database_collection('information', 'version')

    def db_search(self, filter):
        return self._mongo.find_all(filter)

    def aggregate(self, pipeline):
        return self._mongo.aggregate(pipeline)