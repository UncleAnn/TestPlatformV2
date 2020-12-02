function addHeaderLine(form) {
    $('#add-header').on('click', function () {
        let html = '';
        html += '<div class="layui-form-item header-line">' +
            '       <div class="layui-inline">' +
            '           <input type="checkbox" lay-skin="switch" class="header-switch" checked>' +
            '       </div>' +
            '       <div class="layui-inline" style="width: 400px">' +
            '           <input type="text" class="layui-input header-key" placeholder="请输入header key">' +
            '       </div>' +
            '       <div class="layui-inline" style="width: 400px">' +
            '           <input type="text" class="layui-input header-value" placeholder="请输入header value">' +
            '       </div>' +
            '       <div class="layui-inline">' +
            '           <a href="javascript:">\n' +
            '               <i class="layui-icon del-header" style="font-size: 30px; color: #FF5722;">&#x1007</i>\n' +
            '           </a>' +
            '       </div>' +
            '   </div>';
        let dom = $('#headers');
        dom.append(html);
        form.render();
        let flag = dom.hasClass('layui-show');
        if (!flag) {
            $('h2').eq(0).click();
        }
    })
}

function getHeaderInfo() {
    let headers = {};
    let dom = $('.header-line');

    dom.each(function (index, element) {
        // 判断是否启用
        if ($('.header-switch').eq(index).attr('checked')) {
            // 判断key是否为空
            let key = $('.header-key').eq(index).val();
            if (key !== '') {
                headers[key] = $('.header-value').eq(index).val();
            }
        }
    });
    return headers;
}

function delHeaderLine() {
    $('#headers').on('click', '.del-header', function () {
        let i = $('.del-header').index($(this));
        $('.header-line').eq(i).remove();
    })
}

function addParamLine(form) {
    $('#add-param').on('click', function () {
        let html = '';
        html += '<div class="layui-form-item param-line">\n' +
            '    <div class="layui-inline">\n' +
            '        <input type="checkbox" lay-skin="switch" class="param-switch" checked>\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 80px">\n' +
            '        <select name="param-type" class="param-type" lay-filter="param-type">\n' +
            '            <option value="param" selected>参数</option>\n' +
            '            <option value="file">文件</option>\n' +
            '        </select>\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 400px">\n' +
            '        <input type="text" class="layui-input param-key" placeholder="请输入parameter key">\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 400px">\n' +
            '        <input type="text" class="layui-input param-value" placeholder="请输入parameter value">\n' +
            '    </div>\n' +
            '    <div class="layui-inline">\n' +
            '        <a href="javascript:"><i class="layui-icon del-param">&#x1007</i></a>\n' +
            '    </div>\n' +
            '</div>';
        let dom = $('#parameters');
        dom.append(html);
        form.render();
        let flag = dom.hasClass('layui-show');
        if (!flag) {
            $('h2').eq(1).click();
        }

    })
}

function getParamInfo() {
    let params = {};
    let dom = $('.param-line');

    dom.each(function (index, element) {
        if ($('.param-switch').eq(index).attr('checked')) {
            if ($('.param-type').eq(index).val() === "param") {
                let key = $('.param-key').eq(index).val();
                if (key !== "") {
                    params[key] = $('.param-value').eq(index).val()
                }
            }
        }
    });
    return params;
}

function delParamLine() {
    $('#parameters').on('click', '.del-param', function () {
        let i = $('.del-param').index($(this));
        $('.param-line').eq(i).remove();
    })
}

function addAssertLine(form) {
    $('#add-assert').on('click', function () {
        let html = '';
        html += '<div class="layui-form-item assert-line">\n' +
            '    <div class="layui-inline">\n' +
            '        <input type="checkbox" lay-skin="switch" class="assert-switch" checked>\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 100px">\n' +
            '        <select name="assert-type" class="assert-type" lay-filter="assert-type">\n' +
            '            <option value="status_code">状态码</option>\n' +
            '            <option value="response_body" selected>响应体</option>\n' +
            '        </select>\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 300px">\n' +
            '        <input type="text" class="layui-input assert-expr" lay-verify="required"\n' +
            '               placeholder="请输入断言表达式">\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 100px">\n' +
            '        <select name="assert-type" class="assert-condition">\n' +
            '            <option value="equal" selected>==</option>\n' +
            '            <option value="not_equal">!=</option>\n' +
            '            <option value="greater_equal">>=</option>\n' +
            '            <option value="lower_equal"><=</option>\n' +
            '            <option value="greater">></option>\n' +
            '            <option value="lower"><</option>\n' +
            '            <option value="contain">包含</option>\n' +
            '            <option value="not_contain">不包含</option>\n' +
            '        </select>\n' +
            '    </div>\n' +
            '    <div class="layui-inline" style="width: 200px">\n' +
            '        <input type="text" class="layui-input assert-value" lay-verify="required"\n' +
            '               placeholder="请输入预期值">\n' +
            '    </div>\n' +
            '    <div class="layui-inline">\n' +
            '        <a href="javascript:"><i class="layui-icon del-assert">&#x1007</i></a>\n' +
            '    </div>\n' +
            '    <div class="layui-inline result" style="display:none"></div>' +
            '</div>';
        let dom = $('#assert');
        dom.append(html);
        form.render();
        let flag = dom.hasClass('layui-show');
        if (!flag) {
            $('h2').eq(2).click();
        }
    })
}

