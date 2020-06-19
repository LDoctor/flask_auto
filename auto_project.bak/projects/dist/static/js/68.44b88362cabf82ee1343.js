webpackJsonp([68],{"5pnF":function(t,e){},L7w6:function(t,e){},WPpj:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("3cXf"),s=a.n(n),r=a("1JPr"),o={name:"pana-edit-switch",props:{show:Boolean,editData:Object},data:function(){return{labelWidth:"120px",editBtn:!1,form:{switchName:"",ip:""},rules:{switchName:[{required:!0,message:this.lang.switchManage.required,trigger:"blur"},{validator:this.checkData,message:this.lang.switchManage.allowedNot,trigger:"blur"}]}}},methods:{closeModal:function(t){this.$emit("closeModal",!1)},initForm:function(){this.$refs.form&&this.$refs.form.resetFields(),this.editBtn=!1,this.form.switchName=this.editData.switchName,this.form.ip=this.editData.ip},checkData:function(t,e,a){e&&(/[\u4E00-\u9FA5\s]/g.test(e)?a(new Error(t.message)):a()),a()},createPort:function(){var t=this,e=this;e.$refs.form.validate(function(a){a&&(e.editBtn=!0,t.checkError(t.$http({url:e.api.systemManage.put_switch_list,data:{switch_name:e.form.switchName,switch_ip:e.form.ip},params:{switch_ip:e.form.ip},method:"put"}),function(t){e.$emit("closeModal",!0),e.$notify({title:e.lang.common.success,type:"success",message:e.lang.switchManage.checkSuccess})},function(t){}))})}}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:t.lang.switchManage.check,width:"30%",visible:t.show,modal:!0},on:{open:t.initForm,close:t.closeModal}},[a("el-form",{ref:"form",attrs:{"label-position":"right",rules:t.rules,model:t.form}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:t.lang.switchManage.switchName,"label-width":t.labelWidth,prop:"switchName"}},[a("el-col",{attrs:{span:20}},[a("el-input",{attrs:{maxlength:32,placeholder:t.lang.switchManage.switchNamePlz},model:{value:t.form.switchName,callback:function(e){t.$set(t.form,"switchName",e)},expression:"form.switchName"}})],1)],1)],1)],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:t.closeModal}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),a("el-button",{attrs:{type:"primary",disabled:t.editBtn},on:{click:t.createPort}},[t._v(t._s(t.lang.common.confirm))])],1)],1)},staticRenderFns:[]};var l=a("C7Lr")(o,i,!1,function(t){a("5pnF")},"data-v-99e32a26",null).exports,c={name:"pana-switch-manager",components:{"pana-breadcrumb":r.a,"pana-edit":l},data:function(){return{pageSize:10,currentPage:1,total:0,specSearch:"",sortOrder:0,sortProp:"",showEdit:!1,loading:!1,editData:{},typeTag:["cloudDisk-restart","cloudDisk-running","cloudDisk-stop"],tableData:[],selectName:[]}},methods:{sortChange:function(t){var e=null==t.order?0:"ascending"===t.order?1:-1;this.sortProp=t.prop,this.sortOrder=e,this.tableData=this.tableData.sort(function(a,n){return a[t.prop]=null==a[t.prop]?"":a[t.prop],n[t.prop]=null==n[t.prop]?"":n[t.prop],(a[t.prop]>n[t.prop]?1:-1)*e})},getList:function(){var t=this;t.loading=!0,this.checkError(this.$http({url:t.api.systemManage.get_switch_list,method:"get"}),function(e){var a=[];e.data.map(function(t,e){a[e]={switchName:t.switch_name,devSserialNumber:t.serial_number,type:t.status,ip:t.ip_addr,mac:t.mac_addr,rate:t.speed}}),t.tableData=a,t.loading=!1},function(e){t.loading=!1})},scanPost:function(){var t=this;this.checkError(this.$http({url:t.api.systemManage.post_switch_list,method:"post"}),function(e){t.getList(),t.$notify({title:t.lang.common.success,type:"success",message:t.lang.switchManage.scanSuccess})},function(t){})},editPut:function(t){this.editData=t,this.showEdit=!0},closeEdit:function(t){t&&this.getList(),this.showEdit=!1},selectSwitchMan:function(t){var e=[];t.map(function(t){e.push(t.portName)}),this.selectName=e},handleSizeChange:function(t){this.pageSize=t},handleCurrentChange:function(t){this.currentPage=t}},mounted:function(){this.getList()},computed:{filterData:function(){var t=this;return t.tableData.filter(function(e,a){return""===t.specSearch||(t.currentPage=1,-1!==s()(e).search(t.specSearch))}).sort(function(e,a){return e[t.sortProp]=null==e[t.sortProp]?"":e[t.sortProp],a[t.sortProp]=null==a[t.sortProp]?"":a[t.sortProp],(e[t.sortProp]>a[t.sortProp]?1:-1)*t.sortOrder})},laterData:function(){return this.filterData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",{attrs:{type:"flex",direction:"vertical"}},[a("pana-breadcrumb"),t._v(" "),a("el-main",[a("el-row",{staticClass:"pana-btn-group",attrs:{type:"flex",justify:"space-between"}},[a("el-col",{attrs:{span:12}},[a("el-button",{attrs:{type:"primary"},on:{click:t.scanPost}},[t._v("\n                    "+t._s(t.lang.switchManage.scanning)+"\n                ")])],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("el-row",{staticClass:"search-row",attrs:{type:"flex",justify:"space-around"}},[a("el-col",{attrs:{span:22}},[a("el-input",{attrs:{placeholder:t.lang.common.search,"suffix-icon":"el-icon-search"},model:{value:t.specSearch,callback:function(e){t.specSearch=e},expression:"specSearch"}})],1),t._v(" "),a("el-col",{attrs:{span:2}},[a("el-button",{staticClass:"fa fa-refresh",attrs:{type:"text",circle:""},on:{click:t.getList}})],1)],1)],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{"element-loading-text":t.lang.common.loading,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255, 255, 255)",data:t.laterData,"tooltip-effect":"dark"},on:{"selection-change":t.selectSwitchMan,"sort-change":t.sortChange}},[a("el-table-column",{attrs:{type:"selection"}}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.switchName,sortable:"custom",prop:"switchName"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"cloud-speed",on:{click:function(a){return t.$router.push({path:"/systemManage/switchManage/switchTab/"+e.row.ip})}}},[t._v("\n                        "+t._s(e.row.switchName)+"\n                    ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.devSserialNumber,prop:"devSserialNumber",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v("\n                        "+t._s(e.row.devSserialNumber)+"\n                    ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.ip,sortable:"custom",prop:"ip"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v("\n                        "+t._s(e.row.ip)+"\n                    ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.mac,sortable:"custom",prop:"mac"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                    "+t._s(e.row.mac)+"\n                ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.rate},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v("\n                     "+t._s(e.row.rate)+"\n                    ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.type,sortable:"custom",prop:"type"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"cloudDisk",class:t.typeTag[e.row.type]},[t._v("\n                        "+t._s(t.lang.switchManage.typeText[e.row.type])+"  \n                    ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:t.lang.switchManage.operate},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"cloud-speed",on:{click:function(a){return t.editPut(e.row)}}},[t._v("\n                        "+t._s(t.lang.switchManage.check)+"\n                    ")])]}}])})],1),t._v(" "),a("el-row",{staticClass:"pana-pagination-row",attrs:{type:"flex",justify:"end"}},[t.filterData.length>t.pageSize?a("el-pagination",{attrs:{"current-page":t.currentPage,background:"",layout:"slot, prev, pager, next","page-size":t.pageSize,"prev-text":t.lang.common.prevPage,"next-text":t.lang.common.nextPage,total:t.filterData.length},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}},[t._t("default",[a("span",{staticClass:"pagination-slot"},[t._v("\n                        "+t._s(t.common.formatMsg(t.lang.common.paginationMsg,{current:this.currentPage,total:this.tableData.length}))+"\n                    ")])])],2):t._e()],1),t._v(" "),a("pana-edit",{attrs:{show:t.showEdit,editData:t.editData},on:{closeModal:t.closeEdit}})],1)],1)},staticRenderFns:[]};var p=a("C7Lr")(c,u,!1,function(t){a("L7w6")},"data-v-f079ea20",null);e.default=p.exports}});