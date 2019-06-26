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
        'about', 'contact', 'github', 'help', 'projects', 'resume'
    ];

    const CMDS_ADVANCED = [
        'clear', 'date', 'echo'
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
    cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener('keydown', processNewCommand_, false);

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
            line.removeAttribute('id')
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
            }

            if (CMDS_.includes(cmd)) {

                switch (cmd) {
                    // 'about', 'contact', 'github', 'help', 'projects', 'resume'
                    case 'about':
                        output(cmd + ': command coming soon!');
                        break;
                    case 'contact':
                        output('<p>You can contact me here!</p><ul><li>Phone: (510)833-7002</li><li>Email: <a href="#" onclick="copyToClipboard(\'brianfu9@gmail.com\')">brianfu9@gmail.com</a></li></ul>');
                        break;
                    case 'github':
                        output('<p><a href="https://github.com/brianfu9" target="_blank">https://github.com/brianfu9</a></p>');
                        break;
                    case 'help':
                        var cmdslst = CMDS_.join('<br>');
                        if (args[0] && args[0].toLowerCase() == '-all') {
                            cmdslst += '<br>' + CMDS_ADVANCED.join('<br>');
                            output('<p>Wow you\'re an advanced user! Here\'s a list of secret commands:</p><div class="ls-files">' + cmdslst + '</div>');
                        } else {
                            output('<p>Hello! This is a command-line style profile. To get started, try out some of these commands:</p><div class="ls-files">' + cmdslst + '</div>');
                        }
                        break;
                    case 'projects':
                        output(cmd + ': command coming soon!');
                        break;
                    case 'resume':
                        output(cmd + ': command coming soon!');
                        break;
                    default:
                        if (cmd) {
                            output(cmd + ': command coming soon!');
                        }
                }
            } else {
                switch (cmd) {
                    case 'clear':
                        output_.innerHTML = '';
                        this.value = '';
                        return;
                    case 'date':
                        output(new Date());
                        break;
                    case 'echo':
                        output(args.join(' '));
                        break;
                    default:
                        if (cmd) {
                            output(cmd + ': command not found');
                        }
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
        output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
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

    //
    return {
        output: output
    }
};


$(function () {

    // Set the command-line prompt to include the user's IP Address
    //$('.prompt').html('[' + codehelper_ip["IP"] + '@HTML5] # ');
    $('.prompt').html('[user@brianfu.me] > ');

    // Initialize a new terminal object
    var term = new Terminal('#input-line .cmdline', '#container output');
    term.init();

});