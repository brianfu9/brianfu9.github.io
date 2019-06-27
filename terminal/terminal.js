var term;
var util = util || {};
util.toArray = function (list) {
    return Array.prototype.slice.call(list || [], 0);
};

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(element).select();
    document.execCommand("copy");
    $temp.remove();
}

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_ = document.querySelector(cmdLineContainer);
    var output_ = document.querySelector(outputContainer);

    const CMDS_ = [
        'about', 'clear', 'contact', 'github', 'help', 'portfolio', 'resume'
    ];

    const CMDS_ADVANCED = [
        'cd', 'date', 'dir', 'echo', 'emacs', 'ls', 'man', 'su', 'vim'
    ];

    var cmds_to_trie = [];
    CMDS_.forEach((a) => {cmds_to_trie.push({cmd: a})});
    CMDS_ADVANCED.forEach((a) => {cmds_to_trie.push({cmd: a})});

    const trie = createTrie(cmds_to_trie, 'cmd');

    var latest_command = '';
    var matches = []

    var fs_ = null;
    var cwd_ = null;
    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    window.addEventListener('click', function (e) {
        cmdLine_.focus();
    }, false);

    cmdLine_.addEventListener('click', inputTextClick_, false);
    cmdLine_.addEventListener('keydown', historyHandler_, true);
    cmdLine_.addEventListener('keydown', processNewCommand_, true);

    function inputTextClick_(e) {
        this.value = this.value;
    }

    function historyHandler_(e) {
        if (history_.length) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                if (history_[histpos_]) {
                    history_[histpos_] = this.value;
                } else {
                    histtemp_ = this.value;
                }
            }

            if (e.keyCode == 38) { // up
                histpos_--;
                if (histpos_ < 0) {
                    histpos_ = 0;
                }
            } else if (e.keyCode == 40) { // down
                histpos_++;
                if (histpos_ > history_.length) {
                    histpos_ = history_.length;
                }
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
                this.value = this.value; // Sets cursor to end of input.
            }
        }
    }

    function processNewCommand_(e) {
        if (e.keyCode == 9) { // tab
            e.preventDefault();

            if (latest_command == this.value) {
                matches.push(matches.shift());
            } else {
                matches = trie.getMatches(this.value);
            }

            if (matches) {
                this.value = matches[0]['cmd'];
            } else {
                this.value = this.value;
            }
            latest_command = this.value;
            
        } else if (e.keyCode == 13) { // enter
            // Save shell history.
            if (this.value) {
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute('id');
            line.classList.add('line');
            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly = true;
            output_.appendChild(line);

            if (this.value && this.value.trim()) {
                var args = this.value.split(' ').filter(function (val, i) {
                    return val;
                });
                var cmd = args[0].toLowerCase();
                args = args.splice(1); // Remove cmd from arg list.
                if (cmd == 'cd') {
                    cmd = args[0]
                }
            }
            switch (cmd) {
                case 'about':
                    output(`<p>Hello there! Welcome to my terminal. You've probably seen one before in a 90's hacker movie. Please hack around and take a look at some of my projects. If you're looking for somewhere to start, click <a onclick="triggerCommand(this.textContent);">help</a>.</p> <p>I'm Brian Fu, a third year student at the University of California, Berkeley. Go Bears!</p>`);
                    break;
                case 'clear':
                    output_.innerHTML = '';
                    this.value = '';
                    return;
                case 'contact':
                    output(
                        `<p>You can contact me here!</p>
                            <ul>
                                <li>Phone: (510)833-7002</li>
                                <li>Email: <a id="email${history_.length}" tabindex="0" 
                                    onclick="copyToClipboard(\'brianfu9@gmail.com\');$('#email${history_.length}').popover('show');setTimeout(function(){ $('#email${history_.length}').popover('hide'); }, 1500);" 
                                    data-container="body" data-toggle="popover" data-trigger="focus" data-placement="right" data-content="coppied to clipboard">brianfu9@gmail.com</a></li>
                            </ul>`
                    );
                    break;
                case 'github':
                    window.open('https://github.com/brianfu9', '_blank');
                    output('<p><a href="https://github.com/brianfu9" target="_blank">https://github.com/brianfu9</a></p>');
                    break;
                case 'ls':
                case 'dir':
                case 'help':
                    var cmdslst = '<a onclick="triggerCommand(this.textContent);">' + CMDS_.join('</a><br><a onclick="triggerCommand(this.textContent);">') + '</a>';
                    if (args[0] && args[0].toLowerCase() == '-all') {
                        cmdslst += '</div><br><p>SECRETS uwu:</p><div class="ls-files">' + '<a onclick="triggerCommand(this.textContent);">' + CMDS_ADVANCED.join('</a><br><a onclick="triggerCommand(this.textContent);">') + '</a>';
                        output('<p>Wow you\'re an advanced user! Here\'s a list of secret commands:</p><div class="ls-files">' + cmdslst + '</div>');
                    } else {
                        output('<p>This is a command-line style profile. To get started, try out some of these commands:</p><div class="ls-files">' + cmdslst + '</div><p>If you\'d like a more in-depth explanation, try "<a onclick="triggerCommand(this.textContent);">man help</a>" or any other command.</p>');
                    }
                    break;
                case 'portfolio':
                    output_.insertAdjacentHTML('beforeEnd', 
                    `<div class="projects-card">
                        <div class="row" style="align-content: center;">
                            <div class="col-sm-">
                                <figure class="tile">
                                    <img src="../images/map.png" width="310" height="394" alt="GCWeb" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile">
                                    <img src="../images/gcweb.png" width="310" height="394" alt="GCWeb" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile">
                                    <img src="../images/slowly.png" width="310" height="394" alt="$lowly" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile">
                                    <img src="../images/lifework.png" width="310" height="394" alt="LifeworkOnline" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile">
                                    <img src="../images/bear.png" width="310" height="394" alt="Bear Faced" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile"><img src="../images/isho.png" width="310" height="394" alt="iSho" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile"><img src="../images/briefly.jpg" width="310" height="394" alt="Briefly" />
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
                            </div>
                            <div class="col-sm-">
                                <figure class="tile"><img src="../images/calamp.jpg" width="310" height="394" alt="CalAmp" />
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
                                    <img src="../images/bibo.png" width="310" height="394" alt="BiBo" />
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
                            </div>
                        </div>
                    </div>`);
                    output(`If you're interested in seeing the source code for any of these projects, check out my <a onclick="triggerCommand(this.textContent);">github</a>!`)
                    break;
                case 'resume':
                    window.open('../images/BrianFu_resume-color.pdf', '_blank');
                    output(`<p><a href="../images/BrianFu_resume-color.pdf" target="_blank">Resumé</a><p>`);
                    break;
                case 'date':
                    output(new Date());
                    break;
                case 'echo':
                    output(args.join(' '));
                    break;
                case 'su':
                    var root = 'root';
                    if (args[0]) root = args[0];
                    $('#input-line .prompt').html(`[${root}@brianfu.me] > `);
                    break;
                case 'vim':
                    output(`try > <a onclick="triggerCommand(this.textContent);">emacs</a> instead`);
                    break;
                case 'emacs':
                    output(`try > <a onclick="triggerCommand(this.textContent);">vim</a> instead`);
                    break;
                case 'man':
                    switch (args[0]) {
                        // 'about', 'clear', 'contact', 'github', 'help', 'portfolio', 'resume', 'date', 'echo', 'man', 'su', 'cd'
                        case 'about':
                            output('usage: <br> > about <br> displays the about me introduction message.');
                            break;
                        case 'clear':
                            output('usage: <br> > clear <br> clears the terminal.');
                            break;
                        case 'contact':
                            output('usage: <br> > contact <br> displays my contact info. Clicking the email copies it to clipboard.');
                            break;
                        case 'github':
                            output('usage: <br> > github <br> Opens my github profile in a new tab.');
                            break;
                        case 'ls':
                        case 'dir':
                        case 'help':
                            output(`usage: <br> > ${args[0]} <br> > ${args[0]} -all <br> shows a list of commands`);
                            break;
                        case 'portfolio':
                            output('usage: <br> > portfolio <br> shows my portfolio.');
                            break;
                        case 'resume':
                            output('usage: <br> > resume <br> Opens my resume in a new tab.');
                            break;
                        case 'date':
                            output('usage: <br> > date <br> Displays the date');
                            break;
                        case 'echo':
                            output('usage: <br> > echo [text] <br> prints out the [text] in the terminal');
                            break;
                        case 'man':
                            output('usage: <br> > man [command] <br> <div style="margin-left:20px">usage: <br> > man [command] <br> <div style="margin-left:20px">usage: <br> > man [command] <br> <div style="margin-left:20px">usage: <br> > man [command] <br> <div style="margin-left:20px">ERROR STACK OVERFLOW</div></div></div></div><br>jk man explains what [command] does');
                            break;
                        case 'su':
                            output(`usage: <br> > su <br> > su [name] <br> changes the user's name`);
                            break;
                        case 'cd':
                            output(`usage: <br> > cd [command] <br> runs the [command] <br> yeah I know this one doesn't really make sense but I don't have a file system either`);
                            break;
                        default:
                            if (args[0]) output(args[0] + ': command not found');
                            else output('man: no arguments found');
                    }
                    break;
                default:
                    if (cmd) {
                        output(cmd + ': command not found');
                    }
            }
            window.scrollTo(0, getDocHeight_());
            this.value = ''; // Clear/setup line for next input.
        }
    }

    function formatColumns_(entries) {
        var maxName = entries[0].name;
        util.toArray(entries).forEach(function (entry, i) {
            if (entry.name.length > maxName.length) {
                maxName = entry.name;
            }
        });

        var height = entries.length <= 3 ?
            'height: ' + (entries.length * 15) + 'px;' : '';

        // 12px monospace font yields ~7px screen width.
        var colWidth = maxName.length * 5;

        return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
    }

    //
    function output(html) {
        output_.insertAdjacentHTML('beforeEnd', '<div style="width:90%;margin-left:40px;"><p>' + html + '</p></div>');
    }

    // Cross-browser impl to get document's height.
    function getDocHeight_() {
        var d = document;
        return Math.max(
            Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
            Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
            Math.max(d.body.clientHeight, d.documentElement.clientHeight)
        );
    }

    return {
        init: function () {
            document.getElementById('top').insertAdjacentHTML('beforeEnd', '<p>Enter "<a onclick="triggerCommand(this.textContent);">help</a>" for more information.</p>');
            triggerCommand('about');
        },
        output: output
    }
};

$(function () {

    // Set the command-line prompt to include the user's IP Address
    //$('.prompt').html('[' + codehelper_ip["IP"] + '@HTML5] # ');
    $('.prompt').html(`[user@brianfu.me] > `);

    // Initialize a new terminal object
    term = new Terminal('#input-line .cmdline', '#container output');
    term.init();

});

function triggerCommand(command) {
    var typed = new Typed("#input-line .cmdline", {
        strings: [command],
        typeSpeed: 100
    });
    setTimeout(function () {
        var el = document.querySelector("#input-line .cmdline");
        var eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent("Events");
        if (eventObj.initEvent) {
            eventObj.initEvent("keydown", true, true);
        }
        eventObj.keyCode = 13;
        eventObj.which = 13;
        el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);
    }, command.length * 200);
}
