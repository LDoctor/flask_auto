webpackJsonp([85],{"0OUl":function(e,t){},K5Gg:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s("1JPr"),a={name:"pana-startService",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,this.$emit("closeModal",e)},startService:function(){this.closeModal(!0)}}},r={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{attrs:{title:e.lang.common.info,visible:e.show,width:"30%",modal:!0},on:{close:e.closeModal}},[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{span:10}},[e._v(e._s(e.lang.serviceManage.isstart))])],1),e._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:e.startService}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]},n=s("C7Lr")(a,r,!1,null,null,null).exports,i={name:"pana-stopService",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,this.$emit("closeModal",e)},stopService:function(){this.closeModal(!0)}}},l={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{attrs:{title:e.lang.common.info,visible:e.show,width:"30%",modal:!0},on:{close:e.closeModal}},[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{span:10}},[e._v(e._s(e.lang.serviceManage.isstop))])],1),e._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:e.stopService}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]},c=s("C7Lr")(i,l,!1,null,null,null).exports,v={name:"pana-configService",props:{show:Boolean},data:function(){return{labelWidth:"120px",rules:{workgroup:[{required:!0,message:this.lang.serviceManage.placeworkGroup,trigger:"blur"},{validator:this.common.validateWorkGroup,trigger:"blur"}]},form:{workgroup:"",description:""}}},methods:{closeModal:function(e){e=e||!1,this.$emit("closeModal",e)},configService:function(){var e=this,t=this;this.$refs.form.validate(function(s){s&&e.checkError(e.$http({url:e.api.serviceManage.congifservice,method:"post",data:e.form}),function(e){t.$notify({title:t.lang.common.success,type:"success",message:"配置服务成功"}),t.closeModal(!0)})})},getcifsDetail:function(){var e=this;this.checkError(this.$http({url:this.api.serviceManage.getcfs_config,method:"get"}),function(t){e.form.workgroup=t.data.workgroup,e.form.description=t.data["server string"]})},initForm:function(){null!=this.$refs.form&&this.$refs.form.clearValidate(),this.getcifsDetail()}}},p={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{attrs:{title:e.lang.serviceManage.configCIFS,width:"45%",visible:e.show,modal:!0},on:{open:e.initForm,close:e.closeModal}},[s("el-form",{ref:"form",attrs:{"label-position":"right",model:e.form,rules:e.rules}},[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{span:20}},[s("el-form-item",{attrs:{label:e.lang.serviceManage.workingGroup,"label-width":e.labelWidth,prop:"workgroup"}},[s("el-col",{attrs:{span:16}},[s("el-input",{attrs:{required:""},model:{value:e.form.workgroup,callback:function(t){e.$set(e.form,"workgroup",t)},expression:"form.workgroup"}})],1)],1)],1)],1),e._v(" "),s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{attrs:{span:20}},[s("el-form-item",{attrs:{label:e.lang.common.description,"label-width":e.labelWidth,prop:"description"}},[s("el-col",{attrs:{span:16}},[s("el-input",{attrs:{type:"textarea"},model:{value:e.form.description,callback:function(t){e.$set(e.form,"description",t)},expression:"form.description"}})],1)],1)],1)],1)],1),e._v(" "),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:e.configService}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]},u=s("C7Lr")(v,p,!1,null,null,null).exports,g={name:"serviceList",components:{"pana-breadcrumb":o.a,"pana-start-service":n,"pana-stop-service":c,"pana-config-service":u},data:function(){return{startService:!0,stopService:!0,tableData:[],startServiceNames:[],stopServiceNames:[],showStartService:!1,showStopService:!1,showConfigService:!1,selectedName:"",serviceStatus:{true:{class:"running",text:this.lang.serviceManage.running},false:{class:"stoped",text:this.lang.serviceManage.stoped}},loading:!1}},methods:{getServiceList:function(){var e=this;this.loading=!0,this.checkError(this.$http({url:this.api.serviceManage.getservice_list,method:"get"}),function(t){e.loading=!1,e.tableData=t.data},function(){e.loading=!1})},selectService:function(e){var t=[],s=[];e.forEach(function(e){!1===e.status?t.push(e.name.toLowerCase()):s.push(e.name.toLowerCase())}),this.startServiceNames=t,this.stopServiceNames=s},closeStart:function(e){var t=this,s=[];this.showStartService=!1,!0===e&&(s=this.startServiceNames,this.checkError(this.$http({url:this.api.serviceManage.startservice,method:"post",data:{services:s}}),function(){t.$notify({title:t.lang.common.success,type:"success",message:"启动成功"}),t.getServiceList()}))},closeStop:function(e){var t=this,s=[];this.showStopService=!1,!0===e&&(s=this.stopServiceNames,this.checkError(this.$http({url:this.api.serviceManage.stopservice,method:"post",data:{services:s}}),function(){t.$notify({title:t.lang.common.success,type:"success",message:"停止服务成功"}),t.getServiceList()}))},closeConfigService:function(e){!0===e&&this.getServiceList(),this.showConfigService=!1}},mounted:function(){this.getServiceList()}},m={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-container",{attrs:{type:"flex",direction:"vertical"}},[s("pana-breadcrumb",{attrs:{moduleName:"storage",changePool:!0,callback:e.getServiceList}}),e._v(" "),s("el-main",[s("el-row",{staticClass:"pana-btn-group",attrs:{type:"flex",justify:"space-between"}},[s("el-col",[s("el-button",{attrs:{type:"primary",disabled:0===e.startServiceNames.length||e.stopServiceNames.length>0&&e.startServiceNames.length>0},on:{click:function(t){e.showStartService=!0}}},[0===e.startServiceNames.length||e.stopServiceNames.length>0&&e.startServiceNames.length>0?s("div",[s("el-tooltip",{attrs:{content:e.lang.serviceManage.startcondtion,placement:"top"}},[s("div",[e._v(e._s(e.lang.serviceManage.startService))])])],1):s("div",[e._v("\n                        "+e._s(e.lang.serviceManage.startService)+"\n                    ")])]),e._v(" "),s("el-button",{attrs:{disabled:0===e.stopServiceNames.length||e.startServiceNames.length>0&&e.stopServiceNames.length>0},on:{click:function(t){e.showStopService=!0}}},[0===e.stopServiceNames.length||e.startServiceNames.length>0&&e.stopServiceNames.length>0?s("div",[s("el-tooltip",{attrs:{content:e.lang.serviceManage.stopcondtion,placement:"top"}},[s("div",[e._v(e._s(e.lang.serviceManage.stopService))])])],1):s("div",[e._v("\n                        "+e._s(e.lang.serviceManage.stopService)+"\n                    ")])])],1)],1),e._v(" "),s("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{"element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(255, 255, 255, 0.8)",data:e.tableData},on:{"selection-change":e.selectService}},[s("el-table-column",{attrs:{type:"selection",width:"45"}}),e._v(" "),s("el-table-column",{attrs:{prop:"name",label:e.lang.serviceManage.serviceName}}),e._v(" "),s("el-table-column",{attrs:{label:e.lang.serviceManage.serviceStatus},scopedSlots:e._u([{key:"default",fn:function(t){return[s("span",{class:["status",e.serviceStatus[t.row.status].class]},[e._v("\n                        "+e._s(e.serviceStatus[t.row.status].text)+"\n                    ")])]}}])}),e._v(" "),s("el-table-column",{attrs:{label:e.lang.common.operation,width:"300px"},scopedSlots:e._u([{key:"default",fn:function(t){return["CIFS"===t.row.name?s("el-button",{attrs:{type:"text"},on:{click:function(t){e.showConfigService=!0}}},[e._v("\n                        "+e._s(e.lang.serviceManage.configService)+"\n                    ")]):e._e(),e._v(" "),"CIFS"!==t.row.name?s("el-button",{attrs:{type:"text",disabled:""}},[e._v("\n                        "+e._s(e.lang.serviceManage.configService)+"\n                    ")]):e._e()]}}])})],1)],1),e._v(" "),s("pana-start-service",{attrs:{show:e.showStartService},on:{closeModal:e.closeStart}}),e._v(" "),s("pana-stop-service",{attrs:{show:e.showStopService},on:{closeModal:e.closeStop}}),e._v(" "),s("pana-config-service",{attrs:{show:e.showConfigService},on:{closeModal:e.closeConfigService}})],1)},staticRenderFns:[]};var d=s("C7Lr")(g,m,!1,function(e){s("0OUl")},"data-v-7046372d",null);t.default=d.exports}});