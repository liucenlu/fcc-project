/* global d3 */

// eslint-disable-next-line no-unused-vars
const projectName = 'bar-chart';

// coded by @Christian-Paul

var width = 800,
  height = 400,
  barWidth = width / 275;

var tooltip = d3//定义提示框
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3//定义选中的条形图
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer = d3//定义svg画布
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);
/*
// 假设 responseText 是从 HTTP 请求中获取的响应数据
const responseData = JSON.parse(responseText);

// 在这里进行进一步处理

d3.text('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(responseText => {
    const responseData = JSON.parse(responseText);
    // 在这里进行进一步处理
  });

*/ 
d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(data => {
    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Gross Domestic Product');

    svgContainer
      .append('text')
      .attr('x', width / 2 + 120)
      .attr('y', height + 50)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    var years = data.data.map(function (item) {//定义年份数组，内容由函数返回，item为data对象的data属性
      var quarter;
      var temp = item[0].substring(5, 7);

      if (temp === '01') {
        quarter = 'Q1';
      } else if (temp === '04') {
        quarter = 'Q2';
      } else if (temp === '07') {
        quarter = 'Q3';
      } else if (temp === '10') {
        quarter = 'Q4';
      }

      return item[0].substring(0, 4) + ' ' + quarter;
    });

    var yearsDate = data.data.map(function (item) {
      return new Date(item[0]);
    });//将年份转为JavaScript对象

    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    var xScale = d3
      .scaleTime()// 创建时间比例尺
      .domain([d3.min(yearsDate), xMax])//定义域，输入数据的范围
      .range([0, width]);//输出的范围

    var xAxis = d3.axisBottom().scale(xScale);//创建坐标轴

    svgContainer
      .append('g')//添加g元素，创建简单图形
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 400)');

    var GDP = data.data.map(function (item) {
      return item[1];
    });

    var scaledGDP = [];//创建比例尺数组，存放缩放后的GDP数据

    var gdpMax = d3.max(GDP);//定义GDP最大值

    var linearScale = d3
      .scaleLinear()//创建线性比例尺，用于缩放GDP数据
      .domain([0, gdpMax])//要缩放的数据
      .range([0, height]);//缩放后数据映射的画布范围

    scaledGDP = GDP.map(function (item) {
      return linearScale(item);
    });

    var yAxisScale = d3
      .scaleLinear()//创建y轴的线性比例尺
      .domain([0, gdpMax])
      .range([height, 0]);

    var yAxis = d3.axisLeft(yAxisScale);//创建坐标轴y轴

    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');//将y轴放到g元素内作为简单图形呈现

    d3.select('svg')
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')//添加一组矩形，即条形图
      .attr('data-date', function (d, i) {//参数d为传入的数据scaledGDP，i为d的索引值
        return data.data[i][0];
      })//设置自定义日期属性和属性值
      .attr('data-gdp', function (d, i) {
        return data.data[i][1];
      })//设置自定义gdp属性及其值
      .attr('class', 'bar')
      .attr('x', function (d, i) {
        return xScale(yearsDate[i]);
      })
      .attr('y', function (d) {
        return height - d;
      })//x，y为该矩形的位置
      .attr('width', barWidth)
      .attr('height', function (d) {
        return d;
      })//该矩形的宽和高
      .attr('index', (d, i) => i)//添加自定义索引属性
      .style('fill', 'pink')//填充条形图的颜色
      .attr('transform', 'translate(60, 0)')//平移，在x轴方向挪了60
      .on('mouseover', function (event, d) {
        // d or datum is the height of the
        // current rect
        var i = this.getAttribute('index');

        overlay//设置鼠标悬浮时的条形图
          .transition()//创建动画过渡效果，平滑切换所选择的元素
          .duration(0)//过渡持续时间
          .style('height', d + 'px')
          .style('width', barWidth + 'px')
          .style('opacity', 0.9)
          .style('left', i * barWidth + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translateX(60px)');
        tooltip.transition().duration(200).style('opacity', 0.5);
        tooltip
          .html(//设置提示框内容
            years[i] +
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', data.data[i][0])//添加自定义属性及其值
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {//鼠标离开的函数调用
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  })
  .catch(e => console.log(error));
