// 立即执行函数，防止变量污染 (function() {})();

// 是否是雅诗兰黛旗下店铺
var isYSLD = true;
isYSLD = false;

var ysldShops = [
  'mac魅可官方旗舰店',
  '雅诗兰黛官方旗舰店',
  'clinique倩碧官方旗舰店',
  'darphin朵梵官方旗舰店',
  'glamglow格莱魅官方旗舰店',
  'labseries朗仕官方旗舰店',
];
var shopName = isYSLD ? ysldShops.join(',') : 'all';


// 全局方法
(function() {
  setInterval(() => {
    var time = moment().format('[当前时间：]YYYY[年]MM[月]DD[日 ]HH[时]mm[分]ss[秒]');
    $('.show-time').text(time);
  }, 1000);
})();


// 订单来源
(function () {
  // 1.实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"));
  // 2.指定配置项和数据
  


  // 排行数据

  var rankData = [];


  var playInterval = 500;
  var unit = {
    '0': '',
    '1': '万',
    '2': '亿',
    '3': '兆'
  };

  // 千分位
  function formatNum(strNum) {
    if (Math.round(strNum) <= 10 && strNum.length <= 3) {
        return strNum;
    }
    u0 = 0
    while (Math.round(strNum) > 1000000 && u0 < 3) {
        strNum = Math.round(Math.round(strNum) / 10000);
        u0 = u0 + 1
    }

    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum;
    }
    var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
    var re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c + unit[String(u0)];
  }

  // 排行颜色
  // var colorListS1 = [];
  // var colors = []
  // for (var i = 0; i < rankData.length; i++) {
  //   var colorListF1 = {};
  //   for (var n = 0; n < rankData[i].data.length; n++) {
  //       var name = rankData[i].data[n].name;
  //       colorListF1[name] = colors[n];
  //   }
  //   colorListS1[i] = colorListF1;
  // }

  // 基础设置
  var option = {
    baseOption: {
        animationDurationUpdate: playInterval * 2,
        animationEasingUpdate: 'quinticInOut',
        timeline: {
            show: false,
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            loop: false,
            playInterval: playInterval * 2,
            // left: null,
            // right: 30,
            // top: 330,
            // bottom: 100,
            // height: null,
            label: {
                normal: {
                    show: true,
                    interval: 0
                }
            },
            symbol: 'none',
            lineStyle: {
                color: '#ccc',
                show: false
            },
            checkpointStyle: {
                symbol: 'none',
                color: '#bbb',
                borderColor: '#777',
                show: false,
                borderWidth: 1
            },
            controlStyle: {
                showNextBtn: false,
                showPrevBtn: false,
                normal: {
                    color: '#666',
                    show: false,
                    borderColor: '#666'
                },
                emphasis: {
                    color: '#aaa',
                    borderColor: '#aaa'
                }
            },
            data: rankData.map(function(ele) {
                return ele.date
            })
        },
        // title: [{
        //     left: 'center',
        //     top: '3%',
        //     textStyle: {
        //         fontSize: 25,
        //         color: 'rgba(121,121,121, 0.9)'
        //     }
        // }, {
        //     left: 'center',
        //     top: '5%'
        // }],
        grid: [{
            left: '10%',
            right: '10%',
            top: '12%',
            height: 'auto',
            bottom: '10%'
        }],
        xAxis: [{

        }],
        yAxis: [{

        }],
        series: [{
            id: 'bar',
            type: 'bar',
            barWidth: '20',
            tooltip: {
                show: false
            },
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
            data: []
        },{
            id: 'bar1',
            type: 'bar',
            barWidth: '20',
            tooltip: {
                show: false
            },
            label: {
                normal: {
                    show: true,
                    position: 'left'
                }
            },
            data: []
        }]
    },
    options: []
  };


  var guangdong = 238;
  var zhejiang = 197;
  var jiangsu = 165;
  var anhui = 145;
  var beijing = 107;
  var shanghai = 80;
  var tianjin = 80;

  var index = 0;
  setInterval(function () {
    // rankData = [];
    guangdong += parseInt(Math.random()*1000)
    zhejiang += parseInt(Math.random()*1000)
    jiangsu += parseInt(Math.random()*1000)
    anhui += parseInt(Math.random()*1000)
    beijing += parseInt(Math.random()*1000)
    shanghai += parseInt(Math.random()*1000)
    tianjin += parseInt(Math.random()*1000)


    rankData.push({
      'category': moment().format('YYYY-MM-DD-HH-mm-ss'),
      'data': [
          {
              'name': '广东',
              'value': guangdong
          },
          {
              'name': '浙江',
              'value': zhejiang
          },
          {
              'name': '江苏',
              'value': jiangsu
          },

          {
              'name': '安徽',
              'value': anhui
          },

          {
              'name': '北京',
              'value': beijing
          },

          {
              'name': '上海',
              'value': shanghai
          },

          {
              'name': '天津',
              'value': tianjin
          } ],
      'date': moment().format('YYYY-MM-DD-HH-mm-ss')
    });

    // console.log(rankData);

    option.baseOption.timeline.data = rankData.map(function(ele) {
        return ele.date
    })
    

    var xMaxInterval = 5;

    for (var i = 0; i < rankData.length; i++) {
      var xMax = 20;
      if (rankData[i].data[0].value > 20) {
          xMax = 'dataMax'
      }
      if (rankData[i].data[0].value / xMaxInterval >= 10) {
          xMaxInterval = parseInt(rankData[i].data[0].value / 5)
      }


      option.options.push({
          xAxis: [{
              show: true,
              type: 'value',
              interval: xMaxInterval,
              max: xMax,
              axisTick: {
                  show: false
              },
              axisLabel: {
                  show: true,
                  color: 'rgba(121,121,121,0.9)',
                  formatter: function(value, index) {
                      // 空一格显示一次坐标值
                      if (index % 2 === 0) {
                          u = 0
                          while (value > 100000 && u < 3) {
                              value = Math.round(value / 10000);
                              u = u + 1
                          }
                          return String(value) + unit[String(u)]
                      } else {
                          return '';
                      }
                  },
                  textStyle: {
                      color: 'rgba(121,121,121,0.9)'
                  }
              },
              axisLine: {
                  show: false,
                  lineStyle: {
                      color: 'rgba(121,121,121,0.3)'
                  }
              },
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: ['rgba(121,121,121,0.3)', 'rgba(121,121,121,0)']
                  }
              }
          }],
          
          
          yAxis: [{
              type: 'category',
              inverse: true, // 反转

              axisTick: {
                  show: false
              },
              axisLine: {
                  show: true,
                  lineStyle: {
                      color: 'rgba(121,121,121,0.3)'
                  }
              },
              axisLabel: {
                  show: false,
                  textStyle: {}
              },
              // data: rankData[i].data.map(function(ele) {
              //     return ele.name
              // }).reverse()
              data: rankData[i].data.sort(function(a, b) {
                return a.value > b.value
            }).map(function(ele) {
                return ele.name
              })
          }],

          series: [
              {
              id: 'bar',
              itemStyle: {
                  normal: {
                      color: function(params) {
                          var colorList = [
                              '#7711AF', '#CF77FF', '#AE004F', '#F35872', '#FA7729',
                              '#FFC526', '#F8E71C', '#34ADAE', '#3DDFD2', '#A0FFFF'
                          ];
                          var colorListr = [
                              '#0f4471',
                              '#00adb5',
                              '#ff5722',
                              '#5628b4',
                              '#20BF55',
                              '#f23557',
                              '#118df0',
                              '#11cbd7',
                              '#d3327b',
                              '#ae318a',
                              '#993090',
                              '#6f3071'
                          ];
                          return colorListr[params.dataIndex]
                      },
                      label: {
                          show: true,
                          position: 'top',
                          formatter: '{c}%'
                      },
                      shadowBlur: 20,
                      shadowColor: 'rgba(40, 40, 40, 0.5)',
                  }
              },
              
              label: {
                  normal: {
                      position: 'right',
                      formatter: function(p) {
                          return formatNum(p.value);
                      }
                  }
              },

              data: rankData[i].data.map(function(ele) {
                  return ele.value
              }).sort(function(a, b) {
                  return a > b
              })
          },

          {
              id: 'bar1',
              itemStyle: {
                  normal: {
                      color: function(params) {
                          var colorList = [
                              '#7711AF', '#CF77FF', '#AE004F', '#F35872', '#FA7729',
                              '#FFC526', '#F8E71C', '#34ADAE', '#3DDFD2', '#A0FFFF'
                          ];
                          var colorListr = [
                              '#0f4471',
                              '#00adb5',
                              '#ff5722',
                              '#5628b4',
                              '#20BF55',
                              '#f23557',
                              '#118df0',
                              '#11cbd7',
                              '#d3327b',
                              '#ae318a',
                              '#993090',
                              '#6f3071'
                          ];
                          return colorListr[params.dataIndex]
                      },
                      label: {
                          show: true,
                          position: 'top',
                          formatter: '{c}%'
                      },
                      shadowBlur: 20,
                      shadowColor: 'rgba(40, 40, 40, 0.5)',
                  }
              },
              barGap: '-100%',
              label: {
                  normal: {
                      position: 'left',
                      formatter: function(p) {
                          return p.name;
                      }
                  }
              },
              data: rankData[i].data.map(function(ele) {
                  return ele.value
              }).sort(function(a, b) {
                  return a > b
              })
          }
          ]
      })
    }

    index += 1;

    // if (index === 10) {
      // console.log('设定');
      myChart.setOption(option);
    // }

  }, 1000);


  // myChart.on('timelinechanged', function(timelineIndex) {
  //   // 设置 每个series里的xAxis里的值
  //   // var arrIndex = parseInt(timelineIndex.currentIndex);
  //   // if (arrIndex == 5) // 这里 5可理解为timeline节点数组的长度,此处的目的是防止 5.xAxis not found
  //   // arrIndex = 0
  //   // option.options[arrIndex].xAxis.data=data[arrIndex];
  //   // myChart.setOption(option);

  //   console.log('timelineIndex', timelineIndex);
  // });





  // 3.把配置项给实例对象
  myChart.setOption(option);

  // 4.让图表随屏幕自适应
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();


