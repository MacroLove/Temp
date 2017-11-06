import {
    InteractionManager
}from "react-native";
var array_ = require('lodash/array');
var Queue_ = require("js-queue");

function MakeWebSocket() {
    // the cached instance
    var instance = this;
    // rewrite the contructor
    MakeWebSocket = function () {
        return instance;
    };
    instance.prototype = this;


    var bStop = true;
    var socket = null;
    var api_ws = "a.popled.cn";
    var userstate = "";
    var scckettoken = "";
    var pingInterval = null;
    var queue = null;

    // 全局数据
    var _CallBacks = []; // [{key:Object（this）, cmd:string（要接受的cmd）, callback:func（回调函数）}, ...]

    var sendarrys = []; //正在发送广告



    instance.addCallback = (cb) => {
        if (cb) {
            _CallBacks.push(cb);
            console.log("add ws call:", cb);
        }
    };

    instance.removeCallback = (key) => {
        if (key) {
            array_.remove(_CallBacks, function (o) {
                if (o.key == key) {
                    console.log("rm ws call:", key);
                    return true;
                }
                return false;
            });
        }
    };

    instance.isStopped = ()=>{
        return bStop;
    }

    instance.startWithUserAndToken = (username, token) => {
        if (bStop == false)
            return;
        scckettoken = token;
        userstate = username;

        queue = new Queue_;
        queue.stop = true;
        socket = new WebSocket('ws://'+api_ws+':8037/mb');

        socket.onopen = function(event) {
            // 发送一个初始化消息
            let datacok = {
                Type: 'login',
                user: userstate,
                token: scckettoken
            };
            socket.send(JSON.stringify(datacok));
            let socketdata = {
                Type: 'ping',
                user: userstate,
                token: scckettoken
            }
            pingInterval && clearInterval(pingInterval);
            pingInterval = setInterval(function() {
                socket.send(JSON.stringify(socketdata));
            }, 30000);

        };

        socket.onmessage = function(event) {
            var msgs = JSON.parse(event.data).msg;
            var cmds = JSON.parse(event.data).cmd

            //console.log(msgs,cmds)

            InteractionManager.runAfterInteractions(()=>{
                requestAnimationFrame(()=>{
                    _CallBacks.forEach(function (o, i, arr) {
                        if (o.cmd == cmds) {
                            o.callback(msgs, cmds);
                        }
                    });
                });
            });

            return;

            /***
            //设备上下线推送
            if(cmds == "led_status"){
                var list = $(".list-box").find(".ysledlist").find(".led-main-list").find(".ledlistys")
                for(var i=0;i<list.length;i++){
                    var ledid = list.eq(i).attr("data-val");
                    var mainleit = list.eq(i).find(".main-right").attr("data-val")
                    if(ledid == msgs.ids_dev){
                        if(msgs.status == "online"){
                            list.eq(i).find(".list-led-main").find(".online-status").find(".onledsty").text("在线").css("color","#00D42E");
                            list.eq(i).find(".list-led-main").find(".online-status").find(".online-status-icon").addClass("online-icon");
                            list.eq(i).find(".list-led-main").find(".ledysnatime").find(".led-time").text(msgs.date);
                            if(mainleit == 4){
                                list.eq(i).find(".led-sort").css('background-color', "#00bdbf");
                            }else {
                                list.eq(i).find(".led-sort").css('background-color', "#FF7534");
                            };
                        };
                        if(msgs.status == "offline"){
                            list.eq(i).find(".list-led-main").find(".online-status").find(".onledsty").text("离线").css("color","#666");
                            list.eq(i).find(".list-led-main").find(".online-status").find(".online-status-icon").removeClass("online-icon");
                            list.eq(i).find(".list-led-main").find(".ledysnatime").find(".led-time").text(msgs.date);
                            if(mainleit == 4){
                                list.eq(i).find(".led-sort").css('background-color', "#d8d8d8");
                            }else {
                                list.eq(i).find(".led-sort").css('background-color', "#d8d8d8");
                            };
                        };
                    };
                };
            };
            // 广告进度推送
            if(cmds == "adSendProgress"){
                // 广告历史
                var pro = msgs.progress;
                for(var i=0;i<history.length;i++){
                    var cmdtype = history.eq(i).find(".cmd-type").find("span").text();
                    var dataval = history.eq(i).attr("data-val");
                    if(cmdtype == msgs.ids_dev && dataval == msgs.sno){
                        // cmdstatus.eq(i).html('<font color="#0B8DED">'+pro+'%</font>');
                        cmdstatus.eq(i).addClass("cmstatus")
                        cmdstatus.eq(i).html('<div class="progress" style="width:'+pro+'%;">'+pro+'%</div>')
                        if(cmds == "operate"){
                            cmdstatus.eq(i).removeClass("cmstatus")
                        }
                    }
                };
                //广告发送
                var sendarr = [];
                for(var i=0;i<myledsend.length;i++){
                    var listval = myledsend.eq(i).attr("data-val");
                    var listid = myledsend.eq(i).find(".textid").text();
                    var sendled = myledsend.eq(i).find(".textid3");
                    // var dendval = myledsend.eq(i).parents(".sendledul").siblings("li").attr("data-val");
                    if(listid == msgs.ids_dev && listval == msgs.sno){
                        // sendled.html('<div class="progress" style="width:'+pro+'%;">'+pro+'%</div>');
                        sendled.html('<font color="#fff">'+pro+'%</font>');
                    }
                }
            };

            //获取设备参数数据推送
            if(cmds == "get_instruct"){
                //截取url参数
                var url = window.location.search;
                s_url = url.substring(1, url.length);
                var URL = s_url.split("?")[0].split("=")[1];
                if(URL==5){
                    $(".scanli").hide();
                }
                $(".opacity-mask").css({"background":"initial"});
                $(".opacity-mask .load").hide();
                $(".ledid").val(msgs.ids_dev);
                $("#screenWidth").val(msgs.data.width);
                $("#screenHeight").val(msgs.data.height);
                var colortxt = $(".color-val-alert div").eq(msgs.data.type_color - 1).text();
                $(".color-val").text(colortxt);
                $(".polar-data").attr("data-val",msgs.data.polar_data);
                $(".polar-oe").attr("data-val",msgs.data.polar_oe);
                if(msgs.data.polar_data>0){
                    $(".polar-data").text("高");
                }else{
                    $(".polar-data").text("低");
                }
                if(msgs.data.polar_oe>0){
                    $(".polar-oe").text("高");
                }else{
                    $(".polar-oe").text("低");
                }
                if(msgs.data.backgroup==0){
                    $("#radio1").attr("checked","checked");
                    $("#radio1").val(0);
                }
                if(msgs.data.backgroup==1){
                    $("#radio2").attr("checked","checked");
                    $("#radio2").val(1);
                }

                for (var i=0; i<$(".polar-gray-alert div").length; i++) {
                    if($(".polar-gray-alert div").eq(i).attr("data-val")==msgs.data.gray){
                        $(".polar-gray-alert div").eq(i).addClass("sel-active")
                        $(".polar-gray-alert div").eq(i).siblings().removeClass("sel-active");
                        $(".polar-gray").text($(".polar-gray-alert div").eq(i).text());
                        $(".polar-gray").attr("data-val", msgs.data.gray)
                    }
                }

                var type_scan = $("#scan-type-alert div")
                for (var i=0; i<type_scan.length; i++) {
                    if(type_scan.eq(i).attr("data-val")==msgs.data.type_scan){
                        var txt = type_scan.eq(i).text();
                        $("#scan-type").text(txt);
                        $("#scan-type").attr("data-val",msgs.data.type_scan);
                    }
                }
                $(".par-btn .read").addClass("btn-read");
            };

            //指令结果推送
            if(cmds == "operate"){
                // par 为定义的全局变量(读取屏参时使用)
                if(par == 1){
                    if(msgs.status == 1){
                        $(".opacity-mask .load").hide();
                        $(".opacity-mask").css({"background-color":"#fff"});
                        if(!$(".opacity-mask div").hasClass("imgBox")){
                            $(".parameter-main-list").hide();
                            $(".opacity-mask").append('<div class="imgBox" style="padding:40px;margin-top:25%;"><img style="max-width:100%" src="../images/read.png" /></div>');
                        }
                    };
                };
                for(var i=0;i<history.length;i++){
                    var dataval = history.eq(i).attr("data-val");
                    var ledid = history.eq(i).find(".led-meg").find(".ledids").text();
                    if(ledid == msgs.ids_dev && dataval == msgs.sno){
                        if(msgs.status == 1){
                            cmdstatus[i].html('<font color="#666666">等待发送</font>');
                        };
                        if(msgs.status == 2){
                            cmdstatus[i].html('<font color="#0B8DED">正在发送</font>');
                        };
                        if(msgs.status == 3){
                            cmdstatus[i].html('<font color="#18AB3F">成功</font>');
                        };
                        if(msgs.status == 4){
                            cmdstatus[i].html('<font color="#ff0000">失败</font>');
                        };
                    }
                };
                // 广告删除指令
                if(par == 2){
                    //删除的指定的广告
                    $("#"+ msgs.sno +"").remove();
                    var txt = '删除成功'
                    var id = $(".ledrecord");
                    common.prompt(txt, id)
                }
            };
            // 广告结果推送
            if(cmds == "program"){
                //广告历史
                for(var i=0;i<history.length;i++){
                    var cmdtype = history.eq(i).find(".cmd-type").find("span").text();
                    var dataval = history.eq(i).attr("data-val");
                    if(cmdtype == msgs.ids_dev && dataval == msgs.sno){
                        if(msgs.status == "1"){
                            cmdstatus.eq(i).html('<font color="#666666">等待发送</font>');
                        };
                        if(msgs.status == "2"){
                            cmdstatus.eq(i).html('<font color="#0B8DED">正在发送</font>');
                        };
                        if(msgs.status == "3"){
                            cmdstatus.eq(i).html('<font color="#18AB3F">成功</font>');
                        };
                        if(msgs.status == "4"){
                            cmdstatus.eq(i).html('<font color="#ff0000">失败</font>');
                        }
                    }
                };
                //广告发送
                var ids = msgs.ids_dev.split(",");
                for(var i=0;i<ids.length;i++){
                    sendarrys.push(ids[i]+msgs.sno+"_"+msgs.status);
                }
            };

             ****/
        };

        socket.onclose = function(event) {
            if (bStop)
                return;
            reconnect()
        };
    }

    function reconnect() {
        if (bStop)
            return;

        //console.log('断开重连..........')
        socket.onopen = function(event) {
            // 发送一个初始化消息
            datacok = {
                Type: 'login',
                user: userstate,
                token: scckettoken
            };
            socket.send(JSON.stringify(datacok));
            socketdata = {
                Type: 'ping',
                user: userstate,
                token: scckettoken
            }
            pingInterval && clearInterval(pingInterval);
            pingInterval = setInterval(function() {
                socket.send(JSON.stringify(socketdata));
            }, 30000);
        };
    }


    instance.disConnect = function(){
        pingInterval && clearInterval(pingInterval);
        bStop = true;
        socket && socket.close();
    };

};

const YsWebSocket = new MakeWebSocket();
export default YsWebSocket;
