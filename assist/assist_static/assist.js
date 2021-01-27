function load_add_layer(form) {
    // 加载部门
    let teamData = httpWithReturn('/information/team', 'get', {});
    let html = '';
    for (let i in teamData) {
        if (teamData.hasOwnProperty(i)) {
            let team = teamData[i];
            html += `<option value="${team}">${team}</option>`
        }
    }
    $('#team-select').html(html);
    // 必须重新render
    form.render();
    form.val('form', {'team-select': teamData[0]});
    // 拼接产品
    let args = {'team': teamData[0]};
    // args为{'team': teamDom.val()}，且必须通过参数传入
    let productData = httpWithReturn('/information/product', 'get', args);
    html = '';
    for (let i in productData) {
        if (productData.hasOwnProperty(i)) {
            let product = productData[i];
            html += `<option value="${product}">${product}</option>`;
        }
    }
    $('#product-select').html(html);
    args['product'] = productData[0];
    form.render();
    form.val('form', {'product': productData[0]});
    // 拼接版本号
    let versionData = httpWithReturn('/information/version', 'get', args);
    html = '';
    for (let i in versionData) {
        if (versionData.hasOwnProperty(i)) {
            let version = versionData[i];
            html += `<option value="${version}">${version}</option>`
        }
    }
    $('#version-select').html(html);
    form.render();
    form.val('form', {'version': versionData[0]});
}