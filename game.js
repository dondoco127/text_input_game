        // --- 1. 定数と変数の設定 ---
        
        // 簡略化されたワードリスト（ひらがなと対応ローマ字）
        const WORDS = [
            {ja: 'もじ', ro: 'moji'},
            {ja: 'たいぴんぐ', ro: 'taipingu'},
            {ja: 'ことば', ro: 'kotoba'},
            {ja: 'へんかん', ro: 'henkan'},
            {ja: 'きーぼーど', ro: 'ki-bo-do'},
            {ja: 'かんたん', ro: 'kantan'},
        ];

        // DOM要素
        const wordDisplay = document.getElementById('wordDisplay');
        const timerDisplay = document.getElementById('timerDisplay');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const startButton = document.getElementById('startButton');
        const typingInput = document.getElementById('typingInput');
        
        // ゲーム状態変数
        let currentWord = {};         // {ja: '', ro: ''}
        let typedRomanIndex = 0;      // 現在入力済みのローマ字インデックス
        let wordIndex = 0;            // 現在出題中のワードのインデックス
        let score = 0;                // スコア
        let timer = 30;               // 制限時間（短く設定）
        let timerInterval = null;     // タイマーのID
        let isGameActive = false;     // ゲーム進行中かどうか

        // --- 2. ゲーム開始・終了のロジック ---

        function startGame() {
            if (isGameActive) return;

            // 状態リセット
            isGameActive = true;
            score = 0;
            timer = 10;
            wordIndex = 0;

            scoreDisplay.textContent = `スコア: ${score}`;
            typingInput.disabled = false;
            startButton.disabled = true;
            typingInput.focus();

            // ワードの準備
            shuffleWords(WORDS);
            setNewWord();

            // タイマー開始
            timerInterval = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            timer--;
            timerDisplay.textContent = `残り時間: ${timer}秒`;

            if (timer <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }

        function endGame() {
            isGameActive = false;
            typingInput.disabled = true;
            startButton.disabled = false;
            wordDisplay.innerHTML = `<p style="color:red; font-size:1.5em;">ゲーム終了！スコア: ${score}</p>`;
        }

        // --- 3. ワードの表示と管理 ---

        function shuffleWords(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function setNewWord() {
            currentWord = WORDS[wordIndex];
            typedRomanIndex = 0;
            renderWord();
        }

        function renderWord() {
            const roman = currentWord.ro;
            let displayHtml = '';

            for (let i = 0; i < roman.length; i++) {
                const char = roman[i];
                let className = '';

                if (i < typedRomanIndex) {
                    className = 'correct'; // 入力済み
                } else if (i === typedRomanIndex) {
                    className = 'current'; // 次の文字
                }
                
                displayHtml += `<span class="${className}">${char}</span>`;
            }

            // 元のひらがなを小さく表示
            wordDisplay.innerHTML = `${currentWord.ja} <span style="font-size:0.5em; color:#aaa;">(${displayHtml})</span>`;
        }


        // --- 4. 入力判定ロジック ---

        document.addEventListener('keydown', (e) => {
            if (!isGameActive) {
                // Enter/Spaceでゲーム開始
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); 
                    startGame();
                }
                return;
            }

            const key = e.key.toLowerCase();
            const targetChar = currentWord.ro[typedRomanIndex];

            // 1文字キー（a-zなど）で、かつターゲット文字と一致するかチェック
            if (key.length === 1 && key === targetChar) {
                e.preventDefault(); 
                typedRomanIndex++;

                // ワードの入力完了
                if (typedRomanIndex >= currentWord.ro.length) {
                    score++;
                    scoreDisplay.textContent = `スコア: ${score}`;
                    
                    // 次のワードへ
                    wordIndex = (wordIndex + 1) % WORDS.length;
                    setNewWord();
                } else {
                    renderWord(); 
                }
            }
            // ミスは無視（簡略化のため、ミス判定はしない）
        });


        // --- 5. イベントリスナー ---
        startButton.addEventListener('click', startGame);