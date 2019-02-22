$.ajaxSetup({async: false});
const start = 'http://nyc.cs.berkeley.edu:8081/service/gamesman/puzzles/4to0/getStart';
var value = 11;
var response1 = 0;
var response2 = 0;
$(document).ready(function() {
    $.getJSON(start, function(result){
        value = result['response'];
        $('#board').replaceWith(`<h1 id="board">${value}</h1>`);
        $('#value').replaceWith(`<h2 id="value">Unknown</h2>`);
    });
    var next = `http://nyc.cs.berkeley.edu:8081/service/gamesman/puzzles/4to0/getNextMoveValues?board=${value}`;
    $.getJSON(next, function(result){
        response1 = result['response'][0];
        response2 = result['response'][1];
        $('.btn1').css("background-color", "black");
        $('.btn2').css("background-color", "black");
        if (response1["value"] == "win"){
            $('.btn1').css("background-color", "red");
        } else if (response1["value"] == "lose") {
            $('.btn1').css("background-color", "green");
        }
        if (response2["value"] == "win"){
            $('.btn2').css("background-color", "red");
        } else if (response2["value"] == "lose") {
            $('.btn2').css("background-color", "green");
        }
        // $('.btn1').html(response1['board']);
        // $('.btn2').html(response2['board']);
    });
});

$('.btn1').click(function(){
    $('#board').replaceWith(`<h1 id="board">${response1['board']}</h1>`);
    $('#value').replaceWith(`<h2 id="value">${response1['value']}</h2>`);
    value = response1['board'];
    var next = `http://nyc.cs.berkeley.edu:8081/service/gamesman/puzzles/4to0/getNextMoveValues?board=${value}`;
    $.getJSON(next, function(result){
        response1 = result['response'][0];
        $('.btn1').css("background-color", "black");
        if (response1["value"] == "win"){
            $('.btn1').css("background-color", "red");
        } else if (response1["value"] == "lose") {
            $('.btn1').css("background-color", "green");
        }
        // $('.btn1').html(response1['board']);
        response2 = result['response'][1];
        $('.btn2').css("background-color", "black");
        if (response2["value"] == "win"){
            $('.btn2').css("background-color", "red");
        } else if (response2["value"] == "lose") {
            $('.btn2').css("background-color", "green");
        }
        // $('.btn2').html(response2['board']);
    });
});

$('.btn2').click(function(){
    $('#board').replaceWith(`<h1 id="board">${response2['board']}</h1>`);
    $('#value').replaceWith(`<h2 id="value">${response2['value']}</h2>`);
    value = response2['board'];
    var next = `http://nyc.cs.berkeley.edu:8081/service/gamesman/puzzles/4to0/getNextMoveValues?board=${value}`;
    $.getJSON(next, function(result){
        response1 = result['response'][0];
        $('.btn1').css("background-color", "black");
        if (response1["value"] == "win"){
            $('.btn1').css("background-color", "red");
        } else if (response1["value"] == "lose") {
            $('.btn1').css("background-color", "green");
        }
        // $('.btn1').html(response1['board']);
        response2 = result['response'][1];
        $('.btn2').css("background-color", "black");
        if (response2["value"] == "win"){
            $('.btn2').css("background-color", "red");
        } else if (response2["value"] == "lose") {
            $('.btn2').css("background-color", "green");
        }
        // $('.btn2').html(response2['board']);
    });
});

$('.restart').click(function(){
    $.getJSON(start, function(result){
        value = result['response'];
        $('#board').replaceWith(`<h1 id="board">${value}</h1>`);
        $('#value').replaceWith(`<h2 id="value">Unknown</h2>`);
    });
    var next = `http://nyc.cs.berkeley.edu:8081/service/gamesman/puzzles/4to0/getNextMoveValues?board=${value}`;
    $.getJSON(next, function(result){
        response1 = result['response'][0];
        response2 = result['response'][1];
        $('.btn1').css("background-color", "black");
        $('.btn2').css("background-color", "black");
        if (response1["value"] == "win"){
            $('.btn1').css("background-color", "red");
        } else if (response1["value"] == "lose") {
            $('.btn1').css("background-color", "green");
        }
        if (response2["value"] == "win"){
            $('.btn2').css("background-color", "red");
        } else if (response2["value"] == "lose") {
            $('.btn2').css("background-color", "green");
        }     
        // $('.btn1').html(response1['board']);
        // $('.btn2').html(response2['board']);
    });
});