// 分时段销售额
(function () {
  var myChart = echarts.init(document.querySelector('.line2 .chart'));
  
  //x轴-时间
  var date = [];
  //y轴-销售额
  var data = [];


  var option = {
      tooltip: {
          trigger: 'axis',
          position: function (pt) {
              return [pt[0], '10%'];
          }
      },
      grid: {
        top: '30',
        left: '10',
        right: '0',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
          type: 'category',
          boundaryGap: false, // 去除轴间距
          axisLabel: {
            textStyle: {
              color: "#FFF",
              fontSize: 12,
            },
            // interval: 0, // 不省略
            rotate: 40, // 显示不全旋转显示
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)"
            }
          },
          data: date,
      },
      yAxis: {
          type: 'value',
          min: 0,
          axisTick: {
            // 不显示刻度线
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#FFF",
              fontSize: 12
            },
            formatter: function(value) {
              value = value / 100000000
              return value + '亿';
            },
          },
          // 修改分割线的颜色
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
      },
      series: [
        {
          name:'销售额',
          type:'line',
          smooth: true,    //拐弯处变锋利
          symbol: 'none',//去除圆角
          sampling: 'average',
          animationDurationUpdate:1000,    //数据更新时的动画时长
          animationEasing:"bounceIn",
          // animationDelayUpdate: function (idx) {
          //     // 越往后的数据延迟越大
          //     return idx * 10;
          // },
          itemStyle: {
              color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
              }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
              }])
          },
          data: data
        }
      ]
  };

  setInterval(function () {
    var url = isYSLD ? 'http://10.2.3.138:10036/getShopHourStatInfo' : 'http://10.2.3.138:10036/getAllHourStatInfo';

    $.ajax({
      url: url,
      method:'POST',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        payAt: moment().format("YYYY-MM-DD"),
        shopName: shopName,
      }),
      success:function(res){
        res = res.sort(function (a, b) {
          return a.statTime < b.statTime;
        });
        
        // 前端汇总
        if (isYSLD) {
          var groupObj = {}
          groupObj = _.groupBy(res, function (obj) {
            return obj.statTime;
          });


          var temp = [];
          _.forEach(groupObj, function(value, key) {
            temp.push({
              displayMoney: _.sumBy(value, function (e) {
                return e.displayMoney;
              })
            })
          });

          res = temp;

          console.log(res);
        }

        //x轴-时间
        date = [];
        //y轴-销售额
        data = [0];


        var allData = [
          {"time":"0点","num": 0},
          {"time":"1点","num": 0},
          {"time":"2点","num": 0},
          {"time":"3点","num": 0},
          {"time":"4点","num": 0},
          {"time":"5点","num": 0},
          {"time":"6点","num": 0},
          {"time":"7点","num":0},
          {"time":"8点","num":0},
          {"time":"9点","num":0},
          {"time":"10点","num":0},
          {"time":"11点","num":0},
          {"time":"12点","num":0},
          {"time":"13点","num":0},
          {"time":"14点","num":0},
          {"time":"15点","num":0},
          {"time":"16点","num":0},
          {"time":"17点","num":0},
          {"time":"18点","num":0},
          {"time":"19点","num":0},
          {"time":"20点","num":0},
          {"time":"21点","num":0},
          {"time":"22点","num":0},
          {"time":"23点","num":0},
          {"time":"24点","num":0},
        ]
        allData.map(function (val) {
          date.push(val.time);
        })

        res.map(function(val) {
            data.push(val.displayMoney);
        });

        option.xAxis.data = date;
        option.series[0].data = data;
        myChart.setOption(option);
      }
    });
  }, 2000);

  window.addEventListener('resize', function () {
    myChart.resize();
  })

})();


