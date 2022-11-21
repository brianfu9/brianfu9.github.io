var Blogs = Blogs || {

    run: function (args, output_) {
        if (!args || args.length == 0) {
            this.menu(output_);
            return;
        }
        if (this.blogs[args[0]]) {
            output_.insertAdjacentHTML('beforeEnd', text);
        } else {
            output_.insertAdjacentHTML('beforeEnd', '<p>No such blog</p>');
        }
    },

    menu: function (output_) {
        var blogsMenu = `<p>Blogs:</p><p><a onclick="term.triggerCommand('blog ' + this.textContent);">` + Object.keys(this.blogs).join(`</a><br><a onclick="term.triggerCommand('blog ' + this.textContent);">`) + `</a></p>`;
        output_.insertAdjacentHTML('beforeEnd', blogsMenu);
    },

    blogs: {
        'blog1': ''
    }
}