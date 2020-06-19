webpackJsonp([89],{IdYP:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s={components:{"pana-breadcrumb":e("1JPr").a},data:function(){return{cputotal:"",cpuused:"",cpupercentage:0,memorytotal:"",memoryused:"",memorypercentage:0,storagetotal:"",storageused:"",storagepercentage:0,pooltotal:"",poolname:[],acquisitionCycle:300,time:15e5,date:"",currentData:{},diskThroughput:null,memThroughput:null,cpuThroughput:null,netThroughput:null,disks:[],disk:"",nics:[],nic:"",enddate:{disabledDate:function(t){return t.getTime()>Date.now()}},bigdataips:[],bigdataIp:"",highperbus:"",highperpool:"",totalpool:"",cpuNullData:!0,memNullData:!0,storageNullData:!0,networkNullData:!0,totalData:""}},methods:{getusedDetail:function(){var t=this;this.checkError(this.$http({url:this.api.bigData.getbigQuo,method:"get"}),function(a){t.cputotal=a.data.cpu_total,t.memorytotal=t.common.formatCapacity(a.data.mem_total,"GB",2),t.cpuused=a.data.cpu_used,t.memoryused=t.common.formatCapacity(a.data.mem_used,"GB",2),t.storagetotal=t.common.formatCapacity(a.data.storage_total,"B",2),t.storageused=t.common.formatCapacity(a.data.storage_used,"B",2),t.cpupercentage=t.cpuused/t.cputotal*100,t.memorypercentage=a.data.mem_used/a.data.mem_total*100,t.storagepercentage=a.data.storage_used/a.data.storage_total*100})},getpoolStatus:function(){var t=this;this.checkError(this.$http({url:this.api.bigData.getbigPoolNum,method:"get"}),function(a){t.pooltotal=a.data.bigpool,t.highperbus=a.data.highperbus,t.highperpool=a.data.highperpool,t.totalpool=a.data.bigpool+a.data.highperbus+a.data.highperpool,setTimeout(function(){t.echartsInit(t.totalpool,t.pooltotal,t.highperbus,t.highperpool)},100)})},changeTime:function(){this.date="",this.onSubmit()},echartsInit:function(t,a,e,s){var i=this.$echarts.init(document.getElementById("piechart")),o={title:{text:this.lang.bigDataSurvey.highPerformance,textStyle:{color:"#A2ACBA",fontWeight:"normal"}},color:["#30C9AD","#60abfe","#9085ff"],graphic:{type:"text",top:"center",left:"center",style:{text:"    "+t+"\n"+this.lang.survey.pooltotal,fill:"#A2ACBA",fontSize:16}},series:[{name:this.lang.survey.businessPool,type:"pie",radius:["45%","60%"],avoidLabelOverlap:!1,label:{normal:{show:!1,position:"center"},emphasis:{show:!1,textStyle:{fontSize:"30",fontWeight:"bold"}}},labelLine:{normal:{show:!1}},data:[{value:a,name:"大数据池: "+a},{value:e,name:"高性能业务池: "+e},{value:s,name:"高性能计算: "+s}]}]};i.setOption(o,!0)},onSubmit:function(){this.getNet(),this.getgeneralInterface()},setChartParam:function(){var t=Date.parse(new Date),a="",e={precision:300};return""===this.time?(t=Date.parse(this.date[1])+864e5,a=Date.parse(this.date[0])):a=t-this.time,e.end_time=t,e.start_time=a,e},getNet:function(){var t=this,a=t.setChartParam();a.start_time=this.moment(this.moment(a.start_time-3e5).format("YYYY-MM-DD HH:mm:ss")).utc().format(),a.end_time=this.moment(this.moment(a.end_time).format("YYYY-MM-DD HH:mm:ss")).utc().format(),a=this.common.formatGetUrl(a),this.checkError(this.$http({url:this.api.bigData.get_total_net+a,method:"get"}),function(a){t.netWorkData=a.data,0===t.netWorkData.time.length?t.networkNullData=!1:(t.networkNullData=!0,setTimeout(function(){t.lineChart({elementId:"net-throughput",legend:t.lang.survey.networkLegend,yAxisLabel:"KB/s",data:t.netWorkData})},0))})},lineChart:function(t){var a=this.$echarts.init(document.getElementById(t.elementId)),e="",s=[],i=[],o=[],r=[],n=this;t.data.time.forEach(function(t,a){e=15e5===n.time?n.moment(t).tz("Asia/Shanghai").format("HH:mm"):n.moment(t).tz("Asia/Shanghai").format("MM-DD HH:mm"),s.push(e)}),t.data.pool_net.forEach(function(t,a){i.push(null===t[0]?"暂无数据":t[0]),o.push(null===t[1]?"暂无数据":t[1])}),r.push({name:"流入",type:"line",data:i,smooth:!0,symbol:"none",areaStyle:{normal:{color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#60ABFC"},{offset:1,color:"#fff"}],!1),shadowColor:"rgba(0, 0, 0, 0.1)",shadowBlur:10}}},{name:"流出",type:"line",data:o,smooth:!0,symbol:"none",areaStyle:{normal:{color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#3EC1A6"},{offset:1,color:"#fff"}],!1),shadowColor:"rgba(0, 0, 0, 0.1)",shadowBlur:10}}});var l={tooltip:{trigger:"axis",formatter:function(t){for(var a=[],e="",s="",i="",o=0;o<t.length;o++)e=t[o].value,s=t[o].color,i=t[o].seriesName,"暂无数据"===e?e="暂无数据":0===e?e="B/s":e<1024?e+=" B/s":e>1024&&e<1048576?e=Math.round(e/1024)+"KB/s":e>1048576&&e<1073741824?e=Math.round(e/1048576)+"MB/s":e>1073741824&&e<1099511627776?e=Math.round(e/1073741824)+"GB/s":e>1099511627776&&e<0x4000000000000&&(e=Math.round(e/1099511627776)+"TB/s"),a.push('<span style="background:'+s+';width:10px;height:10px;border-radius:5px;display:inline-block;line-height:10px;margin-right:5px"></span>'+i+" : "+e+"</br>");return a.join("")}},color:["#60ABFC","#3EC1A6"],grid:{left:"8%",top:"10%"},legend:{data:["流入","流出"],icon:"circle",right:"10%",itemWidth:10,itemHeight:10,textStyle:{fontSize:12}},xAxis:{type:"category",boundaryGap:!1,data:s},yAxis:{type:"value",axisLabel:{formatter:function(t){if(0==t)return t="0B/s";if(t<1024)t+=" B/s";else{if(t>1024&&t<1048576)return t=Math.round(t/1024)+"KB/s";if(t>1048576&&t<1073741824)return t=Math.round(t/1048576)+"MB/s";if(t>1073741824&&t<1099511627776)return t=Math.round(t/1073741824)+"GB/s";if(t>1099511627776&&t<0x4000000000000)return t=Math.round(t/1099511627776)+"TB/s"}}}},series:r};a.setOption(l)},getgeneralInterface:function(){var t=this,a=t.setChartParam();a.start_time=this.moment(this.moment(a.start_time-3e5).format("YYYY-MM-DD HH:mm:ss")).utc().format(),a.end_time=this.moment(this.moment(a.end_time).format("YYYY-MM-DD HH:mm:ss")).utc().format(),a=this.common.formatGetUrl(a),this.checkError(this.$http({url:this.api.bigData.get_total_rate+a,method:"get"}),function(a){t.totalData=a.data,t.diskThroughput=a.data.overciew_disk,t.memThroughput=a.data.overview_mem,t.cpuThroughput=a.data.overview_cpu,setTimeout(function(){a.data.overciew_disk.length>0?(t.storageNullData=!0,t.siglelinechart({elementId:"disk-throughput",yAxisLabel:"KB",data:t.totalData})):t.storageNullData=!1,a.data.overview_mem.length>0?(t.memNullData=!0,t.siglelinechart({elementId:"mem-throughput",yAxisLabel:"KB",data:t.totalData})):t.memNullData=!1,a.data.overview_cpu.length>0?(t.cpuNullData=!0,t.siglelinechart({elementId:"cpu-throughput",yAxisLabel:"%",data:t.totalData})):t.cpuNullData=!1},0)})},siglelinechart:function(t){var a=this.$echarts.init(document.getElementById(t.elementId)),e="",s=[],i=[],o="",r=this;"cpu-throughput"===t.elementId?(e="#3EC1A6",t.data.overview_cpu.forEach(function(t){i.push({value:null===t[2]?"暂无数据":(100*t[2]).toFixed(2),used:null===t[1]?"暂无数据":t[1],total:null===t[0]?"暂无数据":t[0]})})):"mem-throughput"===t.elementId?(e="#60ABFC",t.data.overview_mem.forEach(function(t){i.push({value:null===t[2]?"暂无数据":(100*t[2]).toFixed(2),used:null===t[1]?"暂无数据":t[1],total:null===t[0]?"暂无数据":t[0]})})):"disk-throughput"===t.elementId&&(e="#8C6AEE",t.data.overciew_disk.forEach(function(t){i.push({value:null===t[2]?"暂无数据":(100*t[2]).toFixed(2),used:null===t[1]?"暂无数据":t[1],total:null===t[0]?"暂无数据":t[0]})})),t.data.time.forEach(function(t){o=15e5===r.time?r.moment(t).tz("Asia/Shanghai").format("HH:mm"):r.moment(t).tz("Asia/Shanghai").format("MM-DD HH:mm"),s.push(o)});var n={tooltip:{trigger:"axis",formatter:function(a){if("mem-throughput"===t.elementId){var e=[];return"暂无数据"===a[0].data.total?e.push("<span></span>总数 : 暂无数据</br>"):e.push("<span></span>总数 : "+r.common.formatCapacity(a[0].data.total,"GB").value+r.common.formatCapacity(a[0].data.total,"GB").unit+"</br>"),"暂无数据"===a[0].data.used?e.push("<span></span>已使用 : 暂无数据</br>"):e.push("<span></span>已使用 : "+r.common.formatCapacity(a[0].data.used,"GB").value+r.common.formatCapacity(a[0].data.used,"GB").unit+"</br>"),"暂无数据"===a[0].data.value?e.push("<span></span>使用率: 暂无数据</br>"):e.push("<span></span>使用率: "+a[0].data.value+"%</br>"),e.join("")}if("disk-throughput"===t.elementId){e=[];return"暂无数据"===a[0].data.total?e.push("<span></span>总数 : 暂无数据</br>"):e.push("<span></span>总数 : "+r.common.formatCapacity(a[0].data.total,"B").value+r.common.formatCapacity(a[0].data.total,"B").unit+"</br>"),"暂无数据"===a[0].data.used?e.push("<span></span>已使用 : 暂无数据</br>"):e.push("<span></span>已使用 : "+r.common.formatCapacity(a[0].data.used,"B").value+r.common.formatCapacity(a[0].data.used,"B").unit+"</br>"),"暂无数据"===a[0].data.value?e.push("<span></span>使用率 : 暂无数据</br>"):e.push("<span></span> 使用率: "+a[0].data.value+"%</br>"),e.join("")}if("cpu-throughput"===t.elementId){e=[];return"暂无数据"===a[0].data.total?e.push("<span></span>总核数 : 暂无数据</br>"):e.push("<span></span> 总核数: "+a[0].data.total+"核</br>"),"暂无数据"===a[0].data.used?e.push("<span></span>已使用 : 暂无数据</br>"):e.push("<span></span> 已使用: "+a[0].data.used+"核</br>"),"暂无数据"===a[0].data.value?e.push("<span></span>使用率 : 暂无数据</br>"):e.push("<span></span> 使用率: "+a[0].data.value+"%"),e.join("")}}},grid:{left:"8%",top:"10%"},xAxis:{type:"category",boundaryGap:!1,data:s},yAxis:{type:"value",axisLabel:{formatter:function(t){return t+"%"}},max:100},series:[{data:i,type:"line",smooth:!0,symbol:"none",itemStyle:{normal:{lineStyle:{color:e}}},areaStyle:{normal:{color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:e},{offset:1,color:"#fff"}],!1),shadowColor:"rgba(0, 0, 0, 0.1)",shadowBlur:10}}}]};a.setOption(n)},refresh:function(){this.getpoolStatus(),this.getusedDetail(),this.onSubmit()},init:function(){var t=this;["disk-throughput","piechart","mem-throughput","cpu-throughput","net-throughput"].forEach(function(a){t.$echarts.init(t.$refs[a]).resize()})}},mounted:function(){var t=this;this.getusedDetail(),this.getpoolStatus(),this.onSubmit(),this.interval=setInterval(function(){t.refresh()},2e4),window.addEventListener("resize",this.init,20)},destroyed:function(){window.removeEventListener("resize",this.init,20),clearInterval(this.interval)}},i={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-container",{attrs:{type:"flex",direction:"vertical"}},[e("pana-breadcrumb"),t._v(" "),e("el-main",{staticClass:"el-main"},[e("el-row",{staticClass:"toplist",attrs:{gutter:20}},[e("el-col",{attrs:{span:6}},[e("div",{staticClass:"topbox"},[e("el-col",{attrs:{span:12}},[e("div",{ref:"piechart",attrs:{id:"piechart"}})]),t._v(" "),e("el-col",{staticClass:"echartlist",attrs:{span:12}},[e("div",{staticClass:"pie-legend"},[e("ul",[e("li",{staticClass:"li-horizontal"},[e("div",[e("i"),t._v(t._s(t.lang.bigDataSurvey.bigDataPool)+"："),e("span",[t._v(t._s(t.pooltotal))])])]),t._v(" "),e("li",{staticClass:"li-horizontal"},[e("div",[e("i"),t._v(t._s(t.lang.bigDataSurvey.highPerformanceBusiness)+"："),e("span",[t._v(t._s(t.highperbus))])])]),t._v(" "),e("li",{staticClass:"li-horizontal"},[e("div",[e("i"),t._v(t._s(t.lang.bigDataSurvey.highPerformanceComputing)+"："),e("span",[t._v(t._s(t.highperpool))])])])])])])],1)]),t._v(" "),e("el-col",{staticClass:"echartlist",attrs:{span:6}},[e("div",{staticClass:"topbox"},[e("div",{staticClass:"cpuinfo"},[e("div",{staticClass:"cpubox"},[e("div",{staticClass:"cpuleft"},[e("img",{attrs:{src:"/static/image/icon1.png"}})]),t._v(" "),e("div",{staticClass:"cupright"},[e("p",{staticClass:"moudle-name"},[t._v("CPU")]),t._v(" "),e("p",{staticClass:"totalcpu-num"},[t._v(t._s(t.cputotal)+t._s(t.lang.survey.nucleus))])])]),t._v(" "),e("el-progress",{attrs:{"show-text":!1,"stroke-width":18,percentage:t.cpupercentage}}),t._v(" "),e("p",{staticClass:"cpuuseinfo"},[e("i",{staticClass:"fa fa-pie-chart",attrs:{"aria-hidden":"true"}}),t._v(t._s(t.lang.survey.used)+": "),e("span",[t._v(t._s(t.cpuused)+"核")])])],1)])]),t._v(" "),e("el-col",{staticClass:"echartlist",attrs:{span:6}},[e("div",{staticClass:"topbox"},[e("div",{staticClass:"cpuinfo"},[e("div",{staticClass:"cpubox"},[e("div",{staticClass:"cpuleft"},[e("img",{attrs:{src:"/static/image/icon2.png"}})]),t._v(" "),e("div",{staticClass:"cupright"},[e("p",{staticClass:"moudle-name"},[t._v(t._s(t.lang.survey.memory))]),t._v(" "),e("p",{staticClass:"totalcpu-num"},[t._v(t._s(t.memorytotal.value)+" "+t._s(t.memorytotal.unit))])])]),t._v(" "),e("el-progress",{attrs:{"show-text":!1,"stroke-width":18,color:"#30c9ad",percentage:t.memorypercentage}}),t._v(" "),e("p",{staticClass:"cpuuseinfo"},[e("i",{staticClass:"fa fa-pie-chart",attrs:{"aria-hidden":"true"}}),t._v(t._s(t.lang.survey.used)+": "),e("span",[t._v(t._s(t.memoryused.value)+" "+t._s(t.memoryused.unit))])])],1)])]),t._v(" "),e("el-col",{staticClass:"echartlist",attrs:{span:6}},[e("div",{staticClass:"topbox"},[e("div",{staticClass:"cpuinfo"},[e("div",{staticClass:"cpubox"},[e("div",{staticClass:"cpuleft"},[e("img",{attrs:{src:"/static/image/icon3.png"}})]),t._v(" "),e("div",{staticClass:"cupright"},[e("p",{staticClass:"moudle-name"},[t._v(t._s(t.lang.bigDataSurvey.storage))]),t._v(" "),e("p",{staticClass:"totalcpu-num"},[t._v(t._s(t.storagetotal.value)+" "+t._s(t.storagetotal.unit))])])]),t._v(" "),e("el-progress",{attrs:{"show-text":!1,"stroke-width":18,color:"#35c5ea",percentage:t.storagepercentage}}),t._v(" "),e("p",{staticClass:"cpuuseinfo"},[e("i",{staticClass:"fa fa-pie-chart",attrs:{"aria-hidden":"true"}}),t._v(t._s(t.lang.survey.used)+": "),e("span",[t._v(t._s(t.storageused.value)+" "+t._s(t.storageused.unit))])])],1)])])],1),t._v(" "),e("el-row",{staticClass:"acquisition-cycle"},[e("el-col",{staticStyle:{"line-height":"40px"},attrs:{span:2}},[e("span",[t._v(t._s(t.lang.bigDataSurvey.collectionScope)+":")])]),t._v(" "),e("el-col",{staticClass:"timeselect",staticStyle:{"min-width":"820px"},attrs:{span:13}},[e("el-radio-group",{staticStyle:{"margin-top":"-4px"},on:{change:t.changeTime},model:{value:t.time,callback:function(a){t.time=a},expression:"time"}},t._l(t.lang.bigDataSurvey.timeOptions,function(a){return e("el-radio-button",{key:a.value,attrs:{label:a.value}},[t._v("\n\t\t\t\t\t\t"+t._s(a.text)+"\n\t\t\t\t\t")])}),1),t._v(" "),e("el-date-picker",{class:{active:!t.time&&t.date},attrs:{type:"daterange","range-separator":"-","start-placeholder":t.lang.bigDataSurvey.startTime,"end-placeholder":t.lang.bigDataSurvey.endTime,"picker-options":t.enddate},on:{input:function(a){t.time=""}},model:{value:t.date,callback:function(a){t.date=a},expression:"date"}}),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v(t._s(t.lang.bigDataSurvey.search))])],1)],1),t._v(" "),e("el-row",{staticClass:"chart-row",attrs:{gutter:20}},[e("el-col",{attrs:{span:12}},[e("div",{staticClass:"chart-div"},[e("div",{staticClass:"linechart-title"},[t._v(t._s(t.lang.bigDataSurvey.cpu))]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.cpuNullData,expression:"cpuNullData"}],ref:"cpu-throughput",staticClass:"chart",attrs:{id:"cpu-throughput"}}),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.cpuNullData,expression:"!cpuNullData"}],staticClass:"no-data"},[t._v("\n\t\t\t\t\t\t"+t._s(t.lang.componentMonitor.noData)+"\n\t\t\t\t\t")])])]),t._v(" "),e("el-col",{attrs:{span:12}},[e("div",{staticClass:"chart-div"},[e("div",{staticClass:"linechart-title"},[t._v(t._s(t.lang.bigDataSurvey.memory))]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.memNullData,expression:"memNullData"}],ref:"mem-throughput",staticClass:"chart",attrs:{id:"mem-throughput"}}),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.memNullData,expression:"!memNullData"}],staticClass:"no-data"},[t._v("\n\t\t\t\t\t\t"+t._s(t.lang.componentMonitor.noData)+"\n\t\t\t\t\t")])])])],1),t._v(" "),e("el-row",{staticClass:"chart-row",attrs:{gutter:20}},[e("el-col",{attrs:{span:12}},[e("div",{staticClass:"chart-div"},[e("div",{staticClass:"linechart-title"},[t._v(t._s(t.lang.bigDataSurvey.storage))]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.storageNullData,expression:"storageNullData"}],ref:"disk-throughput",staticClass:"chart",attrs:{id:"disk-throughput"}}),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.storageNullData,expression:"!storageNullData"}],staticClass:"no-data"},[t._v("\n\t\t\t\t\t\t"+t._s(t.lang.componentMonitor.noData)+"\n\t\t\t\t\t")])])]),t._v(" "),e("el-col",{attrs:{span:12}},[e("div",{staticClass:"chart-div"},[e("div",{staticClass:"linechart-title"},[t._v(t._s(t.lang.bigDataSurvey.network))]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.networkNullData,expression:"networkNullData"}],ref:"net-throughput",staticClass:"chart",attrs:{id:"net-throughput"}}),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.networkNullData,expression:"!networkNullData"}],staticClass:"no-data"},[t._v("\n\t\t\t\t\t\t"+t._s(t.lang.componentMonitor.noData)+"\n\t\t\t\t\t")])])])],1)],1)],1)},staticRenderFns:[]};var o=e("C7Lr")(s,i,!1,function(t){e("jS/5")},"data-v-6b05bc03",null);a.default=o.exports},"jS/5":function(t,a){}});