// 销售目标达成率
(function () {
  var myChart = echarts.init(document.querySelector('.pie2 .chart'));
  
  var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
            // show: false
        },
        textStyle: {
          color: "#D7E3FF"
        },
        backgroundColor:"#0F1225",
        padding: [10, 18, 20, 12],
        formatter: function (obj) {
            var str='';
            str='<div style="font-size: 12px;"><p style="color:#8DA2D3;lineHeight:18px;height:18px;">'+obj[0].name+'</p>';
            obj.map(function(item){
                var subStr = "<div style='lineHeight:22px;height:24px;'><div style='display:inline-block;width:5px;height:5px;margin-right:6px;background:"+item.color+";border-radius:50%;margin-bottom:2px;'></div>"+item.seriesName+"："+item.value+"%</div>";
                str+=subStr;
            });
             str += "</div>";
            return  str;
        },
    },

    legend: {
        data: ['一档销售目标', '二档销售目标', '三档销售目标'],
        icon:"circle",
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
        icon: "circle",
        orient: "horizontal",
        right:10,
        textStyle: {
          color: "#FFF",
          fontSize: 14,
          padding: [0 ,0 ,0,6],
          fontFamily: "SourceHanSansCN-Regular"
          // lineHeight: 30
        }
    },
    grid: {
        left: '10',
        right: '10',
        bottom: '3%',
        top: '3%',
        containLabel: true,
        // show: true,
        borderColor:"#F3F5F7"
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLabel: {
                textStyle: {
                    color: '#FFF',
                    fontSize:14,
                },
                margin:18
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
        }
    ],
    yAxis: [{
        axisLine: {
            show: false
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
            lineStyle: {
                type: 'dotted',
                color: 'rgba(255,255,255,.2)'
            }
        },
        splitNumber: 2
    }
    ],
    color:['#5F9CFE',"#A8CDFF","#F4686D"],
    series: [
        {
            name: '一档销售目标',
            type: 'bar',
            barWidth: 40,
            stack: '搜索引擎',
            showBackground: true,
            backgroundStyle: {
                color: '#F9FAFD'
            },
            label: {
              normal: {
                  show: true,
                  position: 'inside',
                  formatter:function(params){
                    if (params.value == '100.00') {
                      return '100%';
                    }
                      return params.value+"%";
                  },
                  fontSize: 10
              }
            },
            data: []
        },
        {
            name: '二档销售目标',
            type: 'bar',
            stack: '搜索引擎',
            barWidth: 40,
            label: {
              normal: {
                  show: true,
                  position: 'inside',
                  formatter:function(params){
                      if (params.value == '0.00') {
                        return '';
                      }
                      if (params.value == '100.00') {
                        return '100%';
                      }
                      return params.value+"%";
                  },
                  fontSize: 10
              }
            },
            data: []
        },
        {
            name: '三档销售目标',
            type: 'bar',
            stack: '搜索引擎',
            barWidth: 40,
            label: {
              normal: {
                  show: true,
                  position: 'inside',
                  formatter:function(params){
                    if (params.value == '0.00') {
                      return '';
                    }
                    if (params.value == '100.00') {
                      return '100%';
                    }
                    return params.value+"%";
                  },
                  fontSize: 10
              }
            },
            data: []
        },
    ]
  };

  setInterval(function() {
    $.ajax({
      url: 'http://10.2.3.138:10036/getDangweiInfo',
      method:'POST',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        shopName: shopName,
      }),
      success:function(res){

        var groupObj = {}
        groupObj = _.groupBy(res, function (obj) {
          return obj.shortName;
        });
        
        var temp = [];
        _.forEach(groupObj, function(value, key) {
          var objItem = {};
          value.forEach(function(item, index) {
            var key = 'dangweiRatio' + (index + 1);
            objItem = _.assign(objItem, item);
            objItem[key] = item.dangweiRatio;
          })
          temp.push(objItem);
        });
        console.log(temp);


        option.xAxis[0].data = temp.map(function (e) { return e.shortName })
        // 一档销售目标
        option.series[0].data = temp.map(function (e) { return Number(e.dangweiRatio1 * 100).toFixed(2) })
        // 二档销售目标
        option.series[1].data = temp.map(function (e) { return Number(e.dangweiRatio2 * 100).toFixed(2) })
        // 三档销售目标
        option.series[2].data = temp.map(function (e) { return Number(e.dangweiRatio3 * 100).toFixed(2) })

        myChart.setOption(option);
      },
    });

  }, 5000);


  
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();


