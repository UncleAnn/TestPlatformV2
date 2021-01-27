import MySQLdb

if __name__ == '__main__':
    # 连接数据库对象
    db = MySQLdb.connect(host='193.112.206.162', user='root', passwd='123456', charset='utf8', db='mysql')
    # 游标对象，用以执行SQL语句，增删改查都可以
    cs = db.cursor()
    # 执行语句并获取结果
    sql = "SELECT * FROM t_camera_info;"
    result = cs.execute(sql)
    # 取一行结果，在一次程序中多次执行是依次读取每一行的结果，可以配合for循环
    data_one = cs.fetchone()
    # 取所有结果，返回元组
    data_all = cs.fetchall()
    # 取指定行数
    n = 10
    data_n = cs.fetchall(n)

    # 关闭游标
    cs.close()
    # 断开数据库连接，脚本结束必须执行，不然会占用数据库连接池资源
    db.close()