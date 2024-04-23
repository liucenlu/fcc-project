// 创建表格和表头
const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
table.id = 'marathon_table';
// 创建表头行
const headerRow = document.createElement('tr');
['EPC', 'Face', '最终成绩'].forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);
table.appendChild(tbody);
// 将表格添加到 right_se 中
const rightSection = document.getElementById('right_se');
rightSection.appendChild(table);
// 新增一行数据到表格中
// 新增一行数据到表格中
function addDataRow(epc, face, result) {
    // 检查是否存在相同的 EPC
    const existingRow = Array.from(tbody.querySelectorAll('tr')).find(row => {
        return row.cells[0].textContent === epc; // 比较第一个单元格的内容是否与当前 EPC 相同
    });
    if (existingRow) {
        // 如果已存在相同的 EPC，则更新数据
        if (existingRow.cells[1].textContent === 'Face: unauthorized!!!' && face !== 'Face: unauthorized!!!') {
            // 如果原本的 Face 为 "unauthorized"，且新获取的 Face 不是 "unauthorized"，则用新获取的 Face 替换掉原本的信息
            existingRow.cells[1].textContent = 'Face: ' + face;
            existingRow.cells[2].textContent = '最终成绩：' + result;
        }
    } else {
        // 如果不存在相同的 EPC，则新增数据
        const newRow = document.createElement('tr');
        [epc, face, result].forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            newRow.appendChild(cell);
        });
        tbody.appendChild(newRow);
    }
}
// 修改 face 标签内容时显示警报
function displayAlert() {
    const faceContent = document.getElementById('face').textContent;
    if (faceContent === 'Face: unauthorized!!!') {
        document.getElementById('alert').style.display = 'block';
    } else {
        document.getElementById('alert').style.display = 'none';
    }
}
// 页面加载时显示警报
document.addEventListener('DOMContentLoaded', function () {
    displayAlert();
});
// 定时检查 face 标签内容并显示警报
setInterval(displayAlert, 1000);

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
                
                // 新增一行数据到表格中
                addDataRow(responseData.epc, responseData.face, responseData.result);
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
    setInterval(fetchData, 3000);
});

// 获取开始按钮的引用并添加点击事件监听器
const startButton = document.getElementById('start');
startButton.addEventListener('click', function () {
    // 创建一个新的 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 配置请求方法和URL
    xhr.open('POST', 'http://10.151.10.250:5000/api/start-marathon', true);

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
    
    // 注释掉这一行或者删除掉这一行，即可不执行请求，直接执行响应函数
    // xhr.send();
});

// 点击比赛结束按钮时触发的函数
document.getElementById('end').addEventListener('click', function() {
    const tableData = collectTableDataWithHeaders();
    const csvContent = Papa.unparse(tableData, { header: true });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'marathon_results.csv';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

function collectTableDataWithHeaders() {
    const headers = ['EPC', 'Face', 'Result']; // 直接指定列名
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const tableData = rows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.textContent));
    tableData.unshift(headers); // 将列名添加到表格数据的首行
    return tableData;
}
