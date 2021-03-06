// 立即执行函数，防止变量污染 (function() {})();

// 是否是雅诗兰黛旗下店铺
// 默认为否
var isYSLD = false;

function getQueryVariable(variable){
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
          let pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
console.log(getQueryVariable("isYSLD"));

isYSLD = getQueryVariable("isYSLD") === 'true';

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
  // 时间
  setInterval(function(){
    var time = moment().format('[当前时间：]YYYY[年]MM[月]DD[日 ]HH[时]mm[分]ss[秒]');
    $('.show-time').text(time);
  }, 1000);

  // 避免卡顿 每5分钟刷新一次
  setInterval(function() {
    window.location.reload();
  }, 5 * 1000 * 60);
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
              color: '#EB3B5A'
          },
          areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#FE9C5A'
              }, {
                  offset: 1,
                  color: '#EB3B5A'
              }])
          },
          data: data
        }
      ]
  };

  function getDataAndRender() {
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
  }

  // 首次加载
  getDataAndRender();

  // 定时器
  setInterval(function () {
    getDataAndRender();
  }, 5000);

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

  function getDataAndRender() {
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
  }

  // 首次加载
  getDataAndRender();

  setInterval(function() {
    getDataAndRender();
  }, 5000);

  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();


// 销售地图 和 订单来源
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
              // color: ['#2EC7CF', '#395CFE'] // 蓝绿 
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
                      color: '#FA8231',
                      shadowBlur: 10,
                      shadowColor: '#FA8231'
                  }
              },
              zlevel: 1
          },

      ]
  };


  // 订单来源公用一个接口

  // 1.实例化对象
  var myChartRank = echarts.init(document.querySelector(".bar .chart"));
  // 2.指定配置项和数据
  
  var attackSourcesColor = [
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "#EB3B5A" },
      { offset: 1, color: "#FE9C5A" }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "#FA8231" },
      { offset: 1, color: "#FFD14C" }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "#F7B731" },
      { offset: 1, color: "#FFEE96" }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: "#395CFE" },
      { offset: 1, color: "#2EC7CF" }
    ])
  ];

  var attackSourcesColor1 = [
    "#EB3B5A",
    "#FA8231",
    "#F7B731",
    "#3860FC",
    "#1089E7",
    "#F57474",
    "#56D0E3",
    "#1089E7",
    "#F57474",
    "#1089E7",
    "#F57474",
    "#F57474"
  ];

  function attackSourcesDataFmt(sData) {
    var sss = [];
    sData.forEach(function(item, i) {
      let itemStyle = {
        color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i]
      };
      sss.push({
        value: item,
        itemStyle: itemStyle
      });
    });
    return sss;
  }

  var optionRank = {
    tooltip: {
      show: false,
      backgroundColor: "rgba(3,169,244, 0.5)", //背景颜色（此时为默认色）
      textStyle: {
        fontSize: 16
      }
    },
    color: ["#F7B731"],
    grid: {
      left: "0",
      right: "10",
      // width:"80%",
      bottom: "2%",
      top: "10",
      containLabel: true
    },
    xAxis: {
      type: "value",
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisPointer: {
          label: {
            show: true,
            //margin: 30
          }
        },
        pdaaing: [5, 0, 0, 0],
        postion: "right",
        data: [],
        axisLabel: {
          margin: 30,
          fontSize: 12,
          align: "left",
          padding: [2, 0, 0, 0],
          color: "#FFF",
          rich: {
            nt1: {
              color: "#fff",
              backgroundColor: attackSourcesColor1[0],
              width: 13,
              height: 13,
              fontSize: 10,
              align: "center",
              borderRadius: 100,
              lineHeight: "5",
              padding: [0, 1, 2, 1]
              // padding:[0,0,2,0],
            },
            nt2: {
              color: "#fff",
              backgroundColor: attackSourcesColor1[1],
              width: 13,
              height: 13,
              fontSize: 10,
              align: "center",
              borderRadius: 100,
              padding: [0, 1, 2, 1]
            },
            nt3: {
              color: "#fff",
              backgroundColor: attackSourcesColor1[2],
              width: 13,
              height: 13,
              fontSize: 10,
              align: "center",
              borderRadius: 100,
              padding: [0, 1, 2, 1]
            },
            nt: {
              color: "#fff",
              backgroundColor: attackSourcesColor1[3],
              width: 13,
              height: 13,
              fontSize: 10,
              align: "center",
              lineHeight: 3,
              borderRadius: 100,
              padding: [0, 1, 2, 1],
              lineHeight: 5
            }
          },
          
        }
      },
      
    ],
    series: [
      {
        zlevel: 1,
        name: "销售单数",
        type: "bar",
        barWidth: "15px",
        animationDuration: 1500,
        data: [],
        align: "center",
        itemStyle: {
          normal: {
            barBorderRadius: 10
          }
        },
        label: {
          show: true,
          fontSize: 10,
          color: "#fff",
          textBorderWidth: 2,
          padding: [2, 0, 0, 0]
        }
      },
    ]
  };


  function getDataAndRender(params) {
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



        // console.log(option.series[3].data);
        var attaData = [];
        var attaName = [];
        
        option.series[3].data.forEach(function(it, index) {
          attaData[index] = parseFloat(it.value[2]);
          attaName[index] = it.name;
        });

        optionRank.yAxis[0].data = attaName;
        optionRank.series[0].data = attackSourcesDataFmt(attaData);

        // 3.把配置项给实例对象
        myChartRank.setOption(optionRank);

      },
    });
  }

  // 首次加载
  getDataAndRender();

  setInterval(function() {
    getDataAndRender();
  }, 5000);

  // 4.让图表随屏幕自适应
  window.addEventListener('resize', function () {
    myChart.resize();
    myChartRank.resize();
  });
})();







