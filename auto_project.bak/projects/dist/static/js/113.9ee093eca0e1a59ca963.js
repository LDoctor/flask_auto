webpackJsonp([113],{eRn3:function(n,t){},wDu7:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={data:function(){return{loading:!0,src:"",username:"",password:"",token:"",destinationLink:"",projectUrl:"http://"+window.location.host,roundId:0}},methods:{getparamsInfo:function(){var n=this;this.checkError(this.$http({url:this.api.general.gettoken,method:"get"}),function(t){var e=n.common.decodeBitXor(t.data.data,5),o=JSON.parse(e);n.username=o.username,n.password=o.password,n.token=o.token,n.destinationLink=o.to_awcloud,n.src=o.to_awcloud},function(){n.logout()})},readyAction:function(){var n=this;""!==this.destinationLink&&null!=this.destinationLink&&(0!==n.roundId&&clearInterval(n.roundId),this.roundId=setInterval(function(){n.routerLink(n.username,n.password,n.token,n.destinationLink)},3e3))},routerLink:function(n,t,e,o){this.$refs.nodemanage.contentWindow.postMessage({username:n,password:t,projectUrl:this.projectUrl,token:e,jumpRoute:"/system/storageManagement"},o)}},mounted:function(){var n=this;this.getparamsInfo(),window.addEventListener("message",function(t){clearInterval(n.roundId),"ok"===t.data.status&&setTimeout(function(){n.loading=!1},1e3),"loginOvertime"===t.data.msg&&n.logout()},!1)},destroyed:function(){clearInterval(this.roundId)}},i={render:function(){var n=this.$createElement,t=this._self._c||n;return t("div",{directives:[{name:"loading",rawName:"v-loading",value:this.loading,expression:"loading"}],staticStyle:{"margin-left":"-240px","margin-top":"-70px"},attrs:{"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgb(255,255,255)"}},[t("iframe",{ref:"nodemanage",attrs:{id:"node",marginwidth:"0",marginheight:"0",src:this.src,frameborder:"no",scrolling:"no",width:"100%",height:"1000"},on:{load:this.readyAction}})])},staticRenderFns:[]};var a=e("C7Lr")(o,i,!1,function(n){e("eRn3")},null,null);t.default=a.exports}});