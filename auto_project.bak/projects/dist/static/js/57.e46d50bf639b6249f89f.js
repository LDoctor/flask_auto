webpackJsonp([57],{fhoo:function(e,t){},"gE/C":function(e,t){},nedn:function(e,t){},oFYa:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("3cXf"),s=a.n(o),l=a("1JPr"),n=a("aA9S"),r=a.n(n),i={name:"pana-create-obj",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,r()(this.$data,this.$options.data.call(this)),this.$emit("closeModal",e)},initForm:function(){null!=this.$refs.form&&this.$refs.form.clearValidate()},createObj:function(){var e=this,t=this.form;this.disable=!0,this.$refs.form.validate(function(a){a?e.checkError(e.$http({url:e.api.buckets.buckets,method:"post",data:t}),function(){e.$notify({title:e.lang.common.success,type:"success",message:e.lang.poolStorageObjShare.createObjSuccess}),e.closeModal(!0)},function(){e.disable=!1}):e.disable=!1})},validateObjectShareName:function(e,t,a){null==t||""===t||!0===/^[a-z0-9][a-z0-9\-.]*[a-z0-9]$/.test(t)&&!1===/^\d+\.\d+\.\d+\.\d+$/.test(t)?a():a(new Error(e.message))}},data:function(){return{labelWidth:"100px",form:{name:""},rules:{name:[{required:!0,message:this.lang.poolStorageObjShare.nameRequiredRule,trigger:"blur"},{min:3,max:63,message:this.lang.poolStorageObjShare.nameLengthRule,trigger:"blur"},{validator:this.validateObjectShareName,message:this.lang.poolStorageObjShare.nameFormatRule,trigger:"blur"}]},disable:!1}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.lang.poolStorageObjShare.createObj,width:"40%",visible:e.show,modal:!0},on:{open:e.initForm,close:e.closeModal}},[a("el-form",{ref:"form",attrs:{"label-position":"right",model:e.form,rules:e.rules}},[a("el-row",[a("el-col",{attrs:{span:22}},[a("el-form-item",{attrs:{label:e.lang.common.name,"label-width":e.labelWidth,prop:"name"}},[a("el-input",{attrs:{required:"",placeholder:e.lang.poolStorageObjShare.namePlaceholder},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.disable},on:{click:e.createObj}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]};var d=a("C7Lr")(i,c,!1,function(e){a("gE/C")},"data-v-328ac10e",null).exports,u={name:"pana-delete-obj",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,this.$emit("closeModal",e)},deleteObj:function(){this.closeModal(!0)}}},h={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.lang.common.info,visible:e.show,width:"30%",modal:!0},on:{close:e.closeModal}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:10}},[e._v(e._s(e.lang.poolStorageObjShare.confirmDeleteObjShare))])],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.deleteObj}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]},g=a("C7Lr")(u,h,!1,null,null,null).exports,b={name:"pana-create-obj",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,r()(this.$data,this.$options.data.call(this)),this.$emit("closeModal",e)},initForm:function(){null!=this.$refs.form&&this.$refs.form.clearValidate(),this.getObjectKeys()},getObjectKeys:function(){var e=this;this.loading=!0,this.checkError(this.$http({url:this.api.objectkeys.objectkeys,method:"get"}),function(t){e.form.access_key=t.data.accessKey,e.form.secret_key=t.data.secretKey,e.loading=!1},function(){e.loading=!1})},manageKey:function(){var e=this,t=this.form;this.disable=!0,this.$refs.form.validate(function(a){a?e.checkError(e.$http({url:e.api.objectkeys.objectkeys_configure,method:"post",data:t}),function(){e.$notify({title:e.lang.common.success,type:"success",message:e.lang.poolStorageObjShare.keyManageSuccess}),e.closeModal(!0)},function(){e.disable=!1}):e.disable=!1})},validateAccessKey:function(e,t,a){null==t||""===t||!0===/^[A-Za-z0-9_]*$/.test(t)?a():a(new Error(e.message))}},data:function(){return{labelWidth:"100px",loading:!1,form:{access_key:"",secret_key:""},rules:{access_key:[{required:!0,message:this.lang.poolStorageObjShare.itemRequiredRule,trigger:"blur"},{min:3,max:64,message:this.lang.poolStorageObjShare.accessKeyLengthRule,trigger:"blur"},{validator:this.validateAccessKey,message:this.lang.poolStorageObjShare.accessKeyFormatRule,trigger:"blur"}],secret_key:[{required:!0,message:this.lang.poolStorageObjShare.itemRequiredRule,trigger:"blur"},{min:8,max:128,message:this.lang.poolStorageObjShare.secretKeyLengthRule,trigger:"blur"}]},disableAccessKey:!0,disableSecretKey:!0,showAccessKey:!0,showSecretKey:!0,disable:!1}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.lang.poolStorageObjShare.keysManage,width:"40%",visible:e.show,modal:!0},on:{open:e.initForm,close:e.closeModal}},[a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{"label-position":"right",model:e.form,rules:e.rules,"element-loading-text":e.lang.common.loading,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255, 255, 255)"}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.poolStorageObjShare.accessKey,"label-width":e.labelWidth,prop:"access_key"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{type:!0===e.showAccessKey?"password":"text",readonly:e.disableAccessKey,placeholder:e.lang.poolStorageObjShare.itemPlaceholder},model:{value:e.form.access_key,callback:function(t){e.$set(e.form,"access_key",t)},expression:"form.access_key"}},[a("i",{class:["fa",!0===e.showAccessKey?"fa-eye-slash":"fa-eye"].join(" "),attrs:{slot:"suffix"},on:{click:function(t){e.showAccessKey=!e.showAccessKey}},slot:"suffix"})])],1),e._v(" "),a("el-button",{staticStyle:{"margin-left":"10px"},attrs:{type:"default",plain:""},on:{click:function(t){e.disableAccessKey=!e.disableAccessKey}}},[e._v("\n                            "+e._s(e.lang.common.update)+"\n                        ")])],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.poolStorageObjShare.secretKey,"label-width":e.labelWidth,prop:"secret_key"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{type:!0===e.showSecretKey?"password":"text",readonly:e.disableSecretKey,placeholder:e.lang.poolStorageObjShare.itemPlaceholder},model:{value:e.form.secret_key,callback:function(t){e.$set(e.form,"secret_key",t)},expression:"form.secret_key"}},[a("i",{class:["fa",!0===e.showSecretKey?"fa-eye-slash":"fa-eye"].join(" "),attrs:{slot:"suffix"},on:{click:function(t){e.showSecretKey=!e.showSecretKey}},slot:"suffix"})])],1),e._v(" "),a("el-button",{staticStyle:{"margin-left":"10px"},attrs:{type:"default",plain:""},on:{click:function(t){e.disableSecretKey=!e.disableSecretKey}}},[e._v("\n                            "+e._s(e.lang.common.update)+"\n                        ")])],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.disable},on:{click:e.manageKey}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]};var p=a("C7Lr")(b,m,!1,function(e){a("fhoo")},"data-v-003b0229",null).exports,f={name:"file-share",components:{"pana-breadcrumb":l.a,"pana-create-obj":d,"pana-delete-obj":g,"pana-key-manage":p},data:function(){return{showShadow:!1,pageSize:10,objSearch:"",objOrigin:[],objSelectionNames:[],objPage:1,showCreateObj:!1,showDeleteObj:!1,showKeyManage:!1,currentSelectObjs:[],disableDeleteMessage:this.lang.poolStorageObjShare.noneSeletion,denyDelete:!0,loading:!1}},computed:{objFilter:function(){var e=this;return this.objOrigin.filter(function(t){return""===e.objSearch||-1!==s()(t).search(e.objSearch)})},objTable:function(){return this.objFilter.length>this.pageSize?this.objFilter.slice((this.objPage-1)*this.pageSize,this.objPage*this.pageSize):this.objFilter}},watch:{currentSelectObjs:function(){var e=this,t=[];if(0===this.currentSelectObjs.length)this.denyDelete=!0,this.disableDeleteMessage=this.lang.poolStorageObjShare.noneSeletion;else{var a=!0;this.currentSelectObjs.map(function(o){!1===o.is_empty&&(a=!1),!1===a?(e.denyDelete=!0,e.disableDeleteMessage=e.lang.poolStorageObjShare.hasUsedSelection):(e.denyDelete=!1,e.disableDeleteMessage=""),t.push(o.name)})}},objSearch:function(){this.objPage=1}},methods:{switchObjPage:function(e){this.objPage=e},sortChange:function(e){var t=null==e.order?0:"ascending"===e.order?1:-1;this.objOrigin=this.objOrigin.sort(function(a,o){return a[e.prop]=null==a[e.prop]?"":a[e.prop],o[e.prop]=null==o[e.prop]?"":o[e.prop],(a[e.prop]>o[e.prop]?1:-1)*t})},closeCreateObj:function(e){!0===e&&this.getObjList(),this.showCreateObj=!1},closeDeleteObj:function(e){var t=this;this.showDeleteObj=!1,!0===e&&this.checkError(this.$http({url:this.api.buckets.buckets_batch_delete,method:"post",data:{buckets:this.objSelectionNames}}),function(){t.$notify({title:t.lang.common.success,type:"success",message:t.lang.poolStorageObjShare.deleteObjSuccess}),t.getObjList()})},getObjList:function(){var e=this;this.loading=!0,this.checkError(this.$http({url:this.api.buckets.buckets,method:"get"}),function(t){e.loading=!1,null==t.data?e.showShadow=!0:e.objOrigin=t.data},function(){e.loading=!1})},selectObjNames:function(e){this.currentSelectObjs=e;var t=[];e.forEach(function(e){t.push(e.name)}),this.objSelectionNames=t}},mounted:function(){this.getObjList()}},j={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"parent-div"},[a("el-container",{attrs:{type:"flex",direction:"vertical"}},[a("pana-breadcrumb",{attrs:{changePool:!0,callback:e.getObjList}}),e._v(" "),a("el-main",[a("el-row",{staticClass:"pana-btn-group",attrs:{type:"flex",justify:"space-between"}},[a("el-col",{attrs:{span:12}},[a("el-button",{attrs:{type:"primary",disabled:e.loading},on:{click:function(t){e.showCreateObj=!0}}},[e._v("\n                        "+e._s(e.lang.common.create)+"\n                    ")]),e._v(" "),a("el-button",{attrs:{disabled:e.loading||e.denyDelete},on:{click:function(t){e.showDeleteObj=!0}}},[!0===e.denyDelete?a("el-tooltip",{attrs:{content:e.disableDeleteMessage,placement:"top"}},[a("span",[e._v("\n                                "+e._s(e.lang.common.delete)+"\n                            ")])]):a("span",[e._v("\n                            "+e._s(e.lang.common.delete)+"\n                        ")])],1),e._v(" "),a("el-button",{attrs:{disabled:e.loading},on:{click:function(t){e.showKeyManage=!0}}},[e._v("\n                        "+e._s(e.lang.poolStorageObjShare.keysManage)+"\n                    ")])],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-row",{staticClass:"search-row",attrs:{type:"flex",justify:"space-around"}},[a("el-col",{attrs:{span:22}},[a("el-input",{attrs:{placeholder:e.lang.common.search,"suffix-icon":"el-icon-search"},model:{value:e.objSearch,callback:function(t){e.objSearch=t},expression:"objSearch"}})],1),e._v(" "),a("el-col",{attrs:{span:2}},[a("el-button",{staticClass:"fa fa-refresh",attrs:{type:"text",circle:""},on:{click:e.getObjList}})],1)],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{"element-loading-text":e.lang.common.loading,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255, 255, 255)",data:e.objTable,"tooltip-effect":"dark"},on:{"selection-change":e.selectObjNames,"sort-change":e.sortChange}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.poolStorageObjShare.shareName,sortable:"custom",prop:"name","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.poolStorageObjShare.accessAddress,sortable:"custom","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.address,function(t,o){return a("div",{key:o},[e._v("\n                            "+e._s(t)+"\n                        ")])})}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.poolStorageObjShare.createTime,sortable:"custom",prop:"time"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                        "+e._s(e._f("utc2beijing")(t.row.time))+"\n                    ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.poolStorageObjShare.shareStatus,sortable:"custom",prop:"is_empty"},scopedSlots:e._u([{key:"default",fn:function(t){return[!1===t.row.is_empty?a("span",{staticClass:"status cloud-default"},[e._v("\n                        "+e._s(e.lang.poolStorageObjShare.used)+"\n                    ")]):a("span",{staticClass:"status cloud-info"},[e._v("\n                        "+e._s(e.lang.poolStorageObjShare.unused)+"\n                    ")])]}}])})],1),e._v(" "),a("el-row",{staticClass:"pana-pagination-row",attrs:{type:"flex",justify:"end"}},[e.objFilter.length>e.pageSize?a("el-pagination",{attrs:{background:"",layout:"slot, prev, pager, next","prev-text":e.lang.common.prevPage,"next-text":e.lang.common.nextPage,total:e.objFilter.length,"page-size":e.pageSize},on:{"current-change":e.switchObjPage}},[e._t("default",[a("span",{staticClass:"pagination-slot"},[e._v("\n                            "+e._s(e.common.formatMsg(e.lang.common.paginationMsg,{current:this.objPage,total:this.objFilter.length}))+"\n                        ")])])],2):e._e()],1)],1),e._v(" "),a("pana-create-obj",{attrs:{show:e.showCreateObj},on:{closeModal:e.closeCreateObj}}),e._v(" "),a("pana-delete-obj",{attrs:{show:e.showDeleteObj},on:{closeModal:e.closeDeleteObj}}),e._v(" "),a("pana-key-manage",{attrs:{show:e.showKeyManage},on:{closeModal:function(t){e.showKeyManage=!1}}})],1),e._v(" "),e.showShadow?a("div",{staticClass:"none-service"},[a("div",{staticClass:"info"},[e._v(e._s(e.lang.poolStorageObjShare.noneServiceInfo))])]):e._e()],1)},staticRenderFns:[]};var y=a("C7Lr")(f,j,!1,function(e){a("nedn")},"data-v-8ea92e08",null);t.default=y.exports}});