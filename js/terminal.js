
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

var ipinfo;

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_ = document.querySelector(cmdLineContainer);
    var output_ = document.querySelector(outputContainer);

    const CMDS_ = [
        'about', 'clear', 'contact', 'github', 'menu', 'projects', 'resume', 'welcome'
    ];

    const CMDS_ADVANCED = [
        'date', 'echo', 'emacs', 'man', 'ping', 'su', 'vim'
    ];

    const CMDS_ALIAS = [
        'ls', 'dir', 'help', 'ifconfig', 'portfolio', 'sudo'
    ]

    var cmds_to_trie = [];
    CMDS_.forEach((a) => {
        cmds_to_trie.push({
            cmd: a
        })
    });
    CMDS_ADVANCED.forEach((a) => {
        cmds_to_trie.push({
            cmd: a
        })
    });
    CMDS_ALIAS.forEach((a) => {
        cmds_to_trie.push({
            cmd: a
        })
    });

    const trie = createTrie(cmds_to_trie, 'cmd');

    var latest_command = '';
    var matches = []

    var fs_ = null;
    var cwd_ = null;
    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

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
            e.preventDefault();

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute('id');
            line.classList.add('line');
            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly = true;
            output_.appendChild(line);

            if (this.value.match(/['"`{}<>\\]/g)) {
                output(`<p>THAT'S NOT SANITARY >:(</p>`);
                window.scrollTo(0, getDocHeight_());
                this.value = ''; // Clear/setup line for next input.
                return;
            }

            if (this.value) {
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }

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
            process_command(cmd, args)

            window.scrollTo(0, getDocHeight_());
            this.value = ''; // Clear/setup line for next input.
            console.log(`${history_.length} : executed > [${history_[history_.length - 1]}]`);
        }
    }

    function process_command(cmd, args) {
        switch (cmd) {
            case 'welcome':
                output(
                    `<p>Hello there, welcome to my terminal! 
                    You may have seen one before in a 90's hacker movie with green scrolling text and lots of progress bars. 
                    Instead of clicking on links to navigate this site, just type where you want to go and hit enter! 
                    </br>
                    Feel free to hack around or take a look at some of my <a onclick="term.triggerCommand(this.textContent);">projects</a>. 
                    If you're looking for somewhere to start, click <a onclick="term.triggerCommand(this.textContent);">menu</a>.</p>`
                );
                break;
            case 'about':
                if (args[0] == '-t' || args[0] == '-terminal') {
                    output(
                        `<p>So, you're interested in learing more about this website! 
                        brianfu.me is hosted as a static page on Github Pages. It is a personal website designed to emulate the feel of a computer terminal.
                        Try out the up and down arrow keys to navigate the commands history, tab for autocompletion and the animated typing sequence.</p>`
                    )
                } else {
                    output(
                        `<p>Hi there! I'm Brian Fu, a fourth year Computer Science student at the University of California, Berkeley. Go Bears!</p>
                        <p>I grew up in the sunny suburbia of Orange County but ${ipinfo ? 'have always wanted to visit ' + ipinfo.district : 'spend most of my time in the Bay Area'}. 
                        My hobbies include attending hackathons and listening to music. 
                        I am a classical pianist of 13 years but dream of improv jazz riffs and anime ost's. 
                        If you've got any music, food or travel recommendations, please shoot me a message at <a onclick="term.triggerCommand(this.textContent);">contact</a>!</p>`
                    );
                }
                break;
            case 'bearfaced':
                window.open('https://bearfaced.brianfu.me', '_blank');
                output(
                    `<p>ʕ •ᴥ•ʔ</br>Bear Faced is the CalHacks 2018 project by Brian Fu and Bryant Bettencourt. 
                    Uses facial and emotion detection to paste a picture of an emotive bear's face over the same emotion on your face. 
                    Try it out <a href="https://bearfaced.brianfu.me" target="_blank">here</a> via repl.it! (may take a minute to load)
                    <div class="github-button-div">
                        <a class="github-button" href="https://github.com/brianfu9/bearfaced"
                        data-size="large">Bear Faced</a>
                    </div></p>`
                );
                buttonify();
                break;
            case 'hangman':
                window.open('http://hangman.brianfu.me', '_blank');
                output(
                    `<p>Hangman is a school project exhibiting the use of Ruby and Heroku. 
                    Unfortunately, due to being a school project, the source code is not published.
                    Try it out <a href="http://hangman.brianfu.me" target="_blank">here</a>!
                    </p>`
                );
                break;
            case 'clear':
                output_.innerHTML = '';
                this.value = '';
                return;
            case 'contact':
                output(
                    `You can contact me here!
                    <ul>
                        <li>LinkedIn: <a href="https://www.linkedin.com/in/brian-fu" target="_blank">linkedin/brian-fu</a></li>
                        <li>Email: 
                        <div class="hintbox">
                            <a id="email${history_.length}" tabindex="0" onclick="copyToClipboard(\'brianfu9@gmail.com\');">
                            brianfu9@gmail.com </a>
                            <span class="hintboxtext">copy to clipboard</span>
                        </div>
                        </li>
                    </ul>
                    Email probably works best.`

                );
                break;
            case 'github':
                window.open('https://github.com/brianfu9', '_blank');
                output('<p><a href="https://github.com/brianfu9" target="_blank">https://github.com/brianfu9</a></p>');
                break;
            case 'ls':
            case 'dir':
            case 'help':
            case 'menu':
                var cmdslst = '<a onclick="term.triggerCommand(this.textContent);">' + CMDS_.join('</a><br><a onclick="term.triggerCommand(this.textContent);">') + '</a>';
                if (args[0] && args[0].toLowerCase() == '-all') {
                    cmdslst += '</div><br><p>many secret. much hidden. wow:</p><div class="ls-files">' +
                        '<a onclick="term.triggerCommand(this.textContent);">' +
                        CMDS_ADVANCED.join('</a><br><a onclick="term.triggerCommand(this.textContent);">') + '</a>';
                    output(`<p>Wow you\'re an advanced user! If you want to learn what each command does, use <a onclick="term.triggerCommand(this.textContent);">man</a> followed by a command.</p>
                    <div class="ls-files">` + cmdslst + '</div>');
                } else {
                    output('<p>Here is a list of commands:</p><div class="ls-files">' + cmdslst +
                        '</div><p>If you\'d like to see the complete list, try out "<a onclick="term.triggerCommand(this.textContent);">menu -all</a>"</p>');
                }
                break;
            case 'ping':
            case 'ifconfig':
                output_.insertAdjacentHTML('beforeEnd', `<div id="loading${history_.length}" style="width:90%;margin-left:40px;"></div>`);
                var typed = new Typed(`#loading${history_.length}`, {
                    strings: ['ping ... ping?^300', 'ping ... pong?^300', 'ping ... ^300pung!^700'],
                    typeSpeed: 50,
                    showCursor: false,
                    backSpeed: 50,
                    onComplete: () => {
                        delete ipinfo.success;
                        $(`#loading${history_.length}`).html(JSON.stringify(ipinfo).slice(1, -1).replace(/,"/g, '<br>"').replace(/"/g, ' '));
                        window.scrollTo(0, getDocHeight_());
                    }
                });
                break;
            case 'project':
            case 'projects':
            case 'portfolio':
                proj = new Projects(output_);
                output(`If you're interested in seeing the source code for any of these projects, check out my <a onclick="term.triggerCommand(this.textContent);">github</a>! `)
                break;
            case 'resume':
                window.open('assets/documents/BrianFu_resume.pdf', '_blank');
                output(`<p><a href="assets/documents/BrianFu_resume.pdf" target="_blank">Resumé</a><p>`);
                break;
            case 'date':
            case 'time':
                output(new Date());
                break;
            case 'echo':
                output(args.join(' '));
                break;
            case 'su':
                var root = 'root';
                if (args[0]) root = args[0];
                if (root.match(/[-[\]'"`{}()<>*+?%,\\^$|#]/g)) {
                    output(`<p>THAT'S NOT SANITARY >:(</p>`);
                } else {
                    $('#input-line .prompt').html(`[<span class="user">${root}</span>@brianfu.me] > `);
                }
                break;
            case 'vim':
                output(`try > <a onclick="term.triggerCommand(this.textContent);">emacs</a> instead`);
                break;
            case 'emacs':
                output(`try > <a onclick="term.triggerCommand(this.textContent);">vim</a> instead`);
                break;
            case 'sudo':
                output(`sudo: permission denied`);
                break;
            case 'man':
                man_command(args);
                break;
            default:
                if (cmd) {
                    output(cmd + ': command not found');
                }
        }
    }

    function man_command(args) {
        switch (args[0]) {
            case 'about':
                output('usage: <br> > about <br> displays the about me introduction message. <br> > about -terminal <br> displays information about how the terminal works.');
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
            case 'menu':
                output(`usage: <br> > ${args[0]} <br> shows a list of simple commands <br> > ${args[0]} -all <br> shows a list of all commands`);
                break;
            case 'portfolio':
                output('usage: <br> > portfolio <br> shows my portfolio.');
                break;
            case 'ping':
            case 'ifconfig':
                output(`usage: <br> > ${args[0]} <br> displays the user's ip information`);
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
                output(`usage: <br> > man [command] <br> <div style="margin-left:20px">usage: <br> > man [command] <br> <div style="margin-left:20px">usage: <br> > man [command] <br> 
                <div style="margin-left:20px">usage: <br> > man [command] <br> <div style="margin-left:20px">ERROR STACK OVERFLOW</div></div></div></div><br>
                jk man explains what [command] does`);
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
    }

    function triggerCommand(command) {
        cmdLine_.focus();
        var typed = new Typed("#input-line .cmdline", {
            strings: [command],
            typeSpeed: 75,
            onDestroy: () => {
                var el = document.querySelector("#input-line .cmdline");
                el.value = command;
                var eventObj = document.createEventObject ?
                    document.createEventObject() : document.createEvent("Events");
                if (eventObj.initEvent) {
                    eventObj.initEvent("keydown", true, true);
                }
                eventObj.keyCode = 13;
                eventObj.which = 13;
                el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);
            }
        });
        setTimeout(function () {
            typed.destroy();
        }, command.length * 150);
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
            colWidth, 'px;', height, '">'
        ];
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
        init: function (command) {
            document.getElementById('top').insertAdjacentHTML('beforeEnd', '<p>Click "<a onclick="term.triggerCommand(this.textContent);">about</a>" for more information or "<a onclick="term.triggerCommand(this.textContent);">menu</a>" for a list of commands.  <a href="https://github.com/brianfu9" target="_blank"><i class="fab fa-github" style="color:#EDED65"></i></a> <a href="https://www.linkedin.com/in/brian-fu/" target="_blank"><i class="fab fa-linkedin" style="color:#EDED65"></i></a></p>');
            // setTimeout(() => {term.triggerCommand('about')}, 400);
            term.triggerCommand(command);
        },
        triggerCommand: triggerCommand,
        output: output
    }
};

$(function () {

    // Set the command-line prompt to include the user's IP Address
    $('.prompt').html(`[<span class="user">user</span>@brianfu.me] > `);
    $.getJSON('https://json.geoiplookup.io/', function (data) {
        delete data.premium;
        delete data.cached;
        ipinfo = data;
        $('.prompt').html(`[<span class="user">${ipinfo.ip.length < 16 ? ipinfo.ip : 'user'}</span>@brianfu.me] > `);
    });

    // Initialize a new terminal object
    term = new Terminal('#input-line .cmdline', '#container output');
    if (window.location.hash) {
        var command = window.location.hash;
        term.init(command.slice(1));
    } else term.init('welcome');

});