function renderTeam(form) {
    let teamData = httpWithReturn('/information/team', 'get', {});
    let html = '';
    for (let i in teamData) {
        if (teamData.hasOwnProperty(i)) {
            let team = teamData[i];
            html += `<option value="${team}">${team}</option>`;
        }
    }
    $('#team').html(html);
    form.render();
    return teamData;
}

function renderProduct(args, form) {
    let productData = httpWithReturn('/information/product', 'get', args);
    let html = '';
    for (let i in productData) {
        if (productData.hasOwnProperty(i)) {
            let product = productData[i];
            html += `<option value="${product}">${product}</option>`;
        }
    }
    let productDom = $('#product');
    productDom.html(html);
    args['product'] = productDom.val();
    // 必须加入版本渲染
    renderVersion(args, form);
    return productData;
}

function renderVersion(args, form) {
    let versionData = httpWithReturn('/information/version', 'get', args);
    let html = '';
    for (let i in versionData) {
        if (versionData.hasOwnProperty(i)) {
            let version = versionData[i];
            html += `<option value="${version}">${version}</option>`;
        }
    }
    $('#version').html(html);
    form.render();
    return versionData;
}

function load_version_select(form) {
    // 初始化部门
    let teamData = renderTeam(form);
    form.val('form', {'team': teamData[0]});
    // 渲染产品select
    let args = {'team': $('#team').val()};
    // args为{'team': teamDom.val()}，且必须通过参数传入
    let productData = renderProduct(args, form);
    form.val('form', {'product': productData[0]});
    args['product'] = $('#product').val();
    // 拼接版本号
    let versionData = renderVersion(args, form);
    form.val('form', {'version': versionData[0]});
    return {
        'team': teamData[0],
        'product': productData[0],
        'version': versionData[0]
    };
}

function load_interface(form) {
    // 请求api信息并加载到页面
    let api_info = getInterfaceInfo();
    // 初始化部门、产品、版本号
    // 拼出所有的部门
    renderTeam(form);
    // 选中部门
    form.val('form', {'team': api_info['team']});
    // 渲染产品select
    let args = {'team': $('#team').val()};
    // args为{'team': teamDom.val()}，且必须通过参数传入
    renderProduct(args, form);
    form.val('form', {'product': api_info['product']});
    args['product'] = $('#product').val();
    // 渲染版本号select
    renderVersion(args, form);
    form.val('form', {
        'version': api_info['version'],
        'title': api_info['title'],
        'method': api_info['method'],
        'url': api_info['url']
    });
    console.log(api_info);
    loadHeaders(api_info['headers'], form);
    loadParams(api_info['params'], form);
    loadAssert(api_info['assert'], form);
    loadExtract(api_info['extract'], form);
}

function listenTeam(form) {
    form.on('select(team)', function (data) {
        let args = {'team': data.value};
        renderProduct(args, form);
    });
}

function listenProduct(form) {
    form.on('select(product)', function (data) {
        let args = {
            'team': $('#team').val(),
            'product': data.value
        };
        console.log(args);
        renderVersion(args, form);
    });
}

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
    });
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

function loadHeaders(headers, form) {
    if (Object.keys(headers).length > 0) {
        // 补齐headers行数
        let html = '';
        let dom = $('#headers');
        for (let i = 1; i < Object.keys(headers).length; i++) {
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
                '           <a href="javascript:">' +
                '               <i class="layui-icon del-header" style="font-size: 30px; color: #FF5722;">&#x1007</i>' +
                '           </a>' +
                '       </div>' +
                '   </div>';
        }
        dom.append(html);
        form.render();
        // 加载headers信息
        let i = 0;
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                $('.header-key').eq(i).val(key);
                $('.header-value').eq(i).val(headers[key]);
            }
            i++;
        }
        $('h2').eq(0).click();
    }
}

function delHeaderLine() {
    $('#headers').on('click', '.del-header', function () {
        let i = $('.del-header').index($(this));
        $('.header-line').eq(i).remove();
    });
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

    });
}

function getParamInfo() {
    let params = {};
    let dom = $('.param-line');

    dom.each(function (index, element) {
        if ($('.param-switch').eq(index).attr('checked')) {
            if ($('.param-type').eq(index).val() === "param") {
                let key = $('.param-key').eq(index).val();
                if (key !== "") {
                    params[key] = $('.param-value').eq(index).val();
                }
            }
        }
    });
    return params;
}

