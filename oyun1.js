// HTML Elemanları
const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const timerDiv = document.getElementById('timer');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const promotePawnBtn = document.getElementById('promotePawnBtn');
const gameOverDiv = document.getElementById('gameOver');
const moveHistoryDiv = document.getElementById('moveHistory');

// Satranç tahtası ve taşlar
const pieces = {
    'rook': '♖', 'knight': '♘', 'bishop': '♗', 'queen': '♕', 'king': '♔', 'pawn': '♙',
    'rook_black': '♜', 'knight_black': '♞', 'bishop_black': '♝', 'queen_black': '♛', 'king_black': '♚', 'pawn_black': '♟'
};

// Satranç tahtası
let chessBoard = [];
let selectedSquare = null;
let currentPlayer = 'White'; // Beyaz başlayacak
let gameOver = false;
let gameHistory = [];
let redoHistory = [];
let availableMoves = [];
let playerTimers = { White: 300, Black: 300 }; // Her oyuncuya 5 dakika süre
let timerInterval;
let currentPlayerTimer = playerTimers.White; // Başlangıçta beyazın süresi
let checkmate = false; // Şah mat durumu

// Taşları başlat
function setupBoard() {
    chessBoard = [
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['pawn_black', 'pawn_black', 'pawn_black', 'pawn_black', 'pawn_black', 'pawn_black', 'pawn_black', 'pawn_black'],
        ['rook_black', 'knight_black', 'bishop_black', 'queen_black', 'king_black', 'bishop_black', 'knight_black', 'rook_black']
    ];
    renderBoard();
    startTimer();
    gameOverDiv.textContent = '';
}

// Tahtayı render et
function renderBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            const piece = chessBoard[row][col];

            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.textContent = pieces[piece];
                square.appendChild(pieceElement);
            }

            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', handleSquareClick);

            if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                square.classList.add('selected');
            }
            if (availableMoves.some(move => move.row === row && move.col === col)) {
                square.classList.add('highlight');
            }

            board.appendChild(square);
        }
    }
    updateStatus();
    renderMoveHistory();
}

// Zamanlayıcıyı başlat
function startTimer() {
    timerInterval = setInterval(() => {
        currentPlayerTimer--;
        const minutes = Math.floor(currentPlayerTimer / 60);
        const seconds = currentPlayerTimer % 60;
        timerDiv.textContent = `${currentPlayer}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (currentPlayerTimer <= 0) {
            gameOver = true;
            gameOverDiv.textContent = `${currentPlayer} Zamanı Bitti!`;
            clearInterval(timerInterval);
        }
    }, 1000);
}

// Taş tıklama işlemi
function handleSquareClick(event) {
    if (gameOver) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (selectedSquare) {
        const fromRow = selectedSquare.row;
        const fromCol = selectedSquare.col;
        const piece = chessBoard[fromRow][fromCol];

        if (isValidMove(piece, fromRow, fromCol, row, col)) {
            chessBoard[row][col] = chessBoard[fromRow][fromCol];
            chessBoard[fromRow][fromCol] = null;
            gameHistory.push({ fromRow, fromCol, toRow: row, toCol: col, piece });

            // Geri almayı engelleme
            redoHistory = [];

            renderBoard();
            checkGameOver();

            // Oyuncu sırasını değiştir
            currentPlayer = currentPlayer === 'White' ? 'Black' : 'White';
            currentPlayerTimer = playerTimers[currentPlayer];
        }

        selectedSquare = null;
        availableMoves = [];
    } else {
        selectedSquare = { row, col };
        availableMoves = getAvailableMoves(chessBoard[row][col], row, col);
    }
}

// Geçerli hamleyi kontrol et
function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
    if (!piece) return false;
    const isWhite = piece.includes('White');
    if ((currentPlayer === 'White' && !isWhite) || (currentPlayer === 'Black' && isWhite)) {
        return false;
    }

    switch (piece) {
        case 'king':
        case 'king_black':
            return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
        case 'queen':
        case 'queen_black':
            return (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol));
        case 'rook':
        case 'rook_black':
            return fromRow === toRow || fromCol === toCol;
        case 'bishop':
        case 'bishop_black':
            return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
        case 'knight':
        case 'knight_black':
            return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
        case 'pawn':
        case 'pawn_black':
            const direction = piece === 'pawn' ? 1 : -1;
            if (fromCol === toCol && chessBoard[toRow][toCol] === null) {
                return toRow - fromRow === direction;
            } else if (Math.abs(fromCol - toCol) === 1 && toRow - fromRow === direction) {
                return chessBoard[toRow][toCol] !== null && chessBoard[toRow][toCol].includes(currentPlayer === 'White' ? 'Black' : 'White');
            }
            return false;
        default:
            return false;
    }
}

// Şah ve Mat Kontrolü
function checkGameOver() {
    // Şah çekme, mat ve pat durumlarını kontrol et
    // Bu, oyunun ne zaman bitmesi gerektiğini belirler.
    if (checkmate) {
        gameOver = true;
        gameOverDiv.textContent = `${currentPlayer} Şah Mat oldu!`;
    } else if (isPat()) {
        gameOver = true;
        gameOverDiv.textContent = 'Pat Durumu: Oyun Beraber Bitti!';
    }
}

// Pat durumu kontrolü
function isPat() {
    // Eğer şah tehdit altında değilse ve hamle yapılamıyorsa pat durumudur.
    // Bu fonksiyonu geliştirerek detaylı şekilde kontrol edebilirsiniz.
    return false; // Şu an için basit bir kontrol
}

// Taşın tahtada geçerli olup olmadığını kontrol et
function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Geçerli hamlelerin listesi
function getAvailableMoves(piece, row, col) {
    const moves = [];
    // Burada taşın geçerli hamlelerini hesaplayacak kodlar var...
    return moves;
}

// Durum mesajını güncelle
function updateStatus() {
    if (gameOver) {
        statusDiv.textContent = `${currentPlayer} Kazandı!`;
    } else {
        statusDiv.textContent = `${currentPlayer}'ın sırası`;
    }
}

// Hareket geçmişini render et
function renderMoveHistory() {
    moveHistoryDiv.innerHTML = gameHistory.map((move, index) => {
        return `<p>Hamle ${index + 1}: ${move.piece} ${move.fromRow},${move.fromCol} -> ${move.toRow},${move.toCol}</p>`;
    }).join('');
}

// Başlangıçta tahtayı kur
setupBoard();

// Diğer eklemeler...
