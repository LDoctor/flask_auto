webpackJsonp([87],{DtUA:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={name:"cloud-center",components:{"cloud-nav":n("34jS").a},props:{moduleName:String},computed:{nav:function(){return JSON.parse(sessionStorage.getItem("panaMenusChildren"))[this.moduleName]}},methods:{changeHeaderNav:function(e){this.headerData.activeNavIndex=e}}},r={render:function(){var e=this.$createElement,t=this._self._c||e;return t("el-container",[t("cloud-nav",{attrs:{data:this.nav,moduleName:this.moduleName}}),this._v(" "),t("el-main",[t("router-view")],1)],1)},staticRenderFns:[]};var o=n("C7Lr")(a,r,!1,function(e){n("rOFW")},"data-v-6d5c51f8",null);t.default=o.exports},rOFW:function(e,t){}});