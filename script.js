// ============================================================
//  Safe localStorage — iOS Safari / WebView / Private Browsing
// ============================================================
var safeStorage = (function () {
    var _s = {};
    try {
        window.localStorage.setItem('__t__', '1');
        window.localStorage.removeItem('__t__');
        return {
            getItem:    function (k)    { return window.localStorage.getItem(k); },
            setItem:    function (k, v) { window.localStorage.setItem(k, v); },
            removeItem: function (k)    { window.localStorage.removeItem(k); }
        };
    } catch (e) {
        return {
            getItem:    function (k)    { return (_s[k] !== undefined) ? _s[k] : null; },
            setItem:    function (k, v) { _s[k] = String(v); },
            removeItem: function (k)    { delete _s[k]; }
        };
    }
})();

// ============================================================
//  Firebase REST API — بيشتغل على كل متصفح حتى iOS القديم
// ============================================================
var DB_URL = 'https://the-process-5d196-default-rtdb.firebaseio.com';

function dbGet(path) {
    return fetch(DB_URL + '/' + path + '.json')
        .then(function (r) { return r.json(); })
        .catch(function () { return null; });
}

function dbSet(path, val) {
    fetch(DB_URL + '/' + path + '.json', {
        method: 'PUT',
        body: JSON.stringify(val)
    }).catch(function () {});
}

function dbPush(path, val) {
    fetch(DB_URL + '/' + path + '.json', {
        method: 'POST',
        body: JSON.stringify(val)
    }).catch(function () {});
}

// ============================================================
//  Google Drive embed helper
// ============================================================
function toEmbedUrl(url) {
    if (!url) return url;
    var m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
    return url;
}

// ============================================================
//  Chapter / Branch config
// ============================================================
var CHAPTER_NAMES = {
    CODE1:  {1:'الفصل الأول',2:'الفصل الثاني',3:'الفصل الثالث',4:'الفصل الرابع',5:'الفصل الخامس',6:'الفصل السادس',7:'الفصل السابع',8:'الفصل الثامن'},
    CODE2:  {1:'Chapter 1',2:'Chapter 2',3:'Chapter 3',4:'Chapter 4',5:'Chapter 5',6:'Chapter 6',7:'Chapter 7',8:'Chapter 8'},
    CODE3:  {1:'مراجعة الفصل الأول'},
    CODE4:  {1:'Chapter 1 Revision'},
    CODE5:  {1:'Homework'},
    CODE6:  {1:'مراجعة الفصل الثاني'},
    CODE7:  {1:'Chapter 2'},
    CODE8:  {1:'الفصل الثالث'},
    CODE9:  {1:'Chapter 3'},
    CODE10: {1:'Final Revision'},
    CODE11: {1:'مراجعة نصف السنة'},
    CODE12: {1:'Mid-Year Review'},
    CODE13: {1:'Homework'}
};

var BRANCH_CHAPTERS = {
    CODE1: { electric:[1,2,3,4], modern:[5,6,7,8] },
    CODE2: { electric:[1,2,3,4], modern:[5,6,7,8] }
};

// ============================================================
//  Build HTML helpers
// ============================================================
function buildVideoCard(v, idPrefix) {
    var urls = [];
    for (var i = 1; i <= 9; i++) {
        if (v['url' + i]) urls.push(toEmbedUrl(v['url' + i]));
        else break;
    }
    if (!urls.length) return '';

    var labels = ['الجزء الأول','الجزء الثاني','الجزء الثالث','الجزء الرابع','الجزء الخامس'];
    var html = '<div class="video" id="' + idPrefix + '" style="display:none;">';
    html += '<h3 class="video-title">' + v.title + '</h3>';
    urls.forEach(function (url, i) {
        if (urls.length > 1) html += '<h3 class="video-title">' + (labels[i] || 'جزء ' + (i + 1)) + '</h3>';
        html += '<iframe src="' + url + '" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>';
    });
    html += '</div>';
    return html;
}

