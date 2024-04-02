// 发送请求获取数据函数
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://10.151.10.250:5000/api/get-data', true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                var responseData = JSON.parse(xhr.responseText);
                // 处理成功的响应
                document.getElementById('epc').textContent = 'EPC: ' + responseData.epc;
                document.getElementById('face').textContent = 'Face: ' + responseData.face;
                document.getElementById('result').textContent = '最终成绩：' + responseData.result;
            } catch (error) {
                console.error('响应数据不是有效的 JSON 格式：', xhr.responseText);
            }
        } else {
            // 处理请求失败的情况
            console.error('请求失败：' + xhr.status);
        }
    };
    xhr.send();
}

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', function () {
    fetchData(); // 初始加载一次

    // 每隔10秒自动获取数据
    setInterval(fetchData, 100);
});

// 获取开始按钮的引用并添加点击事件监听器
const startButton = document.getElementById('start');
startButton.addEventListener('click', function () {
    // 创建一个新的 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 配置请求方法和URL
    xhr.open('POST', '10.151.10.250:5000/api/start-marathon', true);

    // 设置请求头（如果需要）
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 设置响应处理函数
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // 请求成功，可以处理服务器的响应
            console.log('Marathon started successfully.');

            // 修改页面上的标题文本
            document.querySelector('.header h1').textContent = '比赛已开始';
        } else {
            // 请求失败，处理错误情况
            console.error('Failed to start marathon.');
        }
    };

    // 设置请求体数据（如果需要）
    const data = { message: '比赛开始!' };
    const jsonData = JSON.stringify(data);

    // 发送请求
    xhr.send(jsonData);
});
