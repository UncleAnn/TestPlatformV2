# 产品版本关联接口测试集和UI自动化测试集
product_version = {
    'product': '深目',
    'version_list': ['2.4.2', '2.4.3']
}
version_suite = {
    'vs_id': 'vs_12312413241',
    'product': '深目',
    'version': '2.4.2',
    'api_suite': 'api_suite_12312413241',
    'ui_suite': 'ui_suite_12312413241',
    'perf_suite': 'perf_suite_12312413241'
}
api_info = {
    'product line': '公共安全产品线',
    'product': '深目',
    'version': '2.4.3-hotfix',

}


api_suite = {
    'suite_id': 'api_suite_12312413241',
    # 接口用例id组成的列表
    'case_list': [
        'api_case_12312413241',
        'api_case_12312413241',
        'api_case_12312413241'
    ]
}
ui_suite = {
    'suite_id': 'ui_suite_12312413241',
    # UI用例id组成的列表
    'case_list': [
        'ui_case_12312413241',
        'ui_case_12312413241',
        'ui_case_12312413241'
    ]
}
perf_suite = {
    'suite_id': 'perf_suite_12312413241',
    # 性能用例id组成的列表
    'case_list': [
        'perf_case_12312413241',
        'perf_case_12312413241',
        'perf_case_12312413241'
    ]
}
api_case = {
    'api_case_id': 'api_case_12312413241',
    'steps': [
        'api_id_12312413241',
        'api_id_12312413241',
        'api_id_12312413241'
    ]
}
keyword = {
    'kw_id': 'kw_id_12312413241',
    'name': '关键字',
    'code': '代码片段',
    'mock': {'data': {}}
}
ui_case = {
    'ui_case_id': 'ui_case_12312413241',
    'steps': [
        {
            'type': 'func',
            'op_list': [
                'op_12312413241',
                'op_12312413241',
                'op_12312413241'
            ]
        },
        {
            'type': 'op',
            'op_type': 'input',
            'locator': 'input#password',
            'data': '233sheying'
        }
    ]
}
# 性能用例暂定均由单接口完成
perf_case = {
    'perf_case_id': 'perf_case_12312413241',
    'info': {}
}
ui_func = {
    'func_id': 'func_id_12312413241',
    'op_list': [
        {
            'type': 'op',
            'op_type': 'input',
            'locator': 'input#password',
            'data': '233sheying'
        },
        {
            'type': 'op',
            'op_type': 'input',
            'locator': 'input#password',
            'data': '233sheying'
        },
        {
            'type': 'op',
            'op_type': 'input',
            'locator': 'input#password',
            'data': '233sheying'
        },
    ]
}