function loadParams(params, form) {
    if (Object.keys(params).length > 0) {
        // 补齐params行数
        let dom = $('#parameters');
        let html = '';
        for (let i = 1; i < Object.keys(params).length; i++) {
            html += '<div class="layui-form-item param-line">' +
                '    <div class="layui-inline">' +
                '        <input type="checkbox" lay-skin="switch" class="param-switch" checked>' +
                '    </div>\n' +
                '    <div class="layui-inline" style="width: 80px">' +
                '        <select name="param-type" class="param-type" lay-filter="param-type">' +
                '            <option value="param" selected>参数</option>' +
                '            <option value="file">文件</option>' +
                '        </select>\n' +
                '    </div>\n' +
                '    <div class="layui-inline" style="width: 400px">' +
                '        <input type="text" class="layui-input param-key" placeholder="请输入parameter key">' +
                '    </div>\n' +
                '    <div class="layui-inline" style="width: 400px">\n' +
                '        <input type="text" class="layui-input param-value" placeholder="请输入parameter value">' +
                '    </div>\n' +
                '    <div class="layui-inline">\n' +
                '        <a href="javascript:"><i class="layui-icon del-param">&#x1007</i></a>' +
                '    </div>\n' +
                '</div>';
        }
        dom.append(html);
        form.render();
        // 加载 params 信息
        let i = 0;
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                $('.param-key').eq(i).val(key);
                $('.param-value').eq(i).val(params[key]);
            }
            i++;
        }
        // let flag = dom.hasClass('layui-show');
        // if (!flag) {
        $('h2').eq(1).click();
        // }
    }
}

function delParamLine() {
    $('#parameters').on('click', '.del-param', function () {
        let i = $('.del-param').index($(this));
        $('.param-line').eq(i).remove();
    });
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
    });
}

function switchAssertType(form) {
    form.on('select(assert-type)', function (data) {
        // 通过index定位要修改的assert行
        let i = $('.assert-type').index(data.elem);
        let dom = $('.assert-expr').eq(i);
        if (data.value === "response-body") {
            dom.attr('placeholder', '请输入断言表达式');
            dom.removeAttr('disabled');
        } else {
            dom.attr('placeholder', '断言状态码无需表达式');
            dom.attr('disabled', true);
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
                    assert_item['expr'] = expr;
                }
                assert.push(assert_item);
            }
        }
    });
    return assert;
}

function loadAssert(assert, form) {
    if (Object.keys(assert).length > 0) {
        //补齐assert行数
        let dom = $('#assert');
        let html = '';
        for (let i = 1; i < Object.keys(assert).length; i++) {
            html += '<div class="layui-form-item assert-line">\n' +
                '       <div class="layui-inline">\n' +
                '           <input type="checkbox" lay-skin="switch" class="assert-switch" checked>\n' +
                '       </div>\n' +
                '       <div class="layui-inline" style="width: 100px">\n' +
                '           <select name="assert-type" class="assert-type" lay-filter="assert-type">\n' +
                '               <option value="status_code">状态码</option>\n' +
                '               <option value="response_body" selected>响应体</option>\n' +
                '           </select>\n' +
                '       </div>\n' +
                '       <div class="layui-inline" style="width: 300px">\n' +
                '           <input type="text" class="layui-input assert-expr" lay-verify="required"\n' +
                '               placeholder="请输入断言表达式">\n' +
                '       </div>\n' +
                '       <div class="layui-inline" style="width: 100px">\n' +
                '           <select name="assert-type" class="assert-condition">\n' +
                '               <option value="equal" selected>==</option>\n' +
                '               <option value="not_equal">!=</option>\n' +
                '               <option value="greater_equal">>=</option>\n' +
                '               <option value="lower_equal"><=</option>\n' +
                '               <option value="greater">></option>\n' +
                '               <option value="lower"><</option>\n' +
                '               <option value="contain">包含</option>\n' +
                '               <option value="not_contain">不包含</option>\n' +
                '           </select>\n' +
                '       </div>\n' +
                '       <div class="layui-inline" style="width: 200px">\n' +
                '           <input type="text" class="layui-input assert-value" lay-verify="required"\n' +
                '               placeholder="请输入预期值">\n' +
                '       </div>\n' +
                '       <div class="layui-inline">\n' +
                '           <a href="javascript:"><i class="layui-icon del-assert">&#x1007</i></a>\n' +
                '       </div>\n' +
                '       <div class="layui-inline result" style="display:none"></div>' +
                '   </div>';
        }
        dom.append(html);
        form.render();
        // 加载assert信息
        $('.assert-line').each(function (index, element) {
            $('.assert-type').eq(index).val(assert[index]['type']);
            if (assert[index]['type'] === 'response_body') {
                $('.assert-expr').eq(index).val(assert[index]['expr']);
            }
            $('.assert-condition').val(assert[index]['condition']);
            $('.assert-value').val(assert[index]['value']);
        });
        $('h2').eq(2).click();
        form.render();
    }
}

function delAssertLine() {
    $('#assert').on('click', '.del-assert', function () {
        let i = $('.del-assert').index($(this));
        $('.assert-line').eq(i).remove();
    });
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
    });
}

function getExtractInfo() {
    let extract = {};
    let dom = $('.extract-line');

    dom.each(function (index, element) {
        if ($('.extract-switch').eq(index).attr('checked')) {
            let key = $('.extract-key').eq(index).val();
            if (key !== '') {
                extract[key] = $('.extract-expr').eq(index).val();
            }
        }
    });
    console.log(extract);
    return extract;
}