function buildChapter(chNum, chName, videos, code) {
    if (!videos || typeof videos !== 'object') return '';
    var sorted = Object.entries(videos).sort(function (a, b) { return (a[1].order || 0) - (b[1].order || 0); });
    if (!sorted.length) return '';

    var isAr = (code === 'CODE1' || code === 'CODE8' || code === 'CODE11' || code === 'CODE13');
    var isActive = chNum === 1 ? 'active' : '';
    var html = '<div id="chapter-' + chNum + '" class="chapter-content ' + isActive + '">';
    html += '<h2 class="chapter-title">' + chName + '</h2>';
    html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
    html += '<option value="">' + (isAr ? 'اختر الفيديو...' : 'Select video...') + '</option>';
    sorted.forEach(function (entry) {
        var vid = entry[0], v = entry[1];
        html += '<option value="v_' + chNum + '_' + vid + '" data-video-code="' + code + '" data-chapter-num="' + chNum + '" data-chapter-name="' + chName + '" data-video-title="' + v.title + '" data-student-name="">' + v.title + '</option>';
    });
    html += '</select></div>';
    sorted.forEach(function (entry) {
        html += buildVideoCard(entry[1], 'v_' + chNum + '_' + entry[0]);
    });
    html += '</div>';
    return html;
}

