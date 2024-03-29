// 获取发送消息按钮的引用
const sendMessageButton = document.getElementById('begin');

// 添加点击事件监听器
sendMessageButton.addEventListener('click', function() {
    // 创建一个新的 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 配置请求方法和URL
    xhr.open('POST', 'https://example.com/api/send-message', true);

    // 设置请求头（如果需要）
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 设置响应处理函数
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // 请求成功，可以处理服务器的响应
            console.log('Message sent successfully.');
        } else {
            // 请求失败，处理错误情况
            console.error('Failed to send message.');
        }
    };

    // 设置请求体数据（如果需要）
    const messageData = { message: '比赛开始!' };
    const jsonData = JSON.stringify(messageData);

    // 发送请求
    xhr.send(jsonData);})