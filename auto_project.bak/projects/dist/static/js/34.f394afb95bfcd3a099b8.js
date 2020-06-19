webpackJsonp([34],{JaEE:function(e,t,a){"use strict";var s=a("aA9S"),n=a.n(s),o={name:"pana-edit-subnet",props:{show:Boolean,subnet:Object,subnetIndex:String},methods:{closeModal:function(e){e=e||!1,n()(this.$data,this.$options.data.call(this)),this.$emit("closeModal",e)},initForm:function(){null!=this.$refs.form&&this.$refs.form.clearValidate(),this.form.name=this.subnet.name,this.form.allocation_pools=this.sortIPGroup(this.common.deepCopyByJson(this.subnet.allocation_pools))},newAddress:function(){this.form.allocation_pools.push({start:"",end:""})},deleteAddress:function(e){this.form.allocation_pools.splice(e,1)},editSubnet:function(){var e=this;this.disable=!0,this.$refs.form.validate(function(t){t?(e.form=e.common.dropEmptyParameter(e.form),e.checkError(e.$http({url:e.common.formatMsg(e.api.cloud.put_subnets_subnet_id,{subnet_id:e.subnet.id}),method:"put",data:e.form}),function(){e.$notify({title:e.lang.common.success,type:"success",message:"pool"===e.subnetIndex?e.lang.pool.editPoolSubnetSuccess:e.lang.outside.editSubnetSuccess}),e.closeModal(!0)},function(){e.disable=!1})):e.disable=!1})},sortIPGroup:function(e){return e.sort(function(e,t){return e.start.split(".").join("")-t.start.split(".").join("")})},validateIpCross:function(e,t,a){var s=this,n=!0;this.form.allocation_pools.forEach(function(o,l){e.key!==l&&(o.start===t||o.end===t||s.common.getLargerIp(o.start,t)===t&&s.common.getLargerIp(o.end,t)===o.end)&&(a(Error(e.message)),n=!1)}),n&&a()},validateIpOccupy:function(e,t,a){t===this.subnet.gateway_ip?a(Error(e.message)):a()},validateIpCIDRRange:function(e,t,a){var s=this.common.getRangeInCidr(this.subnet.cidr);t!==s.start&&t!==s.end&&(this.common.getLargerIp(t,s.end)===t||this.common.getLargerIp(t,s.start)===s.start)?a(Error(e.message)):a()},validateIpEndRange:function(e,t,a){null!=e.start&&""!==e.start&&null!=t&&""!==t||a(),this.common.getLargerIp(e.start,t)===e.start?a(Error(e.message)):a()},validateNetmaskRange:function(e,t,a){var s=null==e.min?"255.128.0.0":e.min,n=null==e.max?"255.255.255.248":e.max;this.common.getLargerIp(s,t)===t&&this.common.getLargerIp(t,n)===n?a():a(new Error(e.message))}},computed:{titleFlag:function(){return"outside"==this.subnetIndex}},data:function(){return{labelWidth:"120px",form:{name:null,allocation_pools:[{start:null,end:null}]},rules:{name:[{required:!0,message:this.lang.outside.nameRequiredRule,trigger:"blur"},{min:1,max:32,message:this.lang.outside.nameLengthRule,trigger:"blur"},{validator:this.common.validateNetworkName,message:this.lang.outside.nameFormatRule,trigger:"blur"}]},avaliableAddress:!1,disable:!1}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.titleFlag?e.lang.outside.editOutSubnet:e.lang.pool.editPoolSubnet,width:"40%",visible:e.show,modal:!0},on:{open:e.initForm,close:e.closeModal}},[a("el-form",{ref:"form",attrs:{"label-position":"right",model:e.form,rules:e.rules}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.subnetName,"label-width":e.labelWidth,prop:"name"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{placeholder:e.lang.outside.subnetPlaceholder,required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.subnet,"label-width":e.labelWidth}},[null!=e.subnet?a("el-col",{attrs:{span:16}},[e._v("\n                        "+e._s(e.subnet.cidr)+"\n                    ")]):a("el-col",{attrs:{span:16}})],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.avaliableAddress,"label-width":e.labelWidth}})],1)],1),e._v(" "),e._l(e.form.allocation_pools,function(t,s){return a("el-row",{key:s,attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{staticClass:"address-range",attrs:{label:e.lang.common.start,"label-width":"50px",prop:"allocation_pools."+s+".start",rules:[{required:!0,message:e.lang.outside.startRequiredRule,trigger:"blur"},{validator:e.common.validateIpAddress,message:e.lang.outside.ipFormatRule,trigger:"blur"},{validator:e.validateIpOccupy,message:"已被网关ip占用",trigger:"blur"},{validator:e.validateIpCIDRRange,message:"不在子网CIDR范围内",trigger:"blur"},{validator:e.validateIpCross,message:"不能与已有范围交叉",key:s,trigger:"blur"}]}},[a("el-input",{staticClass:"address",model:{value:t.start,callback:function(a){e.$set(t,"start",a)},expression:"item.start"}})],1),e._v(" "),a("el-form-item",{staticClass:"address-range",attrs:{label:e.lang.common.end,"label-width":"50px",prop:"allocation_pools."+s+".end",rules:[{required:!0,message:e.lang.outside.endRequiredRule,trigger:"blur"},{validator:e.validateIpEndRange,start:t.start,message:e.lang.outside.endRangeRule,trigger:"blur"},{validator:e.validateIpCIDRRange,message:"不在子网CIDR范围内",trigger:"blur"},{validator:e.common.validateIpAddress,message:e.lang.outside.ipFormatRule,trigger:"blur"},{validator:e.validateIpCross,message:"不能与已有范围交叉",key:s,trigger:"blur"}]}},[a("el-input",{staticClass:"address",model:{value:t.end,callback:function(a){e.$set(t,"end",a)},expression:"item.end"}})],1),e._v(" "),a("el-form-item",{staticClass:"address-range-button",attrs:{label:""}},[a("el-button",{attrs:{type:"danger",disabled:1===e.form.allocation_pools.length},on:{click:function(t){return e.deleteAddress(s)}}},[e._v("\n                        "+e._s(e.lang.common.delete)+"\n                    ")])],1)],1)],1)}),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",[a("el-col",{attrs:{span:16}},[a("el-button",{attrs:{type:"primary"},on:{click:e.newAddress}},[e._v("\n                            "+e._s(e.lang.common.new)+"\n                        ")])],1)],1)],1)],1)],2),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.disable},on:{click:e.editSubnet}},[e._v(e._s(e.lang.common.complete))])],1)],1)},staticRenderFns:[]};var r=a("C7Lr")(o,l,!1,function(e){a("gfO1")},"data-v-216b7aa5",null);t.a=r.exports},ViR3:function(e,t){},gfO1:function(e,t){},pHuP:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("3cXf"),n=a.n(s),o=a("1JPr"),l=a("aA9S"),r=a.n(l),i={name:"pana-create-external-subnet",components:{"pana-ip-input":a("Cj+A").a},props:{show:Boolean,outsideId:String},watch:{"form.subnetIp":function(){this.gatewayRange=this.setGatewayRange(),this.$refs.form.validateField("gateway_ip")},"form.subnetMask":function(){this.gatewayRange=this.setGatewayRange(),this.$refs.form.validateField("gateway_ip")}},methods:{closeModal:function(e){e=e||!1,r()(this.$data,this.$options.data.call(this)),this.$emit("closeModal",e)},initForm:function(){null!=this.$refs.form&&this.$refs.form.clearValidate()},newAddress:function(){this.form.allocation_pools.push({start:"",end:""})},deleteAddress:function(e){this.form.allocation_pools.splice(e,1)},validateAllocation:function(e){for(var t=[],a=0;a<e.length;a++)null!=e[a].start&&null!=e[a].end&&t.push(e[a]);return t.length>0?t:null},validateGatewayIp:function(e,t,a){var s=this.common.getRangeInCidr(this.form.subnetIp+"/"+this.common.switchToNumberCount(this.form.subnetMask)).start;null==t||""===t?a():this.enableGateway&&this.form.gateway_ip==t?a(new Error(this.lang.outside.gatewayIpUsed)):s==t?a(new Error(this.lang.outside.gatewayIpUsed)):a()},validateGatewayIpArr:function(e,t,a){var s=this,n=this.form.allocation_pools;null==t||""===t?a():n.map(function(e,n){e.start&&e.end&&(s.common.getLargerIp(e.start,t)===t&&s.common.getLargerIp(t,e.end)===e.end?a(new Error(s.lang.outside.gatewayOccupancy)):a())})},createSubnet:function(){var e=this,t=JSON.parse(n()(e.form));this.disable=!0,this.$refs.form.validate(function(a){a?(e.form.cidr=e.form.subnetIp+"/"+e.common.switchToNumberCount(e.form.subnetMask),""!==e.form.dnsNameservers&&null!=e.form.dnsNameservers&&(e.form.dns_nameservers=e.form.dnsNameservers.split(/\n/g)),""!==e.form.hostRoutes&&null!=e.form.hostRoutes&&(e.form.host_routes=e.formatRouters(e.form.hostRoutes)),e.form.allocation_pools=e.availableAddress?e.validateAllocation(e.form.allocation_pools):[],e.form=e.common.dropEmptyParameter(e.form),!1===e.enableGateway&&(e.form.gateway_ip=null),delete e.form.subnetIp,delete e.form.subnetMask,delete e.form.hostRoutes,delete e.form.dnsNameservers,e.checkError(e.$http({url:e.api.cloud.post_subnets,method:"post",data:e.form}),function(){e.$notify({title:e.lang.common.success,type:"success",message:e.lang.outside.createSubnetSuccess}),e.closeModal(!0)},function(){e.disable=!1,e.$set(e.form,"subnetIp",t.subnetIp),e.$set(e.form,"subnetMask",t.subnetMask),e.$set(e.form,"hostRoutes",t.hostRoutes),e.$set(e.form,"dnsNameservers",t.dnsNameservers)})):e.disable=!1})},formatRouters:function(e){for(var t=e.split(/\n/g),a=[],s=0;s<t.length;s++){var n={},o=t[s].split(",");n.destination=o[0].replace(/(^\s*)|(\s*$)/g,""),n.nexthop=o[1].replace(/(^\s*)|(\s*$)/g,""),a.push(n)}return a},validateIpEndRange:function(e,t,a){null!=e.start&&""!==e.start&&null!=t&&""!==t||a(),this.common.getLargerIp(e.start,t)===e.start?a(Error(e.message)):a()},validateNetmaskRange:function(e,t,a){var s=null==e.min?"255.128.0.0":e.min,n=null==e.max?"255.255.255.248":e.max;this.common.getLargerIp(s,t)===t&&this.common.getLargerIp(t,n)===n?a():a(new Error(e.message))},validateGatewayRange:function(e,t,a){null==t||""===t||this.common.getLargerIp(t,e.range.start)===t&&this.common.getLargerIp(t,e.range.end)===e.range.end?a():a(new Error(e.message))},setGatewayRange:function(){var e=/^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))$/;return e.test(this.form.subnetIp)&&e.test(this.form.subnetMask)?(this.enableIpRange=!0,this.common.getRangeInCidr(this.form.subnetIp+"/"+this.common.switchToNumberCount(this.form.subnetMask))):(this.enableIpRange=!1,this.availableAddress=!1,{start:null,end:null})},validateMaskFn:function(){this.$refs.form.validateField("subnetMask")},validateIpFn:function(){this.$refs.form.validateField("subnetIp")},validateIpCross:function(e,t,a){var s=this,n=!0;this.form.allocation_pools.forEach(function(o,l){e.key!==l&&(o.start===t||o.end===t||s.common.getLargerIp(o.start,t)===t&&s.common.getLargerIp(o.end,t)===o.end)&&(a(Error(e.message)),n=!1)}),n&&a()},validateIpCIDRRange:function(e,t,a){var s=this.form.subnetIp+"/"+this.common.switchToNumberCount(this.form.subnetMask),n=this.common.getRangeInCidr(s),o=n.start.replace(/\./g,"")-1,l=n.end.replace(/\./g,"")-0+1;t!==n.start&&t!==n.end?t.replace(/\./g,"")==o?a(Error(this.lang.pool.noNetworkWrite)):t.replace(/\./g,"")==l?a(Error(this.lang.pool.noTelWrite)):this.common.getLargerIp(t,n.end)===t||this.common.getLargerIp(t,n.start)===n.start?a(Error(this.lang.pool.noCIDR)):a():a()},validateDuplicate:function(e,t,a){if(null==t||""===t)a();else{var s=t.split("\n");this.common.hasDuplicate(s)?"dns"===e.type?a(new Error(this.lang.outside.validateDnsDuplicateRule)):a(new Error(this.lang.outside.validateRoutesDuplicateRule)):"dns"===e.type?(e.message=this.lang.outside.dnsFormatRule,this.common.validateDnsServers(e,t,a)):(e.message=this.lang.outside.hostRoutesFormatRule,this.common.validateHostRoutes(e,t,a))}}},data:function(){return{labelWidth:"120px",form:{name:null,cidr:"",ip_version:4,gateway_ip:"",enable_dhcp:!0,dns_nameservers:[],host_routes:[],network_id:this.outsideId,allocation_pools:[{start:null,end:null}],subnetIp:"",subnetMask:"",dnsNameservers:"",hostRoutes:""},rules:{name:[{required:!0,message:this.lang.outside.nameRequiredRule,trigger:"blur"},{min:1,max:32,message:this.lang.outside.nameLengthRule,trigger:"blur"},{validator:this.common.validateNetworkName,message:this.lang.outside.nameFormatRule,trigger:"blur"}],subnetIp:[{required:!0,message:this.lang.outside.subnetRequiredRule,trigger:"blur"},{validator:this.common.validateIpAddress,message:this.lang.outside.ipFormatRule,trigger:"blur"}],subnetMask:[{required:!0,message:this.lang.outside.netmaskRequiredRule,trigger:"blur"},{validator:this.common.validateNetMask,message:this.lang.outside.netmaskFormatRule,trigger:"blur"},{validator:this.validateNetmaskRange,message:this.lang.outside.netmaskRangeRule,trigger:"blur"}],dnsNameservers:[{validator:this.validateDuplicate,type:"dns",trigger:"blur"}],hostRoutes:[{validator:this.validateDuplicate,type:"routes",trigger:"blur"}]},availableAddress:!1,enableGateway:!0,gatewayRange:{start:null,end:null},enableIpRange:!1,disable:!1}}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.lang.outside.createOutSubnet,width:"40%",visible:e.show,modal:!0},on:{open:e.initForm,close:e.closeModal}},[a("el-form",{ref:"form",attrs:{"label-position":"right",model:e.form,rules:e.rules}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.subnetName,"label-width":e.labelWidth,prop:"name"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{placeholder:e.lang.outside.subnetPlaceholder,required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.subnet,"label-width":e.labelWidth,prop:"subnetIp"}},[a("el-col",{attrs:{span:16}},[a("pana-ip-input",{on:{blur:e.validateIpFn},model:{value:e.form.subnetIp,callback:function(t){e.$set(e.form,"subnetIp",t)},expression:"form.subnetIp"}})],1)],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.common.netmask,"label-width":e.labelWidth,prop:"subnetMask"}},[a("el-col",{attrs:{span:16}},[a("pana-ip-input",{on:{blur:e.validateMaskFn},model:{value:e.form.subnetMask,callback:function(t){e.$set(e.form,"subnetMask",t)},expression:"form.subnetMask"}})],1)],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.availableAddress,"label-width":e.labelWidth}},[a("el-col",{attrs:{span:16}},[a("el-checkbox",{attrs:{disabled:!e.enableIpRange},model:{value:e.availableAddress,callback:function(t){e.availableAddress=t},expression:"availableAddress"}})],1)],1)],1)],1),e._v(" "),e.availableAddress?a("div",[e._l(e.form.allocation_pools,function(t,s){return a("el-row",{key:s,attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{staticClass:"address-range",attrs:{label:e.lang.common.start,"label-width":"50px",prop:"allocation_pools."+s+".start",rules:[{required:!0,message:e.lang.outside.startRequiredRule,trigger:"blur"},{validator:e.common.validateIpAddress,message:e.lang.outside.ipFormatRule,trigger:"blur"},{validator:e.validateIpCIDRRange,trigger:"blur"},{validator:e.validateGatewayIp,trigger:"blur"},{validator:e.validateIpCross,message:"不能与已有范围交叉",key:s,trigger:"blur"}]}},[a("el-input",{staticClass:"address",model:{value:t.start,callback:function(a){e.$set(t,"start",a)},expression:"item.start"}})],1),e._v(" "),a("el-form-item",{staticClass:"address-range",attrs:{label:e.lang.common.end,"label-width":"50px",prop:"allocation_pools."+s+".end",rules:[{required:!0,message:e.lang.outside.endRequiredRule,trigger:"blur"},{validator:e.validateIpEndRange,start:t.start,message:e.lang.outside.endRangeRule,trigger:"blur"},{validator:e.common.validateIpAddress,message:e.lang.outside.ipFormatRule,trigger:"blur"},{validator:e.validateIpCIDRRange,trigger:"blur"},{validator:e.validateGatewayIp,trigger:"blur"},{validator:e.validateIpCross,message:"不能与已有范围交叉",key:s,trigger:"blur"}]}},[a("el-input",{staticClass:"address",model:{value:t.end,callback:function(a){e.$set(t,"end",a)},expression:"item.end"}})],1),e._v(" "),a("el-form-item",{staticClass:"address-range-button",attrs:{label:""}},[a("el-button",{attrs:{type:"danger",disabled:1===e.form.allocation_pools.length},on:{click:function(t){return e.deleteAddress(s)}}},[e._v("\n                            "+e._s(e.lang.common.delete)+"\n                        ")])],1)],1)],1)}),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.availableAddress,"label-width":e.labelWidth}},[a("el-col",{attrs:{span:16}},[a("el-button",{attrs:{type:"primary"},on:{click:e.newAddress}},[e._v("\n                                "+e._s(e.lang.common.new)+"\n                            ")])],1)],1)],1)],1)],2):e._e(),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.enableGateway,"label-width":e.labelWidth}},[a("el-col",{attrs:{span:16}},[a("el-checkbox",{model:{value:e.enableGateway,callback:function(t){e.enableGateway=t},expression:"enableGateway"}})],1)],1)],1)],1),e._v(" "),e.enableGateway?a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.gatewayIp,"label-width":e.labelWidth,prop:"gateway_ip",rules:[{validator:this.common.validateIpAddress,message:this.lang.pool.ipFormatRule,trigger:"blur"},{validator:this.validateGatewayRange,range:this.gatewayRange,message:this.common.formatMsg(this.lang.pool.gatewayRangeRule,this.gatewayRange),trigger:"blur"},{validator:e.validateGatewayIpArr,trigger:"blur"}]}},[a("el-col",{attrs:{span:16}},[a("el-tooltip",{attrs:{effect:"dark",content:e.lang.outside.gatewayPlaceholder,placement:"top"}},[a("el-input",{attrs:{placeholder:e.lang.outside.gatewayPlaceholder},model:{value:e.form.gateway_ip,callback:function(t){e.$set(e.form,"gateway_ip",t)},expression:"form.gateway_ip"}})],1)],1)],1)],1)],1):e._e(),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.enableDhcp,"label-width":e.labelWidth}},[a("el-col",{attrs:{span:16}},[a("el-checkbox",{model:{value:e.form.enable_dhcp,callback:function(t){e.$set(e.form,"enable_dhcp",t)},expression:"form.enable_dhcp"}})],1)],1)],1)],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.dnsServer,"label-width":e.labelWidth,prop:"dnsNameservers"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{type:"textarea",rows:4,placeholder:e.lang.outside.dnsServerPlaceholder},model:{value:e.form.dnsNameservers,callback:function(t){e.$set(e.form,"dnsNameservers",t)},expression:"form.dnsNameservers"}})],1)],1)],1)],1),e._v(" "),!0===e.form.enable_dhcp?a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:e.lang.outside.addRouter,"label-width":e.labelWidth,prop:"hostRoutes"}},[a("el-col",{attrs:{span:16}},[a("el-input",{attrs:{type:"textarea",rows:4,placeholder:e.lang.outside.addRouterPlaceholder},model:{value:e.form.hostRoutes,callback:function(t){e.$set(e.form,"hostRoutes",t)},expression:"form.hostRoutes"}})],1)],1)],1)],1):e._e()],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.disable},on:{click:e.createSubnet}},[e._v(e._s(e.lang.common.complete))])],1)],1)},staticRenderFns:[]};var d=a("C7Lr")(i,u,!1,function(e){a("qSET")},"data-v-d62acc70",null).exports,c={name:"pana-deleteRouter",props:{show:Boolean},methods:{closeModal:function(e){e=e||!1,this.$emit("closeModal",e)},deleteSubnet:function(){this.closeModal(!0)}}},p={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.lang.common.info,visible:e.show,width:"30%",modal:!0},on:{close:e.closeModal}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{span:10}},[e._v(e._s(e.lang.outside.deleteSubnetInfo))])],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeModal}},[e._v(e._s(e.lang.common.cancel))]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.deleteSubnet}},[e._v(e._s(e.lang.common.confirm))])],1)],1)},staticRenderFns:[]},m=a("C7Lr")(c,p,!1,null,null,null).exports,g=a("JaEE"),b={name:"pana-outside-detail",components:{"pana-breadcrumb":o.a,"pana-create-subnet":d,"pana-delete-subnet":m,"pana-edit-subnet":g.a},watch:{portsSearch:function(){this.portsPage=1},subnetSearch:function(){this.subnetPage=1}},computed:{outsideId:function(){return this.$route.params.outsideId},portsFilter:function(){var e=this;return this.portsOrigin.filter(function(t){return""===e.portsSearch||-1!==n()(t).search(e.portsSearch)})},portsTable:function(){return this.portsFilter.length>this.pageSize?this.portsFilter.slice((this.portsPage-1)*this.pageSize,this.portsPage*this.pageSize):this.portsFilter},subnetFilter:function(){var e=this;return this.subnetOrigin.filter(function(t){return""===e.subnetSearch||-1!==n()(t).search(e.subnetSearch)})},subnetTable:function(){return this.subnetFilter.length>this.pageSize?this.subnetFilter.slice((this.subnetPage-1)*this.pageSize,this.subnetPage*this.pageSize):this.subnetFilter}},data:function(){return{pageSize:10,activeName:"base",baseInfos:{},config:{active:{style:"cloud-success",title:this.lang.common.running},down:{style:"cloud-warning",title:this.lang.common.stop},build:{style:"cloud-fault",title:this.lang.common.buildStatus},error:{style:"cloud-error",title:this.lang.common.errorStatus}},ipVersion:{4:this.lang.outside.ipv4,6:this.lang.outside.ipv6},portsOrigin:[],portsSearch:"",portsPage:1,subnetOrigin:[],subnetSearch:"",subnetPage:1,showCreateSubnet:!1,showDeleteSubnet:!1,showEditSubnet:!1,subnetSelectionIds:[],editObj:null,portsLoading:!1,subnetLoading:!1}},methods:{handleEdit:function(e){this.showEditSubnet=!0,this.editObj=e},sortChangePorts:function(e){var t=null==e.order?0:"ascending"===e.order?1:-1;this.portsOrigin=this.portsOrigin.sort(function(a,s){return a[e.prop]=null==a[e.prop]?"":a[e.prop],s[e.prop]=null==s[e.prop]?"":s[e.prop],(a[e.prop]>s[e.prop]?1:-1)*t})},sortChangeSubnet:function(e){var t=null==e.order?0:"ascending"===e.order?1:-1;this.subnetOrigin=this.subnetOrigin.sort(function(a,s){switch(e.prop){case"available_ip":return(a[e.prop]-s[e.prop])*t;default:return a[e.prop]=null==a[e.prop]?"":a[e.prop],s[e.prop]=null==s[e.prop]?"":s[e.prop],(a[e.prop]>s[e.prop]?1:-1)*t}})},switchPortPage:function(e){this.portsPage=e},switchSubnetPage:function(e){this.subnetPage=e},closeCreateSubnet:function(e){!0===e&&this.getSubnetDetail(),this.showCreateSubnet=!1},closeEditSubnet:function(e){!0===e&&this.getSubnetDetail(),this.showEditSubnet=!1},deleteSubnet:function(e){var t=this;this.showDeleteSubnet=!1,!0===e&&this.checkError(this.$http({url:this.api.cloud.post_subnets_delete,method:"post",data:{subnet_ids:this.subnetSelectionIds}}),function(){t.$notify({title:t.lang.common.success,type:"success",message:t.lang.outside.deleteSubnetSuccess}),t.getSubnetDetail(),t.subnetSelectionIds=[]},function(){t.getSubnetDetail(),t.subnetSelectionIds=[]})},switchTabs:function(){switch(this.activeName){case"base":this.getBaseInfo();break;case"port":this.getPortDetail();break;case"subnet":this.getSubnetDetail()}},getBaseInfo:function(){var e=this;this.checkError(this.$http({url:this.common.formatMsg(this.api.cloud.get_networks_detail,{network_id:this.outsideId}),method:"get"}),function(t){e.baseInfos=t.data})},getPortDetail:function(){var e=this;e.portsLoading=!0,this.checkError(this.$http({url:this.common.formatMsg(this.api.cloud.get_ports_network_id_details,{network_id:this.outsideId}),method:"get"}),function(t){e.portsLoading=!1,e.portsOrigin=t.data},function(){e.portsLoading=!1})},getSubnetDetail:function(){var e=this;e.subnetLoading=!0,this.checkError(this.$http({url:this.api.cloud.get_subnets+"?network_id="+this.outsideId,method:"get"}),function(t){e.subnetLoading=!1,e.subnetOrigin=t.data},function(){e.subnetLoading=!1})},showUntieSubnetModal:function(e){this.untieSubnetId=e.id,this.showUntieSubnet=!0},selectSubnets:function(e){var t=[];e.forEach(function(e){t.push(e.id)}),this.subnetSelectionIds=t}},mounted:function(){this.getBaseInfo()}},f={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-container",{attrs:{type:"flex",direction:"vertical"}},[a("pana-breadcrumb",{attrs:{back:!0}}),e._v(" "),a("el-main",[a("el-tabs",{on:{"tab-click":e.switchTabs},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:e.lang.outside.baseInfo,name:"base"}},[a("table",{staticClass:"baseList"},[a("tr",[a("td",{staticClass:"title"},[e._v("\n                            "+e._s(e.lang.outside.networkName)+"\n                        ")]),e._v(" "),a("td",[e._v("\n                            "+e._s(e.baseInfos.name)+"\n                        ")])]),e._v(" "),a("tr",[a("td",{staticClass:"title"},[e._v("\n                            "+e._s(e.lang.common.status)+"\n                        ")]),e._v(" "),null!=e.baseInfos.status?a("td",[null==e.config[e.baseInfos.status.toLowerCase()]?a("span",[e._v("\n                                "+e._s(e.lang.common.error)+"\n                            ")]):a("span",[e._v("\n                                "+e._s(e.config[e.baseInfos.status.toLowerCase()].title)+"\n                            ")])]):a("td")]),e._v(" "),a("tr",[a("td",{staticClass:"title"},[e._v(e._s(e.lang.outside.share))]),a("td",[!0===e.common.forceBoolean(e.baseInfos.shared)?a("span",[e._v(e._s(e.lang.common.yes))]):a("span",[e._v(e._s(e.lang.common.no))])])]),e._v(" "),a("tr",[a("td",{staticClass:"title"},[e._v(e._s(e.lang.outside.physicalNetwork))]),a("td",[e._v(e._s(e.baseInfos["provider:physical_network"]))])]),e._v(" "),a("tr",[a("td",{staticClass:"title"},[e._v(e._s(e.lang.outside.networkType))]),a("td",[e._v(e._s(e.lang.outside[e.baseInfos["provider:network_type"]])),null!=e.baseInfos["provider:segmentation_id"]&&""!==e.baseInfos["provider:segmentation_id"]?a("span",[e._v(":"+e._s(e.baseInfos["provider:segmentation_id"]))]):e._e()])]),e._v(" "),a("tr",[a("td",{staticClass:"title"},[e._v(e._s(e.lang.outside.ipCount))]),a("td",[e._v(e._s(e.baseInfos.available_ip))])])])]),e._v(" "),a("el-tab-pane",{attrs:{label:e.lang.outside.port,name:"port"}},[a("el-row",{staticClass:"pana-btn-group",attrs:{type:"flex",justify:"space-between"}},[a("el-col"),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-row",{staticClass:"search-row",attrs:{type:"flex",justify:"space-around"}},[a("el-col",{attrs:{span:22}},[a("el-input",{attrs:{placeholder:e.lang.common.search,"suffix-icon":"el-icon-search"},model:{value:e.portsSearch,callback:function(t){e.portsSearch=t},expression:"portsSearch"}})],1),e._v(" "),a("el-col",{attrs:{span:2}},[a("el-button",{staticClass:"fa fa-refresh",attrs:{type:"text",circle:""},on:{click:e.getPortDetail}})],1)],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.portsLoading,expression:"portsLoading"}],ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{"element-loading-text":e.lang.common.loading,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255, 255, 255)",data:e.portsTable,"tooltip-effect":"dark"},on:{"sort-change":e.sortChangePorts}},[a("el-table-column",{attrs:{label:e.lang.outside.portName,sortable:"custom",prop:"name"},scopedSlots:e._u([{key:"default",fn:function(t){return[""===t.row.name||null==t.row.name?a("span",[e._v("\n                                "+e._s(e.lang.outside.nothing)+"\n                            ")]):a("span",[e._v("\n                                "+e._s(t.row.name)+"\n                            ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.portIp},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.fixed_ips,function(t,s){return a("div",{key:s},[e._v(e._s(t.ip_address))])})}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.common.status,sortable:"custom",prop:"status"},scopedSlots:e._u([{key:"default",fn:function(t){return[null!=e.config[t.row.status.toLowerCase()]?a("span",{class:["status",e.config[t.row.status.toLowerCase()].style]},[e._v("\n                                "+e._s(e.config[t.row.status.toLowerCase()].title)+"\n                            ")]):a("span",{staticClass:"status cloud-error"},[e._v("\n                                "+e._s(e.config.error.title)+"\n                            ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.managerStatus,sortable:"custom",prop:"admin_state_up"},scopedSlots:e._u([{key:"default",fn:function(t){return[!0===e.common.forceBoolean(t.row.admin_state_up)?a("span",[e._v("\n                                "+e._s(e.lang.common.yes)+"\n                            ")]):a("span",[e._v("\n                                "+e._s(e.lang.common.no)+"\n                            ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.router.deviceOwner,sortable:"custom",prop:"device_owner"}})],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"end"}},[e.portsFilter.length>e.pageSize?a("el-pagination",{attrs:{background:"",layout:"slot, prev, pager, next","prev-text":e.lang.common.prevPage,"next-text":e.lang.common.nextPage,total:e.portsFilter.length,"page-size":e.pageSize},on:{"current-change":e.switchPortPage}},[e._t("default",[a("span",{staticClass:"pagination-slot"},[e._v("\n                                "+e._s(e.common.formatMsg(e.lang.common.paginationMsg,{current:this.portsPage,total:this.portsFilter.length}))+"\n                            ")])])],2):e._e()],1)],1),e._v(" "),a("el-tab-pane",{attrs:{label:e.lang.outside.subnetManage,name:"subnet"}},[a("el-row",{staticClass:"pana-btn-group",attrs:{type:"flex",justify:"space-between"}},[a("el-col",{attrs:{span:6}},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.showCreateSubnet=!0}}},[e._v("\n                            "+e._s(e.lang.common.create)+"\n                        ")]),e._v(" "),a("el-button",{attrs:{disabled:0===e.subnetSelectionIds.length},on:{click:function(t){e.showDeleteSubnet=!0}}},[e._v("\n                            "+e._s(e.lang.common.delete)+"\n                        ")])],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-row",{staticClass:"search-row",attrs:{type:"flex",justify:"space-around"}},[a("el-col",{attrs:{span:22}},[a("el-input",{attrs:{placeholder:e.lang.common.search,"suffix-icon":"el-icon-search"},model:{value:e.subnetSearch,callback:function(t){e.subnetSearch=t},expression:"subnetSearch"}})],1),e._v(" "),a("el-col",{attrs:{span:2}},[a("el-button",{staticClass:"fa fa-refresh",attrs:{type:"text",circle:""},on:{click:e.getSubnetDetail}})],1)],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.subnetLoading,expression:"subnetLoading"}],ref:"multipleTable",staticClass:"cloud-table",staticStyle:{width:"100%"},attrs:{"element-loading-text":e.lang.common.loading,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255, 255, 255)",data:e.subnetTable,"tooltip-effect":"dark"},on:{"selection-change":e.selectSubnets,"sort-change":e.sortChangeSubnet}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.subnetName,sortable:"custom",prop:"name"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.subnetCidr,sortable:"custom",prop:"cidr"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.gatewayIp,sortable:"custom",prop:"gateway_ip"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.avaliableAddress,width:"250px"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.allocation_pools,function(t,s){return a("div",{key:s},[e._v("\n                                "+e._s(t.start)+" ~ "+e._s(t.end)+"\n                            ")])})}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.ipCount,sortable:"custom",prop:"available_ip"}}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.ipVersion,sortable:"custom",prop:"ip_version"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                            "+e._s(e.ipVersion[t.row.ip_version])+"\n                        ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.enableDhcp,sortable:"custom",prop:"enable_dhcp"},scopedSlots:e._u([{key:"default",fn:function(t){return[!0===e.common.forceBoolean(t.row.enable_dhcp)?a("span",[e._v("\n                                "+e._s(e.lang.common.yes)+"\n                            ")]):a("span",[e._v("\n                                "+e._s(e.lang.common.no)+"\n                            ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.dnsServer,prop:"dns_nameservers"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.dns_nameservers,function(t,s){return a("div",{key:s},[e._v("\n                                "+e._s(t)+"\n                            ")])})}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.outside.addRouter,width:"220"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.host_routes,function(t,s){return a("div",{key:s},[a("span",[e._v("\n                                    "+e._s(t.destination)+","+e._s(t.nexthop)+"\n                                ")])])})}}])}),e._v(" "),a("el-table-column",{attrs:{label:e.lang.common.operation},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.handleEdit(t.row)}}},[e._v("\n                                "+e._s(e.lang.common.update)+"\n                            ")])]}}])})],1),e._v(" "),a("el-row",{attrs:{type:"flex",justify:"end"}},[e.subnetOrigin.length>e.pageSize?a("el-pagination",{attrs:{background:"",layout:"slot, prev, pager, next","prev-text":e.lang.common.prevPage,"next-text":e.lang.common.nextPage,total:e.subnetOrigin.length,"page-size":e.pageSize},on:{"current-change":e.switchSubnetPage}},[e._t("default",[a("span",{staticClass:"pagination-slot"},[e._v("\n                                "+e._s(e.common.formatMsg(e.lang.common.paginationMsg,{current:this.subnetPage,total:this.subnetFilter.length}))+"\n                            ")])])],2):e._e()],1)],1)],1),e._v(" "),a("pana-create-subnet",{attrs:{show:e.showCreateSubnet,outsideId:e.outsideId},on:{closeModal:e.closeCreateSubnet}}),e._v(" "),a("pana-delete-subnet",{attrs:{show:e.showDeleteSubnet},on:{closeModal:e.deleteSubnet}}),e._v(" "),a("pana-edit-subnet",{attrs:{show:e.showEditSubnet,subnet:e.editObj,subnetIndex:"outside"},on:{closeModal:e.closeEditSubnet}})],1)],1)},staticRenderFns:[]};var h=a("C7Lr")(b,f,!1,function(e){a("ViR3")},"data-v-b78ad1f0",null);t.default=h.exports},qSET:function(e,t){}});