function switchAssertType(form) {
    form.on('select(assert-type)', function (data) {
        // 通过index定位要修改的assert行
        let i = $('.assert-type').index(data.elem);
        let dom = $('.assert-expr').eq(i);
        if (data.value === "response-body") {
            dom.attr('placeholder', '请输入断言表达式');
            dom.removeAttr('disabled')
        } else {
            dom.attr('placeholder', '断言状态码无需表达式');
            dom.attr('disabled', true)
        }
    });
}

function getAssertInfo() {
    let assert = [];
    let dom = $('.assert-line');

    dom.each(function (index, element) {
        if ($('.assert-switch').eq(index).attr('checked')) {
            let expr = $('.assert-expr').eq(index).val();
            let type = $('.assert-type').eq(index).val();
            if (type === 'status_code' || (type === 'response_body' && expr !== '')) {
                let assert_item = {
                    'type': type,
                    'condition': $('.assert-condition').eq(index).val(),
                    'value': $('.assert-value').eq(index).val()
                };
                if (type === 'response_body') {
                    assert_item['expr'] = expr
                }
                assert.push(assert_item);
            }
        }
    });
    return assert;
}

function delAssertLine() {
    $('#assert').on('click', '.del-assert', function () {
        let i = $('.del-assert').index($(this));
        $('.assert-line').eq(i).remove();
    })
}

function addExtractLine(form) {
    $('#add-extract').on('click', function () {
        let html = '';
        html += '<div class="layui-form-item extract-line">\n' +
                '    <div class="layui-inline">\n' +
                '        <input type="checkbox" class="extract-switch" lay-skin="switch" checked>\n' +
                '    </div>\n' +
                '    <div class="layui-inline" style="width: 400px">\n' +
                '        <input type="text" class="layui-input extract-name" layui-verify="required"\n' +
                '               placeholder="请输入变量名">\n' +
                '    </div>\n' +
                '    <div class="layui-inline" style="width: 400px">\n' +
                '        <input type="text" class="layui-input extract-expr" layui-verify="required"\n' +
                '               placeholder="请输入变量提取表达式">\n' +
                '    </div>\n' +
                '    <div class="layui-inline">\n' +
                '        <a href="javascript:"><i class="layui-icon del-extract">&#x1007</i></a>\n' +
                '    </div>\n' +
                '</div>';
        let dom = $('#extract');
        dom.append(html);
        form.render();
        let flag = dom.hasClass('layui-show');
        if (!flag) {
            $('h2').eq(3).click();
        }
    })
}

function getExtractInfo() {
    let extract = [];
    let dom = $('.extract-line');

    dom.each(function (index, element) {
        if ($('.extract-switch').eq(index).attr('checked')) {
            let name = $('.extract-name').eq(index).val();
            if (name !== '') {
                let extract_item = {
                    'name': name,
                    'expression': $('.extract-expr').eq(index).val()
                };
                extract.push(extract_item);
            }
        }
    });
    return extract
}

function delExtractLine() {
    $('#extract').on('click', '.del-extract', function () {
        let i = $('.del-extract').index($(this));
        $('.extract-line').eq(i).remove();
    })
}

function send() {
    $('#send').on('click', function () {
        // 获取基础数据
        let data = {
            'team': $('#team').val(),
            'product': $('#product').val(),
            'version': $('#version').val(),
            'title': $('#title').val()
        };
        let url = $('#url').val();
        if (url === '') {
            layer.msg('请输入请求地址！');
            return
        }
        // 获取请求参数详情
        data['url'] = url;
        data['method'] = $('#method').val();
        data['headers'] = getHeaderInfo();
        data['params'] = getParamInfo();
        data['assert'] = getAssertInfo();
        data['extract'] = getExtractInfo();
        // 发送请求
        http('/interface/api/v1/send_request', 'post', data, function (response) {
            layer.msg(response['message']);
            // 显示接口测试响应数据
            let responseHtml = '<pre><code>' +
                JSON.stringify(response['data']['response']['data'], null, 4) +
                '</code></pre>';
            $('#response').html(responseHtml);
            // 标记断言结果
            let dom = $('.result');
            dom.each(function (index, element) {
                let resultHtml = '<label class="layui-form-label">测试结果：</label>';
                if (response['data']['assert'][index]['result']) {
                    resultHtml += '<i class="layui-icon layui-icon-ok" style="color:#5FB878"></i>';
                } else {
                    resultHtml += '<i class="layui-icon layui-icon-close" style="color:#FF5722"></i>'
                }
                dom.eq(index).html(resultHtml);
            });
            dom.show();
        }, function (response) {
            console.log(response);
            layer.msg(response['message'])
        });
    })
}

function save() {
    $('#send').on('click', function () {
        // 获取基础数据
        let data = {
            'team': $('#team').val(),
            'product': $('#product').val(),
            'version': $('#version').val(),
            'title': $('#title').val()
        };
        let url = $('#url').val();
        if (url === '') {
            layer.msg('请输入请求地址！');
            return
        }
        // 获取请求参数详情
        data['url'] = url;
        data['method'] = $('#method').val();
        data['headers'] = getHeaderInfo();
        data['params'] = getParamInfo();
        data['assert'] = getAssertInfo();
        data['extract'] = getExtractInfo();
        // 发送请求
        http('/interface/save_request', 'post', data, function (response) {
            console.log(response);
            layer.msg(response['message'])
        }, function (response) {
            console.log(response);
            layer.msg(response['message'])
        });
    })
}
