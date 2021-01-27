/**
 * @return {string}
 */
function GetUrlRelativePath() {
    let url = document.location.toString();
    console.log(url);
    let arrayUrl = url.split('//');
    console.log(arrayUrl);
    // 获取目标字符串
    let startIndex = arrayUrl[1].indexOf("/");
    let resultUrl = arrayUrl[1].substring(startIndex); // stop省略
    // 剔除？后面的参数
    if (resultUrl.indexOf("?") !== -1) {
        resultUrl = resultUrl.split("?")[0]
    }
    return resultUrl
}

function setBreadcrumb(breadcrumb1, breadcrumb2) {
    $(document).ready(function () {
        // let url = GetUrlRelativePath();
        // $('.layui-this').removeClass();
        // $(`a[href="${url}"]`).addClass('layui-this');
        // element.render();
        $('#breadcrumb1').text(breadcrumb1);
        $('#breadcrumb2').text(breadcrumb2);
    });
}

function http(url, method, data, success, error) {
    data = method === 'get' ? data: JSON.stringify(data);
    $.ajax({
        url: url,
        type: method,
        contentType: 'application/json;charset-UTF-8',
        dataType: 'json',
        data: data,
        success: success,
        error: error
    })
}

function httpWithReturn(url, method, data) {
    data = method === 'get' ? data: JSON.stringify(data);
    let result;
    $.ajax({
        async:false, // 如果http请求要返回值，必须加这一行
        url: url,
        type: method,
        contentType: 'application/json;charset-UTF-8',
        dataType: 'json',
        data: data,
        success: function (response) {
            result = response['data'];
        }
    });
    return result
}
//
// function init_edit_page(form) {
//     // 请求api信息并加载到页面
//     let api_info = getInterfaceInfo();
//     console.log(api_info);
//     // 初始化部门、产品、版本号
//     let args = {};
//     http('/information/team', 'get', args, function (response) {
//             // 拼出所有的部门
//             let teamData = response['data'];
//             let html = '';
//             for (let i in teamData) {
//                 if (teamData.hasOwnProperty(i)) {
//                     let team = teamData[i];
//                     html += `<option value="${team}">${team}</option>`
//                 }
//             }
//             // 设置选中值
//             let teamDom = $('#team');
//             teamDom.html(html);
//             form.val('form', {'team': api_info['team']});
//             // 渲染产品select
//             args = {'team': teamDom.val()};
//             // 注意：
//             // 1、args为{'team': teamDom.val()}，且必须通过参数传入
//             // 2、此处必须用源代码，不能用封装函数
//             http('/information/product', 'get', args, function (response) {
//                 let productData = response['data'];
//                 let html = '';
//                 for (let i in productData) {
//                     if (productData.hasOwnProperty(i)) {
//                         let product = productData[i];
//                         html += `<option value="${product}">${product}</option>`;
//                     }
//                 }
//                 let productDom = $('#product');
//                 productDom.html(html);
//                 form.val('form', {'product': api_info['product']});
//                 args['product'] = productDom.val();
//                 // 渲染版本号select
//                 http('/information/version', 'get', args, function (response) {
//                     let versionData = response['data'];
//                     console.log(versionData);
//                     let html = '';
//                     for (let i in versionData) {
//                         if (versionData.hasOwnProperty(i)) {
//                             let version = versionData[i];
//                             html += `<option value="${version}">${version}</option>`
//                         }
//                     }
//                     let versionDom = $('#version');
//                     versionDom.html(html);
//                     form.val('form', {'version': api_info['version']});
//                 }, function (response) {
//                     console.log(response);
//                 });
//             }, function (response) {
//                 console.log(response);
//             });
//         }, function (response) {
//             console.log(response);
//         }
//     );
//     loadHeaders(api_info['headers'], form);
//     loadParams(api_info['params'], form);
// }
//
// function listenTeam(form) {
//     form.on('select(team)', function (data) {
//         let args = {'team': data.value};
//         renderProduct(args, form);
//     })
// }