var Blogs = Blogs || {

    run: function (name, output_) {
        if (!name || name.length == 0) {
            this.menu(output_);
            return;
        }
        if (this.blogs[name]) {
            output_.insertAdjacentHTML('beforeEnd', this.blogs[name]);
        } else {
            output_.insertAdjacentHTML('beforeEnd', '<p>No such blog</p>');
        }
    },

    menu: function (output_) {
        var blogsMenu = `<p>Topics:</p><p><a onclick="term.triggerCommand('blog ' + this.textContent);">` + Object.keys(this.blogs).join(`</a><br><a onclick="term.triggerCommand('blog ' + this.textContent);">`) + `</a></p>`;
        output_.insertAdjacentHTML('beforeEnd', blogsMenu);
    },

    blogs: {
        'distance': `
        <p>Distance is empowering.&nbsp;</p>

        <p>&nbsp;</p>
        
        <p>Running cross country in highschool, we would average 300 miles per season. To put that in context, the distance from LA to the Bay Area is just over 300 miles; a seemingly impossible distance to run, yet step by step we overcame. Over those 12 weeks, I grew an emotional attachment to my beat-up adidas flyknit sneakers, refusing to replace them until the soles grew holes. But more than that, I developed an unhealthy disrespect for the gargantuan effort that is distance.</p>
        
        <p>Backpack 40 miles around Mont Blanc carrying 30 pounds of camping gear and food? no sweat.&nbsp;</p>
        
        <p>A roadtrip from San Jose, CA to Austin, Texas? 1,700 miles is just under 6 seasons. I could run that. <sup>(theoretically)</sup>&nbsp;</p>
        
        <p>Walk 15 minutes to get take-out for dinner? ...better get it delivered.&nbsp;</p>
        `
    }
}