// 销售地图
(function () {

  var myChart = echarts.init(document.querySelector(".map .chart"));
  var mapName = 'china';
  
  var data = [
      {name:"北京", fullName: '北京市', value:0},
      {name:"天津",fullName: '天津市',value:0},
      {name:"河北",fullName: '河北省',value:0},
      {name:"山西",fullName: '山西省',value:0},
      {name:"内蒙古",fullName: '内蒙古自治区',value:0},
      {name:"辽宁",fullName: '辽宁省',value:0},
      {name:"吉林",fullName: '吉林省',value:0},
      {name:"黑龙江",fullName: '黑龙江省',value:0},
      {name:"上海",fullName: '上海市',value:0},
      {name:"江苏",fullName: '江苏省',value:0},
      {name:"浙江",fullName: '浙江省',value:0},
      {name:"安徽",fullName: '安徽省',value:0},
      {name:"福建",fullName: '福建省',value:0},
      {name:"江西",fullName: '江西省',value:0},
      {name:"山东",fullName: '山东省',value:0},
      {name:"河南",fullName: '河南省',value:0},
      {name:"湖北",fullName: '湖北省',value:0},
      {name:"湖南",fullName: '湖南省',value:0},
      {name:"重庆",fullName: '重庆市',value:0},
      {name:"四川",fullName: '四川省',value:0},
      {name:"贵州",fullName: '贵州省',value:0},
      {name:"云南",fullName: '云南省',value:0},
      {name:"西藏",fullName: '西藏自治区',value:0},
      {name:"陕西",fullName: '陕西省',value:0},
      {name:"甘肃",fullName: '甘肃省',value:0},
      {name:"青海",fullName: '青海省',value:0},
      {name:"宁夏",fullName: '宁夏回族自治区',value:0},
      {name:"新疆",fullName: '新疆维吾尔自治区',value:0},
      {name:"广东",fullName: '广东省',value:0},
      {name:"广西",fullName: '广西壮族自治区',value:0},
      {name:"海南",fullName: '海南省',value:0},
      // {name:"台湾",fullName: '台湾',value:0},
      {name:"香港",fullName: '香港特别行政区',value:0},
      // {name:"澳门",fullName: '澳门',value:0},
      {name:"南海诸岛",fullName: '南海诸岛',value:0},
  ];
      
  var geoCoordMap = {};
  
  /*获取地图数据*/
  myChart.showLoading();
  var mapFeatures = echarts.getMap(mapName).geoJson.features;
  myChart.hideLoading();
  mapFeatures.forEach(function(v) {
      // 地区名称
      var name = v.properties.name;
      // 地区经纬度
      geoCoordMap[name] = v.properties.cp;
  });

  var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
              res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value),
              });
          }
      }
      return res;
  };

  var convertedData = convertData(data)
  console.log('convertedData', convertedData)


  var option = {
      tooltip: {
          formatter: function(e, t, n) {
            if (e.seriesType === 'map') {
              return e.name + "：销售单量" + e.value + "单"
            } else {
              // var valueArr = e.value.split(',');
              value = e.value[e.value.length -1];
              return e.name + "：销售单量" + value + "单"
            }
          }, 
      },
    
      visualMap: {
          show: true,
          min: 0,
          max: 1000000,
          left: '5%',
          bottom: '5%',
          // top: 'bottom',
          calculable: true,
          seriesIndex: [1],
          inRange: {
              color: ['#467bc0', '#04387b'] // 蓝绿
          },
          textStyle: {
            "color": "#fff"
          },
      },

      geo: {
          show: true,
          map: mapName,
          label: {
              normal: {
                  show: false
              },
              emphasis: {
                  show: false,
              }
          },
          roam: false,
          zoom: 1.2,
          itemStyle: {
              normal: {
                  areaColor: '#023677',
                  borderColor: '#1180c7',
              },
              emphasis: {
                  areaColor: '#4499d0',
              }
          },
          // itemStyle: {
          //   normal: {
          //     borderColor: 'rgba(147, 235, 248, 1)',
          //     borderWidth: 1,
          //     areaColor: {
          //         type: 'radial',
          //         x: 0.5,
          //         y: 0.5,
          //         r: 0.8,
          //         colorStops: [{
          //             offset: 0,
          //             color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
          //         }, {
          //             offset: 1,
          //             color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
          //         }],
          //         globalCoord: false // 缺省为 false
          //     },
          //     shadowColor: 'rgba(128, 217, 248, 1)',
          //     // shadowColor: 'rgba(255, 255, 255, 1)',
          //     shadowOffsetX: -2,
          //     shadowOffsetY: 2,
          //     shadowBlur: 10
          //   },
          //   emphasis: {
          //       areaColor: '#389BB7',
          //       borderWidth: 0
          //   }
          // },
      },
      series: [{
              name: '散点',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              symbolSize: function(val) {
                  return val[2] / 100000;
              },
              label: {
                  normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: true
                  },
                  emphasis: {
                      show: true
                  }
              },
              itemStyle: {
                  normal: {
                      color: '#fff'
                  }
              }
          },
          {
              type: 'map',
              map: mapName,
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                  normal: {
                      show: true
                  },
                  emphasis: {
                      show: false,
                      textStyle: {
                          color: '#fff'
                      }
                  }
              },
              roam: true,
              itemStyle: {
                  normal: {
                      areaColor: '#031525',
                      borderColor: '#3B5077',
                  },
                  emphasis: {
                      areaColor: '#2B91B7'
                  }
              },
              animation: false,
              data: data
          },
          {
              name: '点',
              type: 'scatter',
              coordinateSystem: 'geo',
              zlevel: 6,
          },
          // 地图中闪烁的点
          {
              name: 'Top 10',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertData(data.sort(function(a, b) {
                  return b.value - a.value;
              }).slice(0, 10)),
              symbolSize: function(val) {
                  return val[2] / 50000;
              },
              showEffectOn: 'render',
              rippleEffect: {
                  brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                  normal: {
                      formatter: '{b}',
                      position: 'left',
                      show: false
                  }
              },
              itemStyle: {
                  normal: {
                      color: 'yellow',
                      shadowBlur: 10,
                      shadowColor: 'yellow'
                  }
              },
              zlevel: 1
          },

      ]
  };

  setInterval(function() {

    $.ajax({
      url: 'http://10.2.3.138:10036/getTotalStatInfo',
      method:'POST',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        shopName: shopName,
      }),
      success:function(res){
        var obj = _.find(res, function(e) {
          return e.province === 'ALL';
        });

        // 累计销售额
        $('#totalSalesValue').numScroll({
          number: parseInt(obj.totalMoney / 100),
          symbol: true,
          fromZero: false,
          time: 3000,
        });


        data = data.map(function (item) {
          var findObj = _.find(res, function(e) {
            return e.province === item.fullName;
          }) || {};

          if (_.isEmpty(findObj)) {
            item.value = 0;
          } else {
            item.value = findObj.totalAmount;
          }
          return item;
        });

        // 散点
        option.series[0].data = convertData(data);
        // map
        option.series[1].data = data;
        // 地图中闪烁的点
        option.series[3].data = convertData(data.sort(function(a, b) {
          return b.value - a.value;
        }).slice(0, 10));
        
        myChart.setOption(option);
      },
    });
  }, 5000);


  window.addEventListener('resize', function () {
    myChart.resize();
  });

})();



// 避免卡顿 每5分钟刷新一次
setInterval(function() {
  window.location.reload();
}, 5 * 1000 * 60);






