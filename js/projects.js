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

const projectsHtmlString =
    `<div class="projects-card" id="projects-card">
        <div class="row" id="projects-content">
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/grow.jpeg" width="310" height="394" alt="grow" />
                    <div class="date"><span class="year">2021</span><span class="month">Spring</span></div>
                    <figcaption>
                        <h3>Grow.ai</h3>
                        <h5>Cannabis Grow Box</h5>
                        <p>Uplift the cannabis industry by providing insights to the health of every
                            cannabis plant, removing the ambiguity of giving a plant what it needs, and
                            radically improving the ecological impact that cannabis grow operations have on
                            the planet.</p>
                        <button class="tags">Start-Up</button>
                        <button class="tags">Electron</button>
                        <button class="tags">Cordova</button>
                        <button class="tags">Javascript</button>
                        <button class="tags">Machine Learning</button>
                        <button class="tags">Computer Vision</button>
                        <button class="tags">Rekognition</button>
                    </figcaption>
                    <a href="https://github.com/grow-ai/KM-1" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/grow-ai/KM-1"
                        data-size="large">Grow.ai</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/kinesis.png" width="310" height="394" alt="Kinesis" />
                    <div class="date"><span class="year">2020</span><span class="month">Fall</span></div>
                    <figcaption>
                        <h3>Kinesis.ai</h3>
                        <h5>AI for physical rehabilitation</h5>
                        <p>Uses computer vision to accurately identify body movements and exercises
                            performed by patients in real-time. An early-stage start-up spun out of UC
                            Berkeley in association with OST Switzerland.</p>
                        <button class="tags">Start-Up</button>
                        <button class="tags">Machine Learning</button>
                        <button class="tags">Manifold Learning</button>
                        <button class="tags">Computer Vision</button>
                        <button class="tags">Python</button>
                        
                    </figcaption>
                    <a href="https://youtu.be/iFwAElI6CTI?t=3194" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/DataX_general"
                        data-size="large">Kinesis.ai</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/cs184.png" width="310" height="394" alt="cs184" />
                    <div class="date"><span class="year">2020</span><span class="month">Spring</span></div>
                    <figcaption>
                        <h3>CS 184</h3>
                        <h5>Foundations of Computer Graphics</h5>
                        <p>Implemented various rendering engines from physics simulations to ray tracing and shaders.</p>
                        <button class="tags">C#</button>
                        <button class="tags">Rendering</button>
                        <button class="tags">Berkeley</button>
                        <button class="tags">Coursework</button>
                    </figcaption>
                    <a href="https://brianfu.me/html/graphics" target="_blank"></a>
                </figure>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/subar.jpeg" width="310" height="394" alt="SubAR" />
                    <div class="date"><span class="year">2019</span><span class="month">Sept</span>
                    </div>
                    <figcaption>
                        <h3>Sub-AR</h3>
                        <h5>HackMIT</h5>
                        <p>Generates subtitles in augmented reality that follow the people speaking
                            utilizing multiple-microphone triangulation and facial detection.</p>
                        <button class="tags">Waveform Analysis</button>
                        <button class="tags">Python</button>
                        <button class="tags">Rev.ai</button>
                        <button class="tags">OpenCV2</button>
                    </figcaption>
                    <a href="https://devpost.com/software/subtitles-irl" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/alexwyao/sub-AR"
                        data-size="large">Sub-AR</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/map.png" width="310" height="394" alt="GCWeb" />
                    <div class="date"><span class="year">2019</span><span class="month">May</span></div>
                    <figcaption>
                        <h3>Man Maps</h3>
                        <h5>Minimal Navigation App</h5>
                        <p>A minimalist navigation platform that doesn't show you where your
                            destination is, where you are, or anything in between. Man maps simply points
                            you in the right direction and tells you how far you need to go.</p>
                        <button class="tags">Mobile</button>
                        <button class="tags">Android</button>
                        <button class="tags">Java</button>
                        <button class="tags">Geocoding</button>
                    </figcaption>
                    <a href="https://github.com/brianfu9/manmaps/releases" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/manmaps"
                        data-size="large">Man Maps</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="./assets/images/bear.png" width="310" height="394" alt="Bear Faced" />
                    <div class="date"><span class="year">2018</span><span class="month">Nov</span></div>
                    <figcaption>
                        <h3>Bear Faced</h3>
                        <h5>Cal Hacks</h5>
                        <p>Utilizes emotion detection and image labeling neural networks to paste an image
                            of a bear's face with your emotion on your face.</p>
                        <button class="tags">Flask</button>
                        <button class="tags">Google Cloud Vision</button>
                        <button class="tags">Python</button>
                        <button class="tags">REST API</button>
                        <button class="tags">Pillow</button>
                        <button class="tags">Google CSE</button>
                    </figcaption>
                    <a href="https://www.hackerearth.com/challenges/hackathon/cal-hacks-50/dashboard/96567fd/submission/bear-faced/"
                        target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/bearfaced"
                        data-size="large">Bear Faced</a>
                </div>
            </div>
        </div>
    </div>`;