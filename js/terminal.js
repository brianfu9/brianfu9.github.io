var term;
var util = util || {};
util.toArray = function (list) {
    return Array.prototype.slice.call(list || [], 0);
};

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
    } catch (e) {
        console.warn('Copy failed', e);
    }
    document.body.removeChild(textarea);
}

var ipinfo;
var ipinfoRequest = null;
var TERMINAL_API_URL = 'https://m1s.dolphin-vector.ts.net';

// Inlined rather than pulled from a CDN so the page makes no third-party
// requests. Icons: Font Awesome Free 5.15.3, CC BY 4.0
// (https://fontawesome.com/license/free).
var ICON_GITHUB = '<svg class="icon" viewBox="0 0 496 512" role="img" aria-hidden="true" focusable="false"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>';
var ICON_LINKEDIN = '<svg class="icon" viewBox="0 0 448 512" role="img" aria-hidden="true" focusable="false"><path fill="currentColor" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>';

// Looks up the visitor's own IP/geo. This is a third-party call, so it fires
// only when a command actually needs the data (ping/ifconfig) — never on page
// load. Cached after the first call; `ipinfo` stays undefined if it fails.
function loadIpInfo() {
    if (!ipinfoRequest) {
        ipinfoRequest = $.getJSON('https://json.geoiplookup.io/').done(function (data) {
            delete data.premium;
            delete data.cached;
            ipinfo = data;
        }).fail(function () {
            ipinfoRequest = null;  // let a later ping retry rather than caching the failure
        });
    }
    return ipinfoRequest;
}

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_ = document.querySelector(cmdLineContainer);
    var output_ = document.querySelector(outputContainer);

    const CMDS_ = [
        'about', 'clear', 'contact', 'github', 'menu', 'projects', 'resume'
    ];

    const CMDS_ADVANCED = [
        'bearfaced', 'date', 'echo', 'emacs', 'ping', 'shader', 'su', 'vim'
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

    var user = 'user';
    var sudoers = ['brian', 'root']

    cmdLine_.addEventListener('click', inputTextClick_, false);
    cmdLine_.addEventListener('keydown', historyHandler_, true);
    cmdLine_.addEventListener('keydown', processNewCommand_, true);

    // Honour prefers-reduced-motion for the smooth scrolling and typing animations.
    var reducedMotionQuery_ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    function prefersReducedMotion_() {
        return !!(reducedMotionQuery_ && reducedMotionQuery_.matches);
    }

    function scrollToBottom_() {
        window.scrollTo({
            top: getDocHeight_(),
            behavior: prefersReducedMotion_() ? 'auto' : 'smooth'
        });
    }

    // Event delegation for clickable links. Bound to #container, not output_,
    // because init() also injects .cmd-link anchors into #top — a sibling of
    // <output>, so clicks there never reach a listener on the output element.
    var container_ = document.getElementById('container');

    function activateLink_(target) {
        if (target.classList.contains('cmd-link')) {
            term.triggerCommand(target.textContent.trim());
        } else if (target.classList.contains('email-copy')) {
            copyToClipboard('brianfu9@gmail.com');
        }
    }

    container_.addEventListener('click', function (e) {
        var target = e.target.closest('.cmd-link, .email-copy');
        if (!target) return;
        e.preventDefault();
        activateLink_(target);
    }, false);

    // These anchors carry no href, so Enter/Space has to be wired up by hand.
    container_.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        var target = e.target.closest('.cmd-link, .email-copy');
        if (!target) return;
        e.preventDefault();
        activateLink_(target);
    }, false);

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
                output(`<p>this doesn't seem sanitary (ಠ_ಠ)</p>`);
                scrollToBottom_();
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

            scrollToBottom_();
            this.value = ''; // Clear/setup line for next input.
            console.log(`${history_.length} : executed > [${history_[history_.length - 1]}]`);
        }
    }

    function process_command(cmd, args) {
        switch (cmd) {
            case 'hi':
            case 'hello':
            case 'hey':
            case 'welcome':
                output(
                    `<p>Hello there, welcome to my terminal! 
                    You may have seen one before in a hacker movie with green scrolling text and lots of progress bars. 
                    Instead of clicking on links to navigate this site, just type where you want to go and hit enter! 
                    </br></br>
                    Feel free to hack around or take a look at some of my <a class="cmd-link" tabindex="0" role="button">projects</a>. 
                    If you're looking for somewhere to start, click <a class="cmd-link" tabindex="0" role="button">menu</a>.</p>`
                );
                break;
            case 'about':
                if (args[0] == '-t' || args[0] == '-terminal') {
                    output(
                        `<p>So, you're interested in learing more about this website! 
                        brianfu.me is an ongoing portfolio/personal website designed to emulate the feel of a computer terminal.
                        Try out the up and down arrow keys to navigate the commands history, tab for autocompletion, and clicking colored text for animated typing sequences.</p>`
                    )
                } else {
                    output(
                        `<p>Hello! I'm Brian Fu, a software engineer with a focus on cybersecurity, cloud infrastructure, and distributed systems.</p>
                        <p>
                        I've built scalable, secure systems at high-growth startups including AppDynamics and Lacework
                        (acquired by Cisco and Fortinet) and am currently based in San Francisco${ipinfo && (ipinfo.district || ipinfo.city) ? ' but would love to visit ' + (ipinfo.district || ipinfo.city) : ''}.
                        </p>
                        <p>
                        If you have recommendations for food, music, travel, or work please connect with me at
                        <a class="cmd-link" tabindex="0" role="button">contact</a>!
                        </p>`
                    );
                }
                break;
            case 'bearfaced':
                window.open('https://bearfaced.brianfu.me', '_blank');
                output(
                    `<p>ʕ •ᴥ•ʔ</br>Bear Faced is the CalHacks 2018 project by Brian Fu and Bryant Bettencourt. 
                    Uses facial and emotion detection to paste a picture of an emotive bear's face over the same emotion on your face. 
                    Try it out <a href="https://bearfaced.brianfu.me" target="_blank" rel="noopener noreferrer">here</a> via repl.it! (may take a minute to load)
                    <div class="github-button-div">
                        <a class="github-button" href="https://github.com/brianfu9/bearfaced"
                        data-size="large">Bear Faced</a>
                    </div></p>`
                );
                buttonify();
                break;
            case 'hangman':
                window.open('https://hangman.brianfu.me', '_blank');
                output(
                    `<p>Hangman is a school project exhibiting the use of Ruby and Heroku. 
                    Unfortunately, due to being a school project, the source code is not published.
                    Try it out <a href="https://hangman.brianfu.me" target="_blank" rel="noopener noreferrer">here</a>!
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
                        <li>LinkedIn: <a href="https://www.linkedin.com/in/brian-fu" target="_blank" rel="noopener noreferrer">linkedin/brian-fu</a></li>
                        <li>Email: 
                        <div class="hintbox">
                            <a id="email${history_.length}" tabindex="0" role="button" class="email-copy">
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
                output('<p><a href="https://github.com/brianfu9" target="_blank" rel="noopener noreferrer">' + ICON_GITHUB + ' https://github.com/brianfu9</a></p>');
                break;
            case 'ls':
            case 'dir':
            case 'help':
            case 'menu':
                var cmdslst = '<a class="cmd-link" tabindex="0" role="button">' + CMDS_.join('</a><br><a class="cmd-link" tabindex="0" role="button">') + '</a>';
                if (args[0] && args[0].toLowerCase() == '-all') {
                    cmdslst += '</div><br><p>many secret. much hidden. wow:</p><div class="ls-files">' +
                        '<a class="cmd-link" tabindex="0" role="button">' +
                        CMDS_ADVANCED.join('</a><br><a class="cmd-link" tabindex="0" role="button">') + '</a>';
                    output(`<p>Wow you\'re an advanced user!
                    <div class="ls-files">` + cmdslst + '</div>');
                } else {
                    output('<p>Here is a list of commands:</p><div class="ls-files">' + cmdslst +
                        '</div><p>If you\'d like to see the complete list, try out "<a class="cmd-link" tabindex="0" role="button">menu -all</a>"</p>');
                }
                break;
            case 'ping':
            case 'ifconfig':
                var pingId = `loading${history_.length}`;
                output_.insertAdjacentHTML('beforeEnd', `<div id="${pingId}" style="width:90%;margin-left:40px;"></div>`);
                // Kick the lookup off alongside the animation so it has landed
                // by the time the typing finishes.
                var ipReady = loadIpInfo();
                var typed = new Typed(`#${pingId}`, {
                    strings: ['ping ... ping?^300', 'ping ... pong?^300', 'ping ... ^300pung!^700'],
                    typeSpeed: 50,
                    showCursor: false,
                    backSpeed: 50,
                    onComplete: () => {
                        ipReady.always(() => {
                            if (ipinfo) {
                                delete ipinfo.success;
                                $(`#${pingId}`).html(JSON.stringify(ipinfo).slice(1, -1).replace(/,"/g, '<br>"').replace(/"/g, ' '));
                            } else {
                                $(`#${pingId}`).html(`ping has been foiled by adblock!`);
                            }
                            scrollToBottom_();
                        });
                    }
                });
                break;
            case 'project':
            case 'projects':
            case 'portfolio':
                proj = new Projects(output_);
                output(`If you're interested in seeing more projects, please <a class="cmd-link" tabindex="0" role="button">contact</a> me or check out my <a class="cmd-link" tabindex="0" role="button">github</a>! `)
                break;
            case 'resume':
                window.open('assets/documents/BrianFu_resume.pdf', '_blank');
                output(`<p><a href="assets/documents/BrianFu_resume.pdf" target="_blank" rel="noopener noreferrer">Resumé</a><p>`);
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
                    output(`<p>character not allowed.</p>`);
                } else {
                    $('#input-line .prompt').html(`[<span class="user">${root}</span>@brianfu.me] > `);
                    user = root;
                    output_.insertAdjacentHTML('beforeEnd', `<div id="loading${history_.length}" style="width:90%;margin-left:40px;"></div>`);
                    if (prefersReducedMotion_()) {
                        document.getElementById(`loading${history_.length}`).innerHTML = '(•_•)</br>( •_•)>⌐■-■</br>(⌐■_■)';
                        scrollToBottom_();
                    } else {
                        var typed = new Typed(`#loading${history_.length}`, {
                            strings: ['(•_•)</br>( •_•)>⌐■-■</br>(⌐■_■)'],
                            typeSpeed: 100,
                            showCursor: false,
                            onComplete: () => {
                                scrollToBottom_();
                            }
                        });
                    }
                }
                break;
            case 'vim':
                output(`try > <a class="cmd-link" tabindex="0" role="button">emacs</a> instead`);
                break;
            case 'emacs':
                output(`try > <a class="cmd-link" tabindex="0" role="button">vim</a> instead`);
                break;
            case 'sudo':
                if (sudoers.includes(user)) {
                    output(`(⌐■_■) ${user} says:`);
                    process_command(args[0], args.slice(1));
                } else {
                    output(`sudo: '${user}' is not in the sudoers file. This incident will be <a href="https://xkcd.com/838/" target="_blank" rel="noopener noreferrer">reported</a>.`);
                }
                break;
            case 'shader':
            case 'shaders':
                output(`<p>IRL Shaders is an Augmented Reality project to apply a live daltonization filter to your webcam feed. 
                Try it out <a href="https://brianfu.me/irl-shaders/index.html" target="_blank" rel="noopener noreferrer">here</a>!
                <div class="github-button-div">
                    <a class="github-button" href="https://github.com/brianfu9/irl-shaders"
                    data-size="large">irl-shaders</a>
                </div></p>`);
                buttonify();
                break;
            case 'rm':
                output(`rm: Permission denied`);
                break;
            default:
                if (cmd) {
                    askLLM_(cmd, args);
                }
        }
    }

    function submitCommand_(command) {
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

    function triggerCommand(command) {
        cmdLine_.focus();
        if (prefersReducedMotion_()) {
            submitCommand_(command);
            return;
        }
        var typed = new Typed("#input-line .cmdline", {
            strings: [command],
            typeSpeed: 75,
            onDestroy: () => {
                submitCommand_(command);
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
        scrollToBottom_();
    }

    // The 1B model often ignores "plain text only" and emits markdown. Strip the
    // common markup client-side so the terminal stays plain text. Applied to the
    // whole accumulated buffer each chunk, so markers split across tokens resolve.
    function stripMarkdown_(s) {
        return s
            .replace(/```[a-zA-Z0-9]*\n?/g, '')      // code fences
            .replace(/`([^`]*)`/g, '$1')              // inline code
            .replace(/`/g, '')                         // stray backticks
            .replace(/\\([\\_*`#~\-])/g, '$1')         // escaped md chars: \_ \* etc.
            .replace(/\*\*([^*]+)\*\*/g, '$1')         // **bold**
            .replace(/\*([^*\n]+)\*/g, '$1')           // *italic*
            .replace(/(^|[\s(])__([^_]+)__/g, '$1$2')  // __bold__
            .replace(/(^|[\s(])_([^_\n]+)_/g, '$1$2')  // _italic_
            .replace(/^#{1,6}\s+/gm, '')               // # headings
            .replace(/^\s*[*+\-]\s+/gm, '• ')     // bullet markers -> •
            .replace(/^\s*>\s?/gm, '');                // blockquotes
    }

    function askLLM_(cmd, args) {
        var fullInput = cmd + (args.length ? ' ' + args.join(' ') : '');
        var loadingId = 'llm-loading-' + history_.length;

        // Show thinking animation
        output_.insertAdjacentHTML('beforeEnd', '<div id="' + loadingId + '" style="width:90%;margin-left:40px;"><p style="color:#EDED65;">thinking...</p></div>');
        scrollToBottom_();

        var container = document.getElementById(loadingId);

        // The gateway streams tokens as text/plain. Abort only if the FIRST byte
        // is slow (the board is weak; a cold model can take ~10-15s). The timer
        // is cleared as soon as streaming begins, so a long full answer is fine.
        var controller = new AbortController();
        var firstByteTimer = setTimeout(function () { controller.abort(); }, 20000);

        fetch(TERMINAL_API_URL + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: fullInput }),
            signal: controller.signal
        })
            .then(function (resp) {
                if (resp.status === 429) {
                    throw { type: 'ratelimit' };
                }
                if (!resp.ok || !resp.body) {
                    throw { type: 'server', status: resp.status };
                }

                var reader = resp.body.getReader();
                var decoder = new TextDecoder();
                var buffer = '';
                var p = null;

                function pump() {
                    return reader.read().then(function (result) {
                        if (result.value) {
                            if (firstByteTimer) { clearTimeout(firstByteTimer); firstByteTimer = null; }
                            if (!p) {
                                // Replace "thinking..." with a fresh paragraph on first token.
                                container.innerHTML = '<p></p>';
                                p = container.querySelector('p');
                            }
                            // textContent keeps it injection-safe as tokens stream in.
                            buffer += decoder.decode(result.value, { stream: true });
                            p.textContent = stripMarkdown_(buffer);
                            scrollToBottom_();
                        }
                        if (result.done) { return; }
                        return pump();
                    });
                }
                return pump();
            })
            .catch(function (err) {
                if (firstByteTimer) { clearTimeout(firstByteTimer); firstByteTimer = null; }
                var msg;
                if (err && err.type === 'ratelimit') {
                    msg = '[RATE_LIMIT] Slow down, try again in a moment.';
                } else if (err && err.name === 'AbortError') {
                    msg = '[TIMEOUT] Request timed out.';
                } else if (err && err.type === 'server') {
                    msg = '[ERROR] Server returned status ' + err.status + '.';
                } else {
                    msg = '[OFFLINE] AI service is currently unavailable.';
                }
                if (container) {
                    container.innerHTML = '<p style="color:#FF6B6B;">' + msg + '</p>';
                }
                scrollToBottom_();
            });
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
            document.getElementById('top').insertAdjacentHTML('beforeEnd', '<p>Click "<a class="cmd-link" tabindex="0" role="button">about</a>" for more information or "<a class="cmd-link" tabindex="0" role="button">menu</a>" for a list of commands.  <a href="https://github.com/brianfu9" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style="color:#EDED65">' + ICON_GITHUB + '</a> <a href="https://www.linkedin.com/in/brian-fu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style="color:#EDED65">' + ICON_LINKEDIN + '</a></p>');
            term.triggerCommand(command);
        },
        triggerCommand: triggerCommand,
        output: output
    }
};

$(function () {

    // The prompt used to show the visitor's own IP, which meant a third-party
    // geo lookup on every page load just for decoration. It now stays generic;
    // `ping` still reports the real thing, on demand.
    $('.prompt').html(`[<span class="user">user</span>@brianfu.me] > `);

    // Initialize a new terminal object
    term = new Terminal('#input-line .cmdline', '#container output');
    if (window.location.hash) {
        var command = window.location.hash;
        term.init(command.slice(1));
    } else term.init('welcome');

});
