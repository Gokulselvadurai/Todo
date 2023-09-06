var i = 0;
$(document).ready(function(){
    $(".glist").toggle();
    function vis(){
        $(".list").css('visibility', 'hidden');
        $('input').filter(':checkbox').prop('checked',false);
    }
    $(".group").click((event)=>{
        $(".glist").toggle();
    });
    $(":checkbox").click(function(event){
        let str = event.target.id;
        str = ".list"+str.substring(5, str.length);
        console.log(str);
        let tsk = ".task"+event.target.id;
        if($(this).prop("checked") == false){
            $(str).css('visibility', 'hidden');
        }
        else{
            vis();
            $(this).prop("checked",true);
            $(str).css('visibility', 'visible');
        }
    });
});