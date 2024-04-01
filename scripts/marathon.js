// 发送请求获取数据函数
function fetchData() {
    // 创建一个 XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
    
    // 指定请求的方法和URL
    xhr.open('GET', 'url_to_your_server_endpoint', true);

    // 定义请求完成时的回调函数
    xhr.onload = function () {
        // 检查响应状态码
        if (xhr.status >= 200 && xhr.status < 300) {
            // 解析响应数据
            var responseData = JSON.parse(xhr.responseText);
            
            // 更新页面上的数据
            document.getElementById('epc').textContent = 'EPC: ' + responseData.epc;
            document.getElementById('face').textContent = 'Face: ' + responseData.face;
            document.getElementById('result').textContent = '最终成绩：' + responseData.result;
        } else {
            // 请求失败，输出错误信息到控制台
            console.error('请求失败：' + xhr.status);
        }
    };  
    // 发送请求
    xhr.send();
}

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', fetchData);

// 开始按钮点击事件处理函数
function startMarathon() {
    // 创建一个新的 XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
    
    // 配置请求方法和URL
    xhr.open('POST', 'https://example.com/api/start-marathon', true);

    // 设置请求头
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 设置响应处理函数
    xhr.onload = function () {
        // 检查响应状态码
        if (xhr.status >= 200 && xhr.status < 300) {
            // 输出成功信息到控制台
            console.log('Marathon started successfully.');

            // 更新页面标题
            document.querySelector('.header h1').textContent = '比赛已开始';
        } else {
            // 请求失败，输出错误信息到控制台
            console.error('Failed to start marathon.');
        }
    };

    // 准备请求体数据
    const data = { message: '比赛开始!' };
    const jsonData = JSON.stringify(data);
    
    // 发送请求
    xhr.send(jsonData);
}

// 获取开始按钮的引用并添加点击事件监听器
const startButton = document.getElementById('start');
startButton.addEventListener('click', startMarathon);
