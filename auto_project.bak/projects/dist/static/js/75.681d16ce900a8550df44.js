webpackJsonp([75],{"0s6z":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a("3cXf"),r=a.n(o),i=a("rVsN"),n=a.n(i),l={data:function(){return{disable:!1,loading:!0,page1:!0,cpuTotal:"",currentGpuQuota:"",poolGpuAvail:"",memoryTotal:"",cpuUsed:"",memoryUsed:"",memoryAvail:0,cpuAvail:0,gpu:{availNum:"",totalNum:""},updateForm:{name:"",cpu_limit:"",memory_limit:"",description:""},id:"",rules:{name:[{required:!0,message:this.lang.common.required_item,trigger:"blur"},{min:1,max:30,message:this.lang.common.validateLength30,trigger:"blur"},{validator:this.common.validateName2,trigger:"blur"},{validator:this.validateNameExist,trigger:"blur"}],cpu_limit:[{required:!0,message:this.lang.common.required_item,trigger:"blur"},{validator:this.common.validateIntegerType,message:this.lang.resource.integerRule,trigger:"blur"},{validator:this.validateCpu,trigger:"blur"}],memory_limit:[{required:!0,message:this.lang.common.required_item,trigger:"blur"},{validator:this.common.validateIntegerType,message:this.lang.resource.integerRule,trigger:"blur"},{validator:this.validateMemory,trigger:"blur"}],gpu_quota:[{validator:this.validateGpu,trigger:"blur"},{validator:this.common.validateIntegerType,message:this.lang.resource.integerRule,trigger:"blur"}],description:[{min:0,max:100,message:"不能超过100个字符",trigger:"blur"}]},poolNames:[],currentPoolName:""}},mounted:function(){this.id=this.$route.params.id;var t=this,e=this.common.formatMsg(this.api.cloud.get_pools_detail,{pool_id:this.id}),a=new n.a(function(a,o){t.checkError(t.$http({url:e,method:"get"}),function(e){t.updateForm=e.data,t.currentPoolName=e.data.name,t.currentGpuQuota=t.updateForm.gpu_quota,t.updateForm.memory_limit=t.common.switchCapacity(t.updateForm.memory_limit,"MB","GB",0),a(e.data)},function(){o()})});n.a.all([a,t.getPoolNames(),t.getGpuAvail(),t.getPoolGpuAvail(),t.getQuotaMsg()]).then(function(){t.loading=!1}).catch(function(){t.loading=!1}),this.setCurrentPool()},components:{panaBreadcrumb:a("1JPr").a},methods:{getQuotaMsg:function(){var t=this;return new n.a(function(e,a){t.checkError(t.$http({method:"get",url:t.api.alarm.getQuotaPlatform}),function(a){t.loading=!1;var o=a.data;t.memoryAvail=Math.floor((o.total_ram-o.used_ram)/1024),t.cpuAvail=Math.floor(o.total_cores-o.used_cores),t.gpuUse=Math.floor(o.total_gpu-o.used_gpu),e(a.data)},function(t){a()})})},getPoolNames:function(){var t=this,e=this;return new n.a(function(a,o){t.checkError(t.$http({url:e.api.cloud.pool_names,method:"get"}),function(t){e.poolNames=t.data,a(t.data)},function(){o()})})},validateNameExist:function(t,e,a){e!==this.currentPoolName&&-1!==this.poolNames.indexOf(e)?a(Error(this.lang.resource.poolNameAlreadyExist)):a()},getPoolGpuAvail:function(){var t=this,e=this.common.formatMsg(this.api.cloud.get_gpu_pool_detail_check,{id:this.id});return new n.a(function(a,o){t.checkError(t.$http({url:e,method:"get"}),function(e){t.poolGpuAvail=e.data,a(e.data)},function(){o()})})},validateGpu:function(t,e,a){var o=(this.currentGpuQuota||0)-(this.poolGpuAvail||0),r=this.gpu.totalNum;o>0&&""===e&&(e=0),(""===e||null==e||isNaN(e))&&a(),0===r&&a(Error(this.lang.resource.noAvailGpu)),e>=o&&e<=r?a():a(o>0?Error(this.common.formatMsg(this.lang.resource.invalidGpuUsed,{min:o,max:r})):Error(this.common.formatMsg(this.lang.resource.invalidGpu,{min:o,max:r})))},validateCpu:function(t,e,a){var o=this.cpuAvail;(""===e||null==e||isNaN(e))&&a(),e>=1&&e<=o?a():a(e>o?Error(this.common.formatMsg(this.lang.resource.invalidQutoa,{max:this.cpuAvail||1/0})):Error(this.common.formatMsg(this.lang.resource.invalidMin,{min:1})))},validateMemory:function(t,e,a){var o=this.memoryAvail;(""===e||null==e||isNaN(e))&&a(),e>=1&&e<=o?a():a(e>o?Error(this.common.formatMsg(this.lang.resource.invalidQutoa,{max:this.memoryAvail})):Error(this.common.formatMsg(this.lang.resource.invalidMin,{min:1})))},getGpuAvail:function(){var t=this;return new n.a(function(e,a){t.checkError(t.$http({url:t.api.cloud.gpu_available_list,method:"get"}),function(a){var o=a.data.avalibal,r=a.data.total,i=0,n=0;for(var l in o)i+=o[l].length;for(var u in r)n+=r[u].length;t.gpu.availNum=i,t.gpu.totalNum=n,e(a.data)},function(){a()})})},router_to_resource:function(){this.$router.push({name:"resourceList"})},update:function(t){var e=this,a=this,o=this.common.formatMsg(this.api.cloud.get_pools_detail,{pool_id:this.id});this.$refs[t].validate(function(t){if(!t)return!1;a.disable=!0,e.updateForm.memory_limit=e.common.switchCapacity(e.updateForm.memory_limit,"GB","MB",0),e.updateForm.cpu_limit=parseInt(e.updateForm.cpu_limit),e.updateForm.gpu_quota=""===e.updateForm.gpu_quota?null:e.updateForm.gpu_quota,e.checkError(e.$http({url:o,method:"put",data:e.updateForm}),function(t){a.router_to_resource(),a.$notify({title:a.lang.common.success,type:"success",message:a.lang.resource.editResourceSuccess})},function(t){a.router_to_resource()})})},addStorage:function(){this.storageCountArray.push({id:this.storageCount++})},removeStorage:function(t){this.storageCountArray=this.storageCountArray.filter(function(e){return e.id!=t})},showAutoAllocation:function(){this.page1=!1,this.create2=!0},prevStep:function(){this.create2=!1,this.page1=!0},handleCurrentChange:function(t){this.currentRow=t,this.templateRadio=this.currentRow.name},setCurrentPool:function(){var t=this;JSON.parse(sessionStorage.getItem("panaPools")).filter(function(e){if(e.id===t.id)return sessionStorage.setItem("panaCurrentPool",r()(e)),!0})}},computed:{is_system_admin:function(){return this.common.is_system_admin()}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"col",attrs:{id:"resource-update"}},[a("pana-breadcrumb",{attrs:{back:!0}}),t._v(" "),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"updateForm",attrs:{model:t.updateForm,rules:t.rules,"label-width":"80px"}},[a("h1",[t._v(t._s(t.lang.resource.updateResourcePool))]),t._v(" "),t.page1?a("div",{attrs:{id:"page1"}},[a("h2",[t._v(t._s(t.lang.common.generalInfo))]),t._v(" "),a("el-row",[a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:t.lang.common.name,prop:"name"}},[t.is_system_admin?a("el-input",{attrs:{placeholder:t.lang.common.namePlaceholder},model:{value:t.updateForm.name,callback:function(e){t.$set(t.updateForm,"name","string"==typeof e?e.trim():e)},expression:"updateForm.name"}}):a("span",[t._v(t._s(t.updateForm.name))])],1)],1),t._v(" "),a("el-col",{attrs:{span:11,offset:1}},[a("el-form-item",{attrs:{label:t.lang.resource.cpu,prop:"cpu_limit"}},[a("el-input",{attrs:{placeholder:t.lang.resource.cpuPlaceholder},nativeOn:{mousewheel:function(t){t.preventDefault()}},model:{value:t.updateForm.cpu_limit,callback:function(e){t.$set(t.updateForm,"cpu_limit",e)},expression:"updateForm.cpu_limit"}})],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:t.lang.resource.memory,prop:"memory_limit"}},[a("el-input",{attrs:{placeholder:t.lang.resource.quotaPlaceholder},nativeOn:{mousewheel:function(t){t.preventDefault()}},model:{value:t.updateForm.memory_limit,callback:function(e){t.$set(t.updateForm,"memory_limit",e)},expression:"updateForm.memory_limit"}})],1)],1),t._v(" "),a("el-col",{staticStyle:{"white-space":"nowrap"},attrs:{span:11,offset:1}},[a("el-form-item",{attrs:{label:t.lang.resource.GPUQuota,prop:"gpu_quota"}},[a("el-input",{attrs:{placeholder:t.lang.resource.gpuPlaceholder},nativeOn:{mousewheel:function(t){t.preventDefault()}},model:{value:t.updateForm.gpu_quota,callback:function(e){t.$set(t.updateForm,"gpu_quota",e)},expression:"updateForm.gpu_quota"}}),t._v(" "),a("span",{staticClass:"gpuTip"},[t._v("\n                                注：GPU总数\n                                "),a("span",{staticClass:"cloud-color-blue"},[t._v(t._s(t.gpu.totalNum))]),t._v("个，可用\n                                "),a("span",{staticClass:"cloud-color-blue"},[t._v(t._s(t.gpu.availNum))]),t._v("个\n                            ")])],1)],1)],1),t._v(" "),a("el-row",[t.is_system_admin?a("el-col",{attrs:{span:11}},[a("el-form-item",{attrs:{label:t.lang.common.description,prop:"description"}},[a("el-input",{attrs:{type:"textarea",placeholder:t.lang.common.descPlaceholder},model:{value:t.updateForm.description,callback:function(e){t.$set(t.updateForm,"description",e)},expression:"updateForm.description"}})],1)],1):t._e()],1),t._v(" "),a("el-form-item",{staticClass:"footer-btn"},[a("el-button",{on:{click:t.router_to_resource}},[t._v(t._s(t.lang.common.cancel))]),t._v(" "),a("el-button",{attrs:{type:"primary",disabled:t.disable},on:{click:function(e){return t.update("updateForm")}}},[t._v(t._s(t.lang.common.confirm))])],1)],1):t._e()])],1)},staticRenderFns:[]};var s=a("C7Lr")(l,u,!1,function(t){a("Cqql"),a("tYuR")},"data-v-12ddd6f4",null);e.default=s.exports},Cqql:function(t,e){},tYuR:function(t,e){}});