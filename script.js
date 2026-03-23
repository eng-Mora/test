// ── Firebase Compat SDK (NO type="module" needed) ──
// يشتغل على كل المتصفحات بما فيها Safari iOS

const firebaseConfig = {
    apiKey: "AIzaSyBXsX0v_7p8CHDFiTUm4XkQsoZIqGueAOk",
    authDomain: "the-process-5d196.firebaseapp.com",
    databaseURL: "https://the-process-5d196-default-rtdb.firebaseio.com",
    projectId: "the-process-5d196",
    storageBucket: "the-process-5d196.firebasestorage.app",
    messagingSenderId: "96415822332",
    appId: "1:96415822332:web:2be476bee2e474383d8279"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ── تحويل Google Drive روابط للـ preview (يشتغل على iPhone) ──
function toEmbedUrl(url) {
    if (!url) return url;
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    return url;
}

// Chapter names per CODE
const CHAPTER_NAMES = {
    CODE1:  {1:'الفصل الأول',2:'الفصل الثاني',3:'الفصل الثالث',4:'الفصل الرابع',5:'الفصل الخامس',6:'الفصل السادس',7:'الفصل السابع',8:'الفصل الثامن'},
    CODE2:  {1:'Chapter 1', 2:'Chapter 2',   3:'Chapter 3',   4:'Chapter 4',   5:'Chapter 5',   6:'Chapter 6',   7:'Chapter 7',   8:'Chapter 8'},
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
    CODE13: {1:'Homework'},
};

// Branch titles for CODE1/CODE2 chapter groups
const BRANCH_CHAPTERS = {
    CODE1: { electric:[1,2,3,4], modern:[5,6,7,8] },
    CODE2: { electric:[1,2,3,4], modern:[5,6,7,8] },
};

document.addEventListener('DOMContentLoaded', async function () {

    const loginContainer = document.getElementById('loginContainer');
    const mainContent    = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const sidebar        = document.getElementById('sidebar');
    const sidebarToggle  = document.getElementById('sidebarToggle');

    // ── Sidebar ───────────────────────────────────────────────
    sidebarToggle && sidebarToggle.addEventListener('click', function(e) { e.stopPropagation(); sidebar.classList.toggle('active'); });
    var sidebarLoginToggle = document.getElementById('sidebarLoginToggle');
    sidebarLoginToggle && sidebarLoginToggle.addEventListener('click', function(e) { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.addEventListener('click', function(e) { if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('active'); });
    sidebar.addEventListener('click', function(e) { e.stopPropagation(); });

    var homeLink = document.getElementById('homeLink');
    homeLink && homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    });

    // ── Auth helpers ──────────────────────────────────────────
    const showLogin = function() { loginContainer.style.display = 'flex';  mainContent.style.display = 'none'; };
    const showMain  = function() { loginContainer.style.display = 'none';  mainContent.style.display = 'block'; };

    window.logout = function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('loginType');
        window.location.reload();
    };

    // ── Ban Watcher ─────────────────────────────────────────
    var banWatcherRef = null;
    function startBanWatcher(username) {
        if (banWatcherRef) banWatcherRef.off();
        banWatcherRef = db.ref('students/' + username + '/banned');
        banWatcherRef.on('value', function(snap) {
            if (snap.val() === true) {
                banWatcherRef.off();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                localStorage.removeItem('loginType');
                showLogin();
                var errEl = document.getElementById('errorMessage');
                errEl.style.color = '#dc3545';
                errEl.textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
            }
        });
    }

    // Check students collection
    async function getStudent(username) {
        try {
            const snap = await db.ref('students/' + username).get();
            return snap.exists() ? snap.val() : null;
        } catch(e) { return null; }
    }

    // Check if code is a review access code
    async function getReviewByCode(code) {
        try {
            const snap = await db.ref('reviews').get();
            if (!snap || !snap.exists()) return null;
            const reviews = snap.val();
            if (!reviews || typeof reviews !== 'object') return null;
            for (const [rcId, rc] of Object.entries(reviews)) {
                if (!rc || !rc.accessCodes) continue;
                const accessCodes = Object.values(rc.accessCodes);
                if (accessCodes.map(String).includes(String(code))) {
                    return { rcId, code: rc.code || rcId, desc: rc.desc || '', videos: rc.videos || {} };
                }
            }
            return null;
        } catch(e) {
            console.warn('getReviewByCode error:', e);
            return null;
        }
    }

    // ── Check login on load ───────────────────────────────────
    async function checkLoginState() {
        const urlParams  = new URLSearchParams(window.location.search);
        const urlUser    = urlParams.get('username');
        if (urlUser) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
            const studentFromUrl = await getStudent(urlUser);
            if (studentFromUrl && studentFromUrl.videoCode && !studentFromUrl.banned) {
                const now = Date.now();
                db.ref('students/' + urlUser + '/lastSeen').set(now);
                db.ref('loginLogs/' + urlUser).push({ at: now, name: studentFromUrl.name });
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', urlUser);
                localStorage.setItem('loginType', 'student');
                await loadVideoContent(studentFromUrl.videoCode, urlUser, studentFromUrl);
                showMain();
                startBanWatcher(urlUser);
                return;
            }
            let rvUrl = null;
            try { rvUrl = await getReviewByCode(urlUser); } catch(e) { rvUrl = null; }
            if (rvUrl) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', urlUser);
                localStorage.setItem('loginType', 'review');
                await loadReviewContent(rvUrl);
                showMain();
                return;
            }
            showLogin();
            var errEl = document.getElementById('errorMessage');
            errEl.style.color = '#dc3545';
            errEl.textContent  = '❌ الكود مش موجود، تواصل مع المشرف.';
            return;
        }

        const loggedIn  = localStorage.getItem('isLoggedIn');
        const username  = localStorage.getItem('username');
        const loginType = localStorage.getItem('loginType');
        if (loggedIn === 'true' && username) {
            if (loginType === 'review') {
                let rv = null;
                try { rv = await getReviewByCode(username); } catch(e) { rv = null; }
                if (rv) { await loadReviewContent(rv); showMain(); return; }
            }
            const student = await getStudent(username);
            if (student && student.videoCode) {
                if (student.banned) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    localStorage.removeItem('loginType');
                    showLogin();
                    var errEl = document.getElementById('errorMessage');
                    errEl.style.color = '#dc3545';
                    errEl.textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
                    return;
                }
                db.ref('students/' + username + '/lastSeen').set(Date.now());
                await loadVideoContent(student.videoCode, username, student);
                showMain();
                startBanWatcher(username);
            } else { showLogin(); }
        } else { showLogin(); }
    }

    // ── Login ─────────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const errEl    = document.getElementById('errorMessage');
        errEl.style.color   = '#888';
        errEl.textContent   = '⏳ جاري التحقق...';

        let rv = null;
        try { rv = await getReviewByCode(username); } catch(e) { rv = null; }
        if (rv) {
            errEl.textContent = '';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginType', 'review');
            await loadReviewContent(rv);
            showMain();
            videoContainer.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const student = await getStudent(username);
        if (student && student.videoCode) {
            if (student.banned) {
                errEl.style.color = '#dc3545';
                errEl.textContent = '🚫 تم تعليق هذا الحساب. تواصل مع المشرف.';
                return;
            }
            errEl.textContent = '';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginType', 'student');
            const now = Date.now();
            db.ref('students/' + username + '/lastSeen').set(now);
            db.ref('loginLogs/' + username).push({ at: now, name: student.name });
            await loadVideoContent(student.videoCode, username, student);
            showMain();
            startBanWatcher(username);
            videoContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            errEl.style.color = '#dc3545';
            errEl.textContent = 'Invalid access code, please try again';
        }
    });

    // ── Load Review Content ──────────────────────────────────
    async function loadReviewContent(rv) {
        const sorted = Object.values(rv.videos).sort((a,b) => (a.order||0)-(b.order||0));

        let html = `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>🎯 فيديوهات المراجعة</h3>
                <p>${rv.desc || rv.code}</p>
            </div>
        </div>`;

        const rvCode = rv.code || rv.rcId || 'REVIEW';
        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
        html += '<option value="">اختر الفيديو...</option>';
        sorted.forEach((v,i) => {
            html += `<option value="rv_${i}" data-video-code="${rvCode}" data-chapter-num="0" data-chapter-name="مراجعة" data-video-title="${v.title}" data-student-name="">${v.title}</option>`;
        });
        html += '</select></div>';

        sorted.forEach((v,i) => {
            const urls = [];
            for (let j=1; j<=9; j++) { if(v['url'+j]) urls.push(toEmbedUrl(v['url'+j])); else break; }
            html += `<div class="video" id="rv_${i}" style="display:none;">`;
            html += `<h3 class="video-title">${v.title}</h3>`;
            if (urls.length > 1) {
                urls.forEach((url,j) => {
                    html += `<h3 class="video-title">الجزء ${j===0?'الأول':j===1?'الثاني':j+1}</h3>`;
                    html += `<iframe src="${url}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
                });
            } else {
                html += `<iframe src="${urls[0]||''}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
            }
            html += '</div>';
        });

        html += `<div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        const loggedUser = localStorage.getItem('username');
        if (loggedUser) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(opt => {
                opt.dataset.studentName = loggedUser;
            });
        }
    }

    // ── Build video card HTML ─────────────────────────────────
    function buildVideoCard(v, idPrefix) {
        const urls = [];
        for (let i = 1; i <= 9; i++) {
            if (v['url' + i]) urls.push(toEmbedUrl(v['url' + i]));
            else break;
        }
        if (!urls.length) return '';

        const labels = urls.length > 1
            ? ['الجزء الأول','الجزء الثاني','الجزء الثالث','الجزء الرابع','الجزء الخامس']
            : [v.title];

        let html = `<div class="video" id="${idPrefix}" style="display:none;">`;
        html += `<h3 class="video-title">${v.title}</h3>`;
        urls.forEach((url, i) => {
            if (urls.length > 1) html += `<h3 class="video-title">${labels[i] || 'جزء '+(i+1)}</h3>`;
            html += `<iframe src="${url}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen webkitallowfullscreen mozallowfullscreen playsinline webkit-playsinline></iframe>`;
        });
        html += '</div>';
        return html;
    }

    // ── Build chapter HTML ────────────────────────────────────
    function buildChapter(chNum, chName, videos, code) {
        const sorted = Object.entries(videos).sort((a,b) => (a[1].order||0)-(b[1].order||0));
        if (!sorted.length) return '';

        const isActive = chNum === 1 ? 'active' : '';
        let html = `<div id="chapter-${chNum}" class="chapter-content ${isActive}">`;
        html += `<h2 class="chapter-title">${chName}</h2>`;
        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value, this.options[this.selectedIndex].dataset)">';
        html += `<option value="">${code.startsWith('CODE1') || code === 'CODE8' || code === 'CODE11' ? 'اختر الفيديو...' : 'Select video...'}</option>`;
        sorted.forEach(([vid, v]) => {
            html += `<option value="v_${chNum}_${vid}" data-video-code="${code}" data-chapter-num="${chNum}" data-chapter-name="${chName}" data-video-title="${v.title}" data-student-name="">${v.title}</option>`;
        });
        html += '</select></div>';
        sorted.forEach(([vid, v]) => {
            html += buildVideoCard(v, `v_${chNum}_${vid}`);
        });
        html += '</div>';
        return html;
    }

    // ── showVideo ─────────────────────────────────────────────
    window._showVideo = function(id, dataset) {
        if (!id) return;
        const loggedUser = localStorage.getItem('username');
        if (loggedUser && dataset && dataset.videoCode) {
            const now = Date.now();
            const meta = {
                studentCode : loggedUser,
                studentName : dataset.studentName || '',
                videoCode   : dataset.videoCode   || '',
                chapterNum  : dataset.chapterNum  || '',
                chapterName : dataset.chapterName || '',
                videoTitle  : dataset.videoTitle  || '',
                at          : now
            };
            db.ref('watchLogs').push(meta);
            const vidKey = 'videoStats/' + meta.videoCode + '_ch' + meta.chapterNum + '_' + id;
            db.ref(vidKey).get().then(function(snap) {
                const prev = snap.exists() ? (snap.val() || {}) : {};
                db.ref(vidKey).set({
                    title      : meta.videoTitle,
                    code       : meta.videoCode,
                    chapter    : meta.chapterNum,
                    chapterName: meta.chapterName,
                    views      : (prev.views || 0) + 1,
                    lastWatched: now
                });
            });
        }
        const chNum = id.split('_')[1];
        const chEl = document.getElementById('chapter-' + chNum);
        if (chEl) chEl.querySelectorAll('.video').forEach(function(v) { v.style.display = 'none'; });
        const t = document.getElementById(id);
        if (t) {
            t.style.display = 'block';
            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    window.switchChapter = function(num) {
        const scope = document.querySelector('.branch-content[style*="display: block"]')
                   || document.querySelector('.branch-content[style*="display:block"]')
                   || videoContainer;
        scope.querySelectorAll('.chapter-content').forEach(function(c) { c.classList.remove('active'); });
        scope.querySelectorAll('.chapter-btn').forEach(function(b) { b.classList.remove('active'); });
        const chEl = scope.querySelector('#chapter-' + num);
        if (chEl) chEl.classList.add('active');
        const btns = scope.querySelectorAll('.chapter-btn');
        btns.forEach(function(b) { if (b.getAttribute('onclick') === 'switchChapter(' + num + ')') b.classList.add('active'); });
    };

    // ── loadVideoContent ──────────────────────────────────────
    async function loadVideoContent(code, username, student) {

        let chapData = {};
        try {
            const snap = await db.ref('videos/' + code).get();
            if (snap.exists()) chapData = snap.val();
        } catch(e) { console.warn('videos fetch:', e); }

        const chapterNames = CHAPTER_NAMES[code] || {1: 'Videos'};

        let html = '';
        if (student) {
            html += `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>يا 100 أهلاً يا ${student.name}</h3>
                <p>${student.welcomeMessage || '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير'}</p>
            </div>
            <div class="profile-img-container">
                <img src="${student.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + username}"
                     alt="صورة البروفايل"
                     onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${username}'">
                <div class="show-details">اظهار التفاصيل</div>
                <div class="profile-info" id="profileInfo">
                    <p><strong>الاسم:</strong> ${student.name}</p>
                    <p><strong>رقم التليفون:</strong> ${student.phone || '-'}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${student.email || '-'}</p>
                    <p><strong>لغة الدراسة:</strong> ${student.language || '-'}</p>
                </div>
            </div>
        </div>`;
        }

        const branches = BRANCH_CHAPTERS[code];

        if (branches) {
            html += `
            <div class="branch-selection">
                <h3>Select a physics branch --- اختر فرع الفيزياء :</h3>
                <select class="branch-selector" id="branchSelector">
                    <option value="">اختر الفرع → Select a branch</option>
                    <option value="electric">الفيزياء الكهربية → Electricity Physics</option>
                    <option value="modern">الفيزياء الحديثة → Modern Physics</option>
                </select>
            </div>`;

            html += '<div id="electric-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.electric.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.electric.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

            html += '<div id="modern-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.modern.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.modern.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

        } else {
            const chNums = Object.keys(chapterNames).map(Number).sort((a,b)=>a-b);

            if (chNums.length > 1) {
                html += '<div class="chapters-nav">';
                chNums.forEach((chNum, i) => {
                    html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]}</button>`;
                });
                html += '</div>';
            }

            chNums.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Videos', vids, code);
            });
        }

        html += `
        <div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        if (student) {
            videoContainer.querySelectorAll('option[data-video-code]').forEach(opt => {
                opt.dataset.studentName = student.name || '';
            });
        }

        var branchSelector = document.getElementById('branchSelector');
        branchSelector && branchSelector.addEventListener('change', function () {
            document.querySelectorAll('.branch-content').forEach(function(b) { b.style.display = 'none'; });
            if (this.value) {
                const t = document.getElementById(this.value + '-physics');
                if (t) t.style.display = 'block';
            }
        });

        var profileImgContainer = document.querySelector('.profile-img-container');
        profileImgContainer && profileImgContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            var pi = document.getElementById('profileInfo');
            pi && pi.classList.toggle('active');
        });
        document.addEventListener('click', function() {
            var pi = document.getElementById('profileInfo');
            pi && pi.classList.remove('active');
        });
    }

    // ── Init ──────────────────────────────────────────────────
    checkLoginState();
});
