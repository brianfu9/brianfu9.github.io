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
        'about', 'clear', 'contact', 'github', 'help', 'projects', 'resume'
    ];

    const CMDS_ADVANCED = [
        'date', 'echo', 'su'
    ]

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

    //
    function inputTextClick_(e) {
        this.value = this.value;
    }

    //
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

    //
    function processNewCommand_(e) {
        if (e.keyCode == 9) { // tab
            e.preventDefault();
            // Implement tab suggest.
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
                // 'about', 'contact', 'github', 'help', 'projects', 'resume'
                case 'about':
                    output(`<p>Hello! I'm Brian Fu, a third year student at the University of California, Berkeley.</p>`);
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
                        output('<p>This is a command-line style profile. To get started, try out some of these commands:</p><div class="ls-files">' + cmdslst + '</div>');
                    }
                    break;
                case 'projects':
                    output(cmd + ': command coming soon!');
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
        init: function() {
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