webpackJsonp([110],{K7qR:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o("3cXf"),s=o.n(a),n=o("1JPr"),l={name:"pana-start",props:{show:Boolean,ids:Array},methods:{closeModal:function(t){t=t||!1,this.$emit("closeModal",t)},confirm:function(){var t=this,e=this.api.bigData.bigDataContainerAction,o={containers:this.ids,action:0};t.closeModal(),this.ids.map(function(e){t.wsEventQueue.push(e)}),this.checkError(this.$http({url:e,method:"POST",data:o}),function(e){t.$emit("getList")})}}},i={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{title:t.lang.common.info,visible:t.show,width:"30%",modal:!0},on:{close:t.closeModal}},[o("el-row",{attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:10}},[t._v(t._s(t.lang.bigData.startDockerInfo))])],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:t.confirm}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]},r=o("C7Lr")(l,i,!1,null,null,null).exports,c={props:{show:Boolean,ids:Array},methods:{closeModal:function(t){t=t||!1,this.$emit("closeModal",t)},confirm:function(){var t=this,e=this.api.bigData.bigDataContainerAction,o={containers:this.ids,action:1};t.closeModal(),this.ids.map(function(e){t.wsEventQueue.push(e)}),this.checkError(this.$http({url:e,method:"POST",data:o}),function(e){t.$emit("getList")})}}},u={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{title:t.lang.common.info,visible:t.show,width:"30%",modal:!0},on:{close:t.closeModal}},[o("el-row",{attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:10}},[t._v(t._s(t.lang.bigData.shutoffDockerInfo))])],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:t.confirm}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]},h=o("C7Lr")(c,u,!1,null,null,null).exports,d={props:{show:Boolean,ids:Array},methods:{closeModal:function(t){t=t||!1,this.$emit("closeModal",t)},confirm:function(){var t=this,e=this.api.bigData.bigDataContainerAction,o={containers:this.ids,action:2};t.closeModal(),this.ids.map(function(e){t.wsEventQueue.push(e)}),this.checkError(this.$http({url:e,method:"POST",data:o}),function(e){t.$emit("getList")})}}},p={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{title:t.lang.common.info,visible:t.show,width:"30%",modal:!0},on:{close:t.closeModal}},[o("el-row",{attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:10}},[t._v(t._s(t.lang.bigData.rebootDockerInfo))])],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:t.confirm}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]},f=o("C7Lr")(d,p,!1,null,null,null).exports,g={name:"pana-start",props:{show:Boolean,ids:Array},methods:{closeModal:function(t){t=t||!1,this.$emit("closeModal",t)},confirm:function(){var t=this,e=this.api.bigData.bigDataContainerAction,o={containers:this.ids,action:3};t.closeModal(),this.ids.map(function(e){t.wsEventQueue.push(e)}),this.checkError(this.$http({url:e,method:"POST",data:o}),function(e){t.$emit("getList")})}}},m={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{title:t.lang.common.info,visible:t.show,width:"30%",modal:!0},on:{close:t.closeModal}},[o("el-row",{attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:10}},[t._v(t._s(t.lang.bigData.hangDockerInfo))])],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:t.confirm}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]},b=o("C7Lr")(g,m,!1,null,null,null).exports,v={props:{show:Boolean,ids:Array},methods:{closeModal:function(t){t=t||!1,this.$emit("closeModal",t)},confirm:function(){var t=this,e=this.api.bigData.bigDataContainerAction,o={containers:this.ids,action:4};t.closeModal(),this.ids.map(function(e){t.wsEventQueue.push(e)}),this.checkError(this.$http({url:e,method:"POST",data:o}),function(e){t.$emit("getList")})}}},_={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-dialog",{attrs:{title:t.lang.common.info,visible:t.show,width:"30%",modal:!0},on:{close:t.closeModal}},[o("el-row",{attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:10}},[t._v(t._s(t.lang.bigData.restoreDockerInfo))])],1),t._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:t.confirm}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]},w=o("C7Lr")(v,_,!1,null,null,null).exports,y={name:"OSDockerManage",components:{"pana-breadcrumb":n.a,"pana-start":r,"pana-shutoff":h,"pana-reboot":f,"pana-hang":b,"pana-restore":w},data:function(){return{operateValue:"",operateOptions:[{value:"reboot",label:this.lang.bigData.reboot},{value:"hang",label:this.lang.bigData.hang},{value:"restore",label:this.lang.bigData.restore}],multipleSelection:[],dataOrigin:[],selectedIds:[],search:"",page:1,pageSize:"10",showStart:!1,showShutoff:!1,showReboot:!1,showHang:!1,showRestore:!1}},watch:{search:function(){this.page=1}},computed:{tableFilter:function(){var t=this;return this.dataOrigin.filter(function(e){return""===t.search||-1!==s()(e).search(t.search)})},dataTable:function(){return this.tableFilter.length>this.pageSize?this.tableFilter.slice((this.page-1)*this.pageSize,this.page*this.pageSize):this.tableFilter},startDisabled:function(){return!!this.notSelect()||this.multipleSelection.some(function(t){return 3!==t.status})},shutoffDisabled:function(){return!!this.notSelect()||this.multipleSelection.some(function(t){return 1!==t.status})}},methods:{handleConsole:function(t){if(t){var e="http://"+window.location.hostname+":2222/ssh/host/"+t;window.open(e,t)}},pageSelect:function(t){this.page=t},sortChange:function(t){var e=null==t.order?0:"ascending"===t.order?1:-1;this.dataOrigin=this.dataOrigin.sort(function(o,a){return(o[t.prop]>a[t.prop]?1:-1)*e})},notSelect:function(){return this.multipleSelection.length<=0},statusClass:function(t){switch(t){case 1:return"cloud-success";case 2:return"cloud-error";case 3:return"cloud-fault";default:return"bg-blue"}},handleSelectionChange:function(t){var e=this;e.selectedIds=[],this.multipleSelection=t,this.multipleSelection.forEach(function(t){e.selectedIds.push(t.id)})},operateValueChange:function(){switch(this.operateValue){case"reboot":this.showReboot=!0;break;case"hang":this.showHang=!0;break;case"restore":this.showRestore=!0}this.operateValue=""},moreOperateDisabled:function(t){switch(t){case"reboot":case"hang":return this.multipleSelection.some(function(t){return 1!==parseInt(t.status)});case"restore":return this.multipleSelection.some(function(t){return 4!==parseInt(t.status)})}},getList:function(){var t=this,e=this.common.formatMsg(this.api.bigData.bigDataPoolContainers,{pool_id:this.$route.params.id});this.checkError(this.$http({url:e,methods:"get"}),function(e){t.dataOrigin=e.data})},closeStart:function(t){this.showStart=!1},closeShutoff:function(){this.showShutoff=!1},closeReboot:function(){this.showReboot=!1},closeHang:function(){this.showHang=!1},closeRestore:function(){this.showRestore=!1}},mounted:function(){var t=this;this.getList(),this.$ws.setCallback(function(e){if(-1!==t.wsEventQueue.indexOf(e.resource_id)){var o=e.event_type.split(".");"container"===o[1]&&"end"===o[3]&&t.getList()}})}},S={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-container",{attrs:{type:"flex",direction:"vertical"}},[o("pana-breadcrumb",{attrs:{back:!0}}),t._v(" "),o("el-main",[o("el-row",{staticClass:"pana-btn-group cloud-btn-row",attrs:{type:"flex",justify:"space-between"}},[o("el-col",{attrs:{span:12}},[o("el-button",{attrs:{disabled:t.startDisabled},on:{click:function(e){t.showStart=!0}}},[t._v("\n                    "+t._s(t.lang.bigData.start)+"\n                ")]),t._v(" "),o("el-button",{attrs:{disabled:t.shutoffDisabled},on:{click:function(e){t.showShutoff=!0}}},[t._v("\n                    "+t._s(t.lang.bigData.close)+"\n                ")]),t._v(" "),o("el-select",{staticClass:"more-operation",attrs:{disabled:t.notSelect(),placeholder:t.lang.common.moreOperation},on:{change:t.operateValueChange},model:{value:t.operateValue,callback:function(e){t.operateValue=e},expression:"operateValue"}},t._l(t.operateOptions,function(e){return o("el-option",{key:e.value,attrs:{disabled:t.moreOperateDisabled(e.value),label:e.label,value:e.value}})}),1)],1),t._v(" "),o("el-col",{attrs:{span:6}},[o("el-row",{staticClass:"search-row",attrs:{type:"flex",justify:"space-around"}},[o("el-col",{attrs:{span:22}},[o("el-input",{attrs:{placeholder:t.lang.common.search,"suffix-icon":"el-icon-search"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),t._v(" "),o("el-col",{attrs:{span:2}},[o("el-button",{staticClass:"fa fa-refresh",attrs:{type:"text",circle:""},on:{click:t.getList}})],1)],1)],1)],1),t._v(" "),o("el-table",{ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{data:t.dataTable,"tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange,"sort-change":t.sortChange}},[o("el-table-column",{attrs:{type:"selection"}}),t._v(" "),o("el-table-column",{attrs:{label:t.lang.common.name,sortable:"custom",prop:"hostname"}}),t._v(" "),o("el-table-column",{attrs:{sortable:"custom",label:t.lang.bigData.status},scopedSlots:t._u([{key:"default",fn:function(e){return[o("span",{staticClass:"status",class:t.statusClass(e.row.status)},[t._v("\n                        "+t._s(t.lang.bigData.dockerStatusValue[e.row.status])+"\n                    ")])]}}])}),t._v(" "),o("el-table-column",{attrs:{prop:"ip",sortable:"custom",label:t.lang.bigData.ip}}),t._v(" "),o("el-table-column",{attrs:{label:t.lang.bigData.createTime,sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                    "+t._s(e.row.create_time.replace(/T/g," ").replace(/\.[\d]*/,""))+"\n                ")]}}])}),t._v(" "),o("el-table-column",{attrs:{label:t.lang.bigData.physicalHost,sortable:"custom",prop:"locate"}}),t._v(" "),o("el-table-column",{attrs:{label:t.lang.common.operation,width:"300px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("el-button",{attrs:{type:"text",disabled:!e.row.console_enable},on:{click:function(o){return t.handleConsole(e.row.ip)}}},[t._v("\n                        "+t._s(t.lang.bigData.console)+"\n                    ")])]}}])})],1),t._v(" "),o("el-row",{staticClass:"pana-pagination-row",attrs:{type:"flex",justify:"end"}},[t.tableFilter.length>t.pageSize?o("el-pagination",{attrs:{background:"",layout:"slot, prev, pager, next","prev-text":t.lang.common.prevPage,"next-text":t.lang.common.nextPage,total:t.tableFilter.length},on:{"current-change":t.pageSelect}},[t._t("default",[o("span",{staticClass:"pagination-slot"},[t._v("\n                        "+t._s(t.common.formatMsg(t.lang.common.paginationMsg,{current:this.page,total:this.tableFilter.length}))+"\n                    ")])])],2):t._e()],1)],1),t._v(" "),o("pana-start",{attrs:{show:t.showStart,ids:t.selectedIds},on:{closeModal:t.closeStart,getList:t.getList}}),t._v(" "),o("pana-shutoff",{attrs:{show:t.showShutoff,ids:t.selectedIds},on:{closeModal:t.closeShutoff,getList:t.getList}}),t._v(" "),o("pana-reboot",{attrs:{show:t.showReboot,ids:t.selectedIds},on:{closeModal:t.closeReboot,getList:t.getList}}),t._v(" "),o("pana-hang",{attrs:{show:t.showHang,ids:t.selectedIds},on:{closeModal:t.closeHang,getList:t.getList}}),t._v(" "),o("pana-restore",{attrs:{show:t.showRestore,ids:t.selectedIds},on:{closeModal:t.closeRestore,getList:t.getList}})],1)},staticRenderFns:[]};var k=o("C7Lr")(y,S,!1,function(t){o("cKbz")},"data-v-16f04d53",null);e.default=k.exports},cKbz:function(t,e){}});