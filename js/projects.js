var Projects = Projects || function (output_) {

    output_.insertAdjacentHTML('beforeEnd', projectsHtmlString);
    buttonify();

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
                    <img src="assets/images/map.png" width="310" height="394" alt="GCWeb" />
                    <div class="date"><span class="year">2019</span><span class="month">May</span></div>
                    <figcaption>
                        <h3>Man Maps</h3>
                        <h6>Minimal Navigation App</h6>
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
                    <img src="assets/images/gcweb.png" width="310" height="394" alt="GCWeb" />
                    <div class="date"><span class="year">2018</span><span class="year">2019</span></div>
                    <figcaption>
                        <h3>Gamesman Web</h3>
                        <h6>Undergraduate Research</h6>
                        <p>Combinatorial game theory led by Dr. Dan Garcia. Strongly solving
                            perfect-information abstract strategy games.</p>
                        <button class="tags">Game Theory</button>
                        <button class="tags">C</button>
                        <button class="tags">Hashing</button>
                        <button class="tags">Unix</button>
                    </figcaption>
                    <a href="http://gamescrafters.berkeley.edu/" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/GamesCrafters"
                        data-size="large">Gamescrafters</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="assets/images/slowly.png" width="310" height="394" alt="$lowly" />
                    <div class="date"><span class="year">2019</span><span class="month">Mar</span></div>
                    <figcaption>
                        <h3>$lowly</h3>
                        <h6>LA Hacks</h6>
                        <p>Gamification of driving to encourage safe driving behavior. Utilizes Smartcar API
                            to extrapolate driving characteristics and intelligently assign a driving score.
                        </p>
                        <button class="tags">Smartcar API</button>
                        <button class="tags">OAuth 2</button>
                        <button class="tags">Node</button>
                        <button class="tags">Express</button>
                        <button class="tags">Bootstrap</button>
                    </figcaption>
                    <a href="https://devpost.com/software/lowly" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/slowly"
                        data-size="large">Slowly</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="assets/images/lifework.png" width="310" height="394" alt="LifeworkOnline" />
                    <div class="date"><span class="year">2019</span><span class="month">Mar</span></div>
                    <figcaption>
                        <h3>Lifework Online</h3>
                        <h6>Launchathon</h6>
                        <p>Developed MVP escrow service for guarteeing payments to freelance workers though
                            the Stripe api.</p>
                        <button class="tags">Node</button>
                        <button class="tags">Express</button>
                        <button class="tags">Sessions</button>
                        <button class="tags">Stripe API</button>
                        <button class="tags">Bootstrap</button>
                    </figcaption>
                    <a href="https://www.lifeworkonline.com/" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/lifework"
                        data-size="large">Lifework</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="assets/images/bear.png" width="310" height="394" alt="Bear Faced" />
                    <div class="date"><span class="year">2018</span><span class="month">Nov</span></div>
                    <figcaption>
                        <h3>Bear Faced</h3>
                        <h6>Cal Hacks</h6>
                        <p>Utilizes emotion detection and image labeling neural networks to paste an image
                            of a bear's face with your emotion on your face.</p>
                        <button class="tags">Flask</button>
                        <button class="tags">Google Cloud Vision</button>
                        <button class="tags">Python</button>
                        <button class="tags">REST API</button>
                        <button class="tags">Pillow</button>
                        <button class="tags">Google CSE</button>
                    </figcaption>
                    <a href="https://calhacks5.hackerearth.com/sprints/cal-hacks-50/dashboard/96567fd/submission/"
                        target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/bearfaced"
                        data-size="large">Bear Faced</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile"><img src="assets/images/isho.png" width="310" height="394" alt="iSho" />
                    <div class="date"><span class="year">2018</span><span class="month">Sep</span></div>
                    <figcaption>
                        <h3>iSho</h3>
                        <h6>HackMIT</h6>
                        <p>Interactive force graph of interconnected global financial markets.</p>
                        <button class="tags">Kensho</button>
                        <button class="tags">Javascript</button>
                        <button class="tags">D3JS</button>
                        <button class="tags">Flask</button>
                        <button class="tags">Beautiful Soup</button>
                    </figcaption>
                    <a href="https://devpost.com/software/isho-2mv59n" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/magittan/iSho"
                        data-size="large">iSho</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile"><img src="assets/images/briefly.jpg" width="310" height="394" alt="Briefly" />
                    <div class="date"><span class="year">2018</span><span class="month">Sep</span></div>
                    <figcaption>
                        <h3>Briefly</h3>
                        <h6>HackMIT</h6>
                        <p>Summarizes a lecture or podcast in written form.</p>
                        <button class="tags">Rev.ai</button>
                        <button class="tags">Algorithmia</button>
                        <button class="tags">REST API</button>
                        <button class="tags">MySQL</button>
                        <button class="tags">Natural language processing</button>
                    </figcaption>
                    <a href="https://devpost.com/software/briefly-wpbi0u" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/joeb15/mithacks2018"
                        data-size="large">Briefly</a>
                </div>
            </div>
            <div class="col-sm-">
                <figure class="tile"><img src="assets/images/calamp.jpg" width="310" height="394" alt="CalAmp" />
                    <div class="date"><span class="year">2018</span><span class="other">SUMMER</span></div>
                    <figcaption>
                        <h3>Software Engineering Internship</h3>
                        <h6>CalAmp Corp.</h6>
                        <p>Used deep learning neural networks to classify make/model/year of vehicles.
                            Developed microservice to snap geocoordinates to mapped streets.</p>
                        <button class="tags">Tensorflow</button>
                        <button class="tags">REST API</button>
                        <button class="tags">AWS</button>
                        <button class="tags">Lambda</button>
                        <button class="tags">DynamoDB</button>
                        <button class="tags">A* Graph Search</button>
                    </figcaption>
                    <a href="https://www.calamp.com/" target="_blank"></a>
                </figure>
            </div>
            <div class="col-sm-">
                <figure class="tile">
                    <img src="assets/images/bibo.png" width="310" height="394" alt="BiBo" />
                    <div class="date"><span class="year">2018</span><span class="month">Apr</span></div>
                    <figcaption>
                        <h3>BiBo</h3>
                        <h6>LA Hacks</h6>
                        <p>Scans for numbers or text and automatically creates a phone contact.</p>
                        <button class="tags">Mobile</button>
                        <button class="tags">Android</button>
                        <button class="tags">Java</button>
                        <button class="tags">Google mobile vision</button>
                    </figcaption>
                    <a href="https://devpost.com/software/bibo" target="_blank"></a>
                </figure>
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/DanielTatarkin/BiBo2/tree/Janky"
                        data-size="large">BiBo</a>
                </div>
            </div>
        </div>
    </div>`;