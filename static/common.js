/**
 * @return {string}
 */
function GetUrlRelativePath() {
    let url = document.location.toString();
    console.log(url);
    let arryUrl = url.split('//');
    console.log(arryUrl);
    // 获取目标字符串
    let startIndex = arryUrl[1].indexOf("/");
    let resultUrl = arryUrl[1].substring(startIndex) // stop省略
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