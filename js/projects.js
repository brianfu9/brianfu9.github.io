var Projects = Projects || function (output_) {
    // Relative, not absolute: an absolute brianfu.me URL makes this a
    // cross-origin request whenever the site is served from anywhere else
    // (github.io, a local preview), where it fails CORS.
    $.ajax({
        url: 'html/projects.html',
        success: function (data) {
            output_.insertAdjacentHTML('beforeEnd', data);
            buttonify();
        }
    });
}
