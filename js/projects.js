var Projects = Projects || function (output_) {
    $.ajax({
        url: 'https://brianfu.me/html/projects.html', 
        success: function (data) {
            output_.insertAdjacentHTML('beforeEnd', data);
            buttonify();
        }
    });

    // output_.insertAdjacentHTML('beforeEnd', projectsHtmlString);
    // buttonify();

    // ~~~~~ scrolling implementation ~~~~~
    // var nav = document.getElementById('projects-card');
    // var content = document.getElementById('projects-content')
    // console.log(nav);
    // console.log(content);
    // nav.setAttribute("data_overflowing", determineOverflow(content, nav));

    // var last_known_scroll_position = 0;
    // var ticking = false;

    // function doSomething(scroll_pos) {
    //     nav.setAttribute("data_overflowing", determineOverflow(content, nav));
    // }

    // nav.addEventListener("scroll", function() {
    //     last_known_scroll_position = window.scrollY;
    //     if (!ticking) {
    //         window.requestAnimationFrame(function() {
    //             doSomething(last_known_scroll_position);
    //             ticking = false;
    //         });
    //     }
    //     ticking = true;
    // });

    // function determineOverflow(content, container) {
    //     var containerMetrics = container.getBoundingClientRect();
    //     var containerMetricsRight = Math.floor(containerMetrics.right);
    //     var containerMetricsLeft = Math.floor(containerMetrics.left);
    //     var contentMetrics = content.getBoundingClientRect();
    //     var contentMetricsRight = Math.floor(contentMetrics.right);
    //     var contentMetricsLeft = Math.floor(contentMetrics.left);
    //     if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
    //         return "both";
    //     } else if (contentMetricsLeft < containerMetricsLeft) {
    //         return "left";
    //     } else if (contentMetricsRight > containerMetricsRight) {
    //         return "right";
    //     } else {
    //         return "none";
    //     }
    // }

}