// ============================================================
//  Main App
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    var loginContainer = document.getElementById('loginContainer');
    var mainContent    = document.getElementById('main');
    var videoContainer = document.getElementById('videos');
    var sidebar        = document.getElementById('sidebar');
    var sidebarToggle  = document.getElementById('sidebarToggle');

    // ── Sidebar ───────────────────────────────────────────────
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }
    document.addEventListener('click', function (e) {
        if (sidebar && !sidebar.contains(e.target) && e.target !== sidebarToggle)
            sidebar.classList.remove('active');
    });
    if (sidebar) sidebar.addEventListener('click', function (e) { e.stopPropagation(); });

    var homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', function (e) {
            e.preventDefault();
            safeStorage.removeItem('isLoggedIn');
            safeStorage.removeItem('username');
            safeStorage.removeItem('loginType');
            window.location.reload();
        });
    }

    function showLogin() {
        loginContainer.style.display = 'flex';
        mainContent.style.display = 'none';
    }

    function showMain() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
    }

    window.logout = function () {
        safeStorage.removeItem('isLoggedIn');
        safeStorage.removeItem('username');
        safeStorage.removeItem('loginType');
        window.location.reload();
    };

    // ── showVideo ─────────────────────────────────────────────
    window._showVideo = function (id, dataset) {
        if (!id) return;
        // سجّل المشاهدة (non-blocking)
        var loggedUser = safeStorage.getItem('username');
        if (loggedUser && dataset && dataset.videoCode) {
            var now = Date.now();
            dbPush('watchLogs', {
                studentCode: loggedUser,
                studentName: dataset.studentName || '',
                videoCode:   dataset.videoCode   || '',
                chapterNum:  dataset.chapterNum  || '',
                chapterName: dataset.chapterName || '',
                videoTitle:  dataset.videoTitle  || '',
                at: now
            });
        }
        var chNum = id.split('_')[1];
        var chEl  = document.getElementById('chapter-' + chNum);
        if (chEl) chEl.querySelectorAll('.video').forEach(function (v) { v.style.display = 'none'; });
        var t = document.getElementById(id);
        if (t) {
            t.style.display = 'block';
            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // ── switchChapter ─────────────────────────────────────────
    window.switchChapter = function (num) {
        var scope = document.querySelector('.branch-content[style*="display: block"]')
                 || document.querySelector('.branch-content[style*="display:block"]')
                 || videoContainer;
        scope.querySelectorAll('.chapter-content').forEach(function (c) { c.classList.remove('active'); });
        scope.querySelectorAll('.chapter-btn').forEach(function (b) { b.classList.remove('active'); });
        var chEl = scope.querySelector('#chapter-' + num);
        if (chEl) chEl.classList.add('active');
        scope.querySelectorAll('.chapter-btn').forEach(function (b) {
            if (b.getAttribute('onclick') === 'switchChapter(' + num + ')') b.classList.add('active');
        });
    };

    // ── Load Review Content ───────────────────────────────────
    function loadReviewContent(rv) {
        var sorted = Object.values(rv.videos).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
        var rvCode = rv.code || rv.rcId || 'REVIEW';

        var html = '<div class="welcome-banner"><div class="welcome-text">';
        html += '<h3>🎯 فيديوهات المراجعة</h3>';
        html += '<p>' + (rv.desc || rv.code) + '</p></div></div>';

        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
        html += '<option value="">اختر الفيديو...</option>';
        sorted.forEach(function (v, i) {
            html += '<option value="rv_' + i + '" data-video-code="' + rvCode + '" data-chapter-num="0" data-chapter-name="مراجعة" data-video-title="' + v.title + '" data-student-name="">' + v.title + '</option>';
        });
        html += '</select></div>';

        sorted.forEach(function (v, i) {
            var urls = [];
            for (var j = 1; j <= 9; j++) { if (v['url' + j]) urls.push(toEmbedUrl(v['url' + j])); else break; }
            html += '<div class="video" id="rv_' + i + '" style="display:none;">';
            html += '<h3 class="video-title">' + v.title + '</h3>';
            var labels = ['الجزء الأول','الجزء الثاني','الجزء الثالث','الجزء الرابع'];
            if (urls.length > 1) {
                urls.forEach(function (url, j) {
                    html += '<h3 class="video-title">' + (labels[j] || 'جزء ' + (j + 1)) + '</h3>';
                    html += '<iframe src="' + url + '" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>';
                });
            } else {
                html += '<iframe src="' + (urls[0] || '') + '" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>';
            }
            html += '</div>';
        });

        html += '<div class="logout-container"><button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button></div>';
        videoContainer.innerHTML = html;

        var loggedUser = safeStorage.getItem('username');
        if (loggedUser) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(function (opt) {
                opt.dataset.studentName = loggedUser;
            });
        }
    }

    // ── Load Video Content ────────────────────────────────────
    function loadVideoContent(code, username, student) {
        var chapterNames = CHAPTER_NAMES[code] || {1: 'Videos'};

        // Fetch videos from Firebase REST
        dbGet('videos/' + code).then(function (chapData) {
            chapData = chapData || {};
            var html = '';

            // Welcome banner
            if (student) {
                html += '<div class="welcome-banner">';
                html += '<div class="welcome-text">';
                html += '<h3>يا 100 أهلاً يا ' + student.name + '</h3>';
                html += '<p>' + (student.welcomeMessage || '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير') + '</p>';
                html += '</div>';
                html += '<div class="profile-img-container">';
                html += '<img src="' + (student.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + username) + '" alt="صورة البروفايل" onerror="this.src=\'https://api.dicebear.com/7.x/bottts/svg?seed=' + username + '\'">';
                html += '<div class="show-details">اظهار التفاصيل</div>';
                html += '<div class="profile-info" id="profileInfo">';
                html += '<p><strong>الاسم:</strong> ' + student.name + '</p>';
                html += '<p><strong>رقم التليفون:</strong> ' + (student.phone || '-') + '</p>';
                html += '<p><strong>البريد الإلكتروني:</strong> ' + (student.email || '-') + '</p>';
                html += '<p><strong>لغة الدراسة:</strong> ' + (student.language || '-') + '</p>';
                html += '</div></div></div>';
            }

            var branches = BRANCH_CHAPTERS[code];
            if (branches) {
                html += '<div class="branch-selection">';
                html += '<h3>Select a physics branch --- اختر فرع الفيزياء :</h3>';
                html += '<select class="branch-selector" id="branchSelector">';
                html += '<option value="">اختر الفرع → Select a branch</option>';
                html += '<option value="electric">الفيزياء الكهربية → Electricity Physics</option>';
                html += '<option value="modern">الفيزياء الحديثة → Modern Physics</option>';
                html += '</select></div>';

                html += '<div id="electric-physics" class="branch-content" style="display:none;">';
                html += '<div class="chapters-nav">';
                branches.electric.forEach(function (chNum, i) {
                    html += '<button class="chapter-btn ' + (i === 0 ? 'active' : '') + '" onclick="switchChapter(' + chNum + ')">' + (chapterNames[chNum] || 'Ch ' + chNum) + '</button>';
                });
                html += '</div>';
                branches.electric.forEach(function (chNum) {
                    html += buildChapter(chNum, chapterNames[chNum] || 'Ch ' + chNum, chapData['ch' + chNum] || {}, code);
                });
                html += '</div>';

                html += '<div id="modern-physics" class="branch-content" style="display:none;">';
                html += '<div class="chapters-nav">';
                branches.modern.forEach(function (chNum, i) {
                    html += '<button class="chapter-btn ' + (i === 0 ? 'active' : '') + '" onclick="switchChapter(' + chNum + ')">' + (chapterNames[chNum] || 'Ch ' + chNum) + '</button>';
                });
                html += '</div>';
                branches.modern.forEach(function (chNum) {
                    html += buildChapter(chNum, chapterNames[chNum] || 'Ch ' + chNum, chapData['ch' + chNum] || {}, code);
                });
                html += '</div>';

            } else {
                var chNums = Object.keys(chapterNames).map(Number).sort(function (a, b) { return a - b; });
                if (chNums.length > 1) {
                    html += '<div class="chapters-nav">';
                    chNums.forEach(function (chNum, i) {
                        html += '<button class="chapter-btn ' + (i === 0 ? 'active' : '') + '" onclick="switchChapter(' + chNum + ')">' + chapterNames[chNum] + '</button>';
                    });
                    html += '</div>';
                }
                chNums.forEach(function (chNum) {
                    html += buildChapter(chNum, chapterNames[chNum] || 'Videos', chapData['ch' + chNum] || {}, code);
                });
            }

            html += '<div class="logout-container"><button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button></div>';
            videoContainer.innerHTML = html;

            if (student) {
                videoContainer.querySelectorAll('option[data-video-code]').forEach(function (opt) {
                    opt.dataset.studentName = student.name || '';
                });
            }

            // Branch selector
            var bs = document.getElementById('branchSelector');
            if (bs) {
                bs.addEventListener('change', function () {
                    document.querySelectorAll('.branch-content').forEach(function (b) { b.style.display = 'none'; });
                    if (this.value) {
                        var t = document.getElementById(this.value + '-physics');
                        if (t) t.style.display = 'block';
                    }
                });
            }

            // Profile toggle
            var pic = document.querySelector('.profile-img-container');
            if (pic) {
                pic.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var info = document.getElementById('profileInfo');
                    if (info) info.classList.toggle('active');
                });
                document.addEventListener('click', function () {
                    var info = document.getElementById('profileInfo');
                    if (info) info.classList.remove('active');
                });
            }
        });
    }

    // ── Login ─────────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var username = document.getElementById('username').value.trim();
        var errEl    = document.getElementById('errorMessage');
        errEl.style.color   = '#888';
        errEl.textContent   = '⏳ جاري التحقق...';

        // 1. Check student
        dbGet('students/' + username).then(function (student) {
            if (student && student.videoCode) {
                if (student.banned) {
                    errEl.style.color = '#dc3545';
                    errEl.textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
                    return;
                }
                errEl.textContent = '';
                safeStorage.setItem('isLoggedIn', 'true');
                safeStorage.setItem('username', username);
                safeStorage.setItem('loginType', 'student');
                dbSet('students/' + username + '/lastSeen', Date.now());
                dbPush('loginLogs/' + username, { at: Date.now(), name: student.name });
                loadVideoContent(student.videoCode, username, student);
                showMain();
                videoContainer.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // 2. Check review codes
            dbGet('reviews').then(function (reviews) {
                if (reviews) {
                    var keys = Object.keys(reviews);
                    for (var i = 0; i < keys.length; i++) {
                        var rv = reviews[keys[i]];
                        if (!rv || !rv.accessCodes) continue;
                        var codes = Object.values(rv.accessCodes).map(String);
                        if (codes.indexOf(String(username)) !== -1) {
                            errEl.textContent = '';
                            safeStorage.setItem('isLoggedIn', 'true');
                            safeStorage.setItem('username', username);
                            safeStorage.setItem('loginType', 'review');
                            loadReviewContent(rv);
                            showMain();
                            videoContainer.scrollIntoView({ behavior: 'smooth' });
                            return;
                        }
                    }
                }
                errEl.style.color = '#dc3545';
                errEl.textContent = 'Invalid access code, please try again';
            });
        });
    });

    // ── Check login state on load ─────────────────────────────
    function checkLoginState() {
        try {
            var loggedIn  = safeStorage.getItem('isLoggedIn');
            var username  = safeStorage.getItem('username');
            var loginType = safeStorage.getItem('loginType');

            if (loggedIn === 'true' && username) {
                if (loginType === 'review') {
                    dbGet('reviews').then(function (reviews) {
                        if (reviews) {
                            var keys = Object.keys(reviews);
                            for (var i = 0; i < keys.length; i++) {
                                var rv = reviews[keys[i]];
                                if (!rv || !rv.accessCodes) continue;
                                var codes = Object.values(rv.accessCodes).map(String);
                                if (codes.indexOf(String(username)) !== -1) {
                                    loadReviewContent(rv);
                                    showMain();
                                    return;
                                }
                            }
                        }
                        showLogin();
                    });
                    return;
                }
                dbGet('students/' + username).then(function (student) {
                    if (student && student.videoCode && !student.banned) {
                        dbSet('students/' + username + '/lastSeen', Date.now());
                        loadVideoContent(student.videoCode, username, student);
                        showMain();
                    } else {
                        showLogin();
                    }
                });
                return;
            }
        } catch (e) {}
        showLogin();
    }

    checkLoginState();
});
