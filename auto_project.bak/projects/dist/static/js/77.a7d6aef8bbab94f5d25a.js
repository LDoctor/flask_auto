webpackJsonp([77],{"B+rd":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={components:{"pana-breadcrumb":a("1JPr").a},data:function(){return{upgradeVersion:"",currentVersion:"",uploadProgressShow:!1,detailDisable:!0,form:{fileName:""},rules:{fileName:[{required:!0,message:this.lang.common.required_item,trigger:"change"}]},active:1,uploadPercentage:0,percentage:0,targetPercentage:5,detailIndex:0,detail:[],upgradeProgress:""}},methods:{handleChange:function(e){this.form.fileName=e.name},uploadFile:function(e){this.file=e.file},showUploadProgressPage:function(){var e=this;e.$refs.form.validate(function(t){if(!t)return!1;var a=new FormData;a.append("file",e.file),e.checkError(e.$http({url:e.api.management.upgrade_upload,method:"post",data:a,headers:{"Content-Type":"multipart/form-data"},onUploadProgress:function(t){t.lengthComputable&&(e.uploadPercentage=t.loaded/t.total*100|0)}}),function(t){e.detailDisable=!1},function(){}),e.uploadProgressShow=!0})},showUploadDetailPage:function(){this.getDetail(),this.active=2},getDetail:function(){var e=this;this.checkError(this.$http({url:this.api.management.upgrade_details,method:"get"}),function(t){e.detail=t.data.details,e.upgradeVersion=t.data.version,e.currentVersion=t.data.current_version})},showProgressPage:function(){var e=this,t=window.btoa(1e4*Math.random()+(new Date).getTime());this.active=3,this.checkError(this.$http({url:this.api.management.upgrade_start,method:"post",data:{id:t}}),function(){e.wsEventQueue.push(t),e.setPercentage()})},setPercentage:function(){var e=this;this.$ws.setCallback(function(t){var a=e.wsEventQueue.indexOf(t.resource_id);if(-1!==a){var r=t.event_type.split(".");if("udsafe"===r[0]&&"upgrade"===r[2])switch(r[3]){case"progress":e.percentage=t.payload.percentage,e.upgradeProgress=t.payload.message;break;case"end":e.percentage=100,e.active=4,e.reboot(),e.wsEventQueue.splice(a,1)}}})},reboot:function(){var e=this;this.checkError(this.$http({url:this.api.management.upgrade_reboot,method:"POST"}),function(t){e.$notify({title:e.lang.common.success,type:"success",message:e.lang.onlineUpgrade.rebootStart})})},detailChange:function(){var e=this.detail.length;this.detailIndex===e-1?this.detailIndex=0:this.detailIndex++},validateFiletype:function(e,t,a){var r=this.form.fileName,i=r.lastIndexOf("."),s=r.substring(i+1);-1===this.uploadFileType.indexOf(s)?a(new Error(this.lang.auditLog.importLogType)):a()}},mounted:function(){}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-container",{attrs:{type:"flex",direction:"vertical"}},[a("pana-breadcrumb",{attrs:{back:!0}}),e._v(" "),a("el-main",[a("el-steps",{attrs:{active:e.active}},[a("el-step",{attrs:{title:e.lang.onlineUpgrade.uploadUpgrade}}),e._v(" "),a("el-step",{attrs:{title:e.lang.onlineUpgrade.showUpgradeDetail}}),e._v(" "),a("el-step",{attrs:{title:e.lang.onlineUpgrade.startUpgrade}}),e._v(" "),a("el-step",{attrs:{title:e.lang.onlineUpgrade.rebootSystem}})],1),e._v(" "),a("el-card",{staticClass:"box-card"},[a("el-form",{directives:[{name:"show",rawName:"v-show",value:1===e.active&&!e.uploadProgressShow,expression:"active===1 && !uploadProgressShow"}],ref:"form",attrs:{id:"upload-upgrade",model:e.form,"label-width":"104px",rules:e.rules}},[a("el-form-item",{attrs:{prop:"fileName"}},[a("el-upload",{attrs:{action:"","before-upload":e.handleChange,"http-request":e.uploadFile,"show-file-list":!1}},[a("el-input",{attrs:{placeholder:""},model:{value:e.form.fileName,callback:function(t){e.$set(e.form,"fileName",t)},expression:"form.fileName"}},[a("template",{slot:"append"},[e._v(e._s(e.lang.onlineUpgrade.uploadUpgrade))])],2)],1)],1),e._v(" "),a("div",{staticClass:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.showUploadProgressPage}},[e._v(e._s(e.lang.common.nextStep))])],1)],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:1===e.active&&e.uploadProgressShow,expression:"active===1 && uploadProgressShow"}]},[a("div",{staticClass:"header"},[e.detailDisable?a("h4",[e._v(e._s(e.lang.onlineUpgrade.uploadingUpgrade))]):a("h4",[e._v(e._s(e.lang.onlineUpgrade.uploadComplete))])]),e._v(" "),a("div",{staticClass:"content-center"},[a("el-progress",{attrs:{"show-text":!1,"stroke-width":10,type:"circle",percentage:e.uploadPercentage}}),e._v(" "),a("div",{staticClass:"el-progress--circle"},[a("div",{staticClass:"el-progress__text",staticStyle:{"font-size":"16px"}},[e._v("\n                            上传进度\n                            "),a("div",{staticClass:"upload-percentage"},[e._v(e._s(e.uploadPercentage)+"%")])])])],1),e._v(" "),a("div",{staticClass:"footer"},[a("el-button",{attrs:{type:"primary",disabled:e.detailDisable},on:{click:e.showUploadDetailPage}},[e._v(e._s(e.lang.onlineUpgrade.openUpgrade))])],1)]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:2===e.active,expression:"active===2"}]},[a("div",{staticClass:"header"},[a("h4",[e._v("筋斗云"+e._s(e.upgradeVersion))]),e._v(" "),a("p",[e._v("当前版本"+e._s(e.currentVersion))]),a("p")]),e._v(" "),e.detail.length>0?a("p",{staticStyle:{"margin-left":"20px"}},[e._v(e._s(e.lang.onlineUpgrade.upgradeDetail)+" :")]):e._e(),e._v(" "),e.detail.length>0?a("div",{staticClass:"detail-content"},[a("div",[e._v("\n                        【"+e._s(e.detail[e.detailIndex].title)+"】\n                        "),a("ol",e._l(e.detail[e.detailIndex].content,function(t,r){return a("li",{key:r},[e._v("\n                                "+e._s(t)+"\n                            ")])}),0)]),e._v(" "),a("div",{staticClass:"detail-content-arrow"},[a("img",{staticClass:"arrow-right",attrs:{src:"/static/image/arrow-right.png",alt:""},on:{click:e.detailChange}})])]):e._e(),e._v(" "),a("div",{staticClass:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.showProgressPage}},[e._v(e._s(e.lang.onlineUpgrade.upgradeImmediate))])],1)]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:3===e.active,expression:"active===3"}],attrs:{id:"update-progress"}},[a("div",{staticClass:"header"},[a("h4",[e._v("正在升级筋斗云"+e._s(e.upgradeVersion))]),e._v(" "),a("p",[e._v(e._s(e.lang.onlineUpgrade.upgradingTip))]),a("p"),e._v(" "),a("p",[e._v(e._s(e.upgradeProgress))])]),e._v(" "),a("div",{staticClass:"content-center"},[a("el-progress",{attrs:{width:200,"stroke-width":20,type:"circle",percentage:e.percentage}})],1)]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:4===e.active,expression:"active===4"}],attrs:{id:"update-finish"}},[a("div",{staticClass:"content-center"},[a("i",{staticClass:"el-icon-circle-check"}),e._v(" "),a("p",{staticStyle:{}},[e._v(e._s(e.lang.onlineUpgrade.upgradeSuccess))]),e._v(" "),a("p",{staticClass:"reboot-tip"},[e._v(e._s(e.lang.onlineUpgrade.rebootTip))])])])],1)],1)],1)},staticRenderFns:[]};var s=a("C7Lr")(r,i,!1,function(e){a("Qlr2"),a("C3Te")},"data-v-0c25f9b7",null);t.default=s.exports},C3Te:function(e,t){},Qlr2:function(e,t){}});