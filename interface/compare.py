class Compare:

    @staticmethod
    def equal(expected, actual):
        return actual == expected

    @staticmethod
    def not_equal(expected, actual):
        return expected != actual

    @staticmethod
    def greater_equal(actual, expected):
        return actual >= expected

    @staticmethod
    def greater(actual, expected):
        return actual > expected

    @staticmethod
    def lower_equal(actual, expected):
        return actual <= expected

    @staticmethod
    def lower(actual, expected):
        return actual < expected

    @staticmethod
    def contain(actual, expected):
        return expected in actual

    @staticmethod
    def not_contain(actual, expected):
        return expected not in actual


if __name__ == '__main__':
    c = Compare()
    func = getattr(c, 'not_contain')
    print(func('刘凯安', '冯淑贞'))
