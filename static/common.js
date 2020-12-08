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