function loadExtract(extract, form) {
    console.log(extract);
    if (extract.length > 0) {
        // 补齐extract行数
        let dom = $('#extract');
        let html = '';
        for (let i = 1; i < Object.keys(extract).length; i++) {
            html += '<div class="layui-form-item extract-line">' +
                '    <div class="layui-inline">' +
                '        <input type="checkbox" class="extract-switch" lay-skin="switch" checked>' +
                '    </div>' +
                '    <div class="layui-inline" style="width: 400px">' +
                '        <input type="text" class="layui-input extract-key" layui-verify="required"' +
                '               placeholder="请输入变量名">' +
                '    </div>' +
                '    <div class="layui-inline" style="width: 400px">' +
                '        <input type="text" class="layui-input extract-expr" layui-verify="required"' +
                '               placeholder="请输入变量提取表达式">' +
                '    </div>' +
                '    <div class="layui-inline">' +
                '        <a href="javascript:"><i class="layui-icon del-extract">&#x1007</i></a>' +
                '    </div>' +
                '</div>';
        }
        dom.append(html);
        form.render();
        // 加载extract信息
        let i = 0;
        for (let key in extract) {
            if (extract.hasOwnProperty(key)) {
                $('.extract-key').eq(i).val(key);
                $('.extract-expr').eq(i).val(extract[key]);
            }
            i++;
        }
        $('h2').eq(3).click();

    }


}

function delExtractLine() {
    $('#extract').on('click', '.del-extract', function () {
        let i = $('.del-extract').index($(this));
        $('.extract-line').eq(i).remove();
    });
}

function getAllInfo() {
    // 获取基础数据
    let data = {
        'team': $('#team').val(),
        'product': $('#product').val(),
        'version': $('#version').val(),
        'title': $('#title').val(),
        'url': $('#url').val()
    };
    // 获取请求参数详情
    data['method'] = $('#method').val();
    data['headers'] = getHeaderInfo();
    data['params'] = getParamInfo();
    data['assert'] = getAssertInfo();
    data['extract'] = getExtractInfo();
    // return
    return data;
}

function send() {
    $('#send').on('click', function () {
        if ($('#url').val() === '') {
            layer.msg('请输入【请求地址】！');
            return;
        }
        let data = getAllInfo();
        // 发送请求
        http('/interface/api/v1/send_request', 'post', data, function (response) {
            layer.msg(response['message']);
            // 显示接口测试响应数据
            let responseHtml = '<pre><code>' +
                JSON.stringify(response['data']['response']['data'], null, 4) +
                '</code></pre>';
            $('#response').html(responseHtml);
            // 标记断言结果
            if (response['data']['assert'].length !== 0) {
                let dom = $('.result');
                dom.empty();
                dom.each(function (index, element) {
                    let resultHtml = '<label class="layui-form-label">测试结果：</label>';
                    if (response['data']['assert'][index]['result']) {
                        resultHtml += '<i class="layui-icon layui-icon-ok" style="color:#5FB878"></i>';
                    } else {
                        resultHtml += '<i class="layui-icon layui-icon-close" style="color:#FF5722"></i>';
                    }
                    dom.eq(index).html(resultHtml);
                });
                dom.show();
            }
        }, function (response) {
            console.log(response);
            layer.msg(response['message']);
        });
    });
}

function getInterfaceId() {
    // 从url获取要读取的api id
    let path = window.location.pathname;
    let pathNameList = path.split('/');
    return pathNameList[pathNameList.length - 1];
}

function update(layer) {
    $('#save').on('click', function () {
        let title = $('#title').val();
        if (title === '') {
            layer.msg('');
        }
        let data = getAllInfo();
        data['_id'] = getInterfaceId();
        // 发送请求
        http('/interface/api/v2/update', 'post', data, function (response) {
            console.log(response);
            layer.msg(response['message']);
        }, function (response) {
            console.log(response);
            layer.msg(response['message']);
        });
    });
}

function getInterfaceInfo() {
    let id = getInterfaceId();
    return httpWithReturn('/interface/api/v2/load_api', 'post', {'_id': id});
}

function common_page(form, layer) {
    // 监听team、product下拉框
    listenTeam(form);
    listenProduct(form);
    // 元素操作部分
    switchAssertType(form);
    addHeaderLine(form);
    delHeaderLine();
    addParamLine(form);
    delParamLine();
    addAssertLine(form);
    delAssertLine();
    addExtractLine(form);
    delExtractLine();
    // 数据交互部分
    send(layer);
}

function edit_page(form, layer) {

    // 监听team、product下拉框
    listenTeam(form);
    listenProduct(form);
    // 元素操作部分
    switchAssertType(form);
    addHeaderLine(form);
    delHeaderLine();
    addParamLine(form);
    delParamLine();
    addAssertLine(form);
    delAssertLine();
    addExtractLine(form);
    delExtractLine();
    // 数据交互部分
    send(layer);
    update(layer);
}

function query(form, tableIns) {
    $('#query').on('click', function () {
        tableIns.reload({
            url: '/interface/api/v1/api_list',
            method: 'post',
            where: form.val('form')
        });
    });
}