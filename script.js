let currentText = "";
let startTime;
let timeLimit = 10000; // 10초
let score = 0;
let timer;
let isQuestionActive = true; // 새로운 변수: 현재 문제가 활성 상태인지 추적
let totalProblems = 0; // 총 문제 수
let totalTimeTaken = 0; // 총 걸린 시간

const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const textDisplay = document.getElementById("text-display");
const inputField = document.getElementById("input-field");
const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const timeGauge = document.getElementById("time-gauge");

function generateRandomExpression() {
    const operators = ['+', '-', '*', '/'];
    const numCount = Math.floor(Math.random() * 5) + 2; // 2에서 6개의 숫자
    let expression = '';

    for (let i = 0; i < numCount; i++) {
        // 2자리 또는 3자리 숫자 생성
        const num = Math.floor(Math.random() * 900) + 10; // 10에서 999 사이의 숫자
        
        if (i > 0) {
            const operator = operators[Math.floor(Math.random() * operators.length)];
            expression += ` ${operator} `;
        }
        
        expression += num;
    }

    return expression;
}

function updateTimeGauge(timeLeft) {
    const percentage = (timeLeft / timeLimit) * 100;
    timeGauge.innerHTML = `<div id="time-gauge-fill" style="width: ${percentage}%"></div>`;
}

function calculateScore(expressionLength, timeTaken) {
    // 기본 점수: 글자 수 * 2
    let baseScore = expressionLength * 2;
    
    // 시간 보너스: 5초 이내에 완료하면 추가 점수
    let timeBonus = Math.max(0, 5 - timeTaken) * 10;
    
    // 총 점수 계산 (평균 50점을 목표로 조정)
    let totalScore = Math.round(baseScore + timeBonus);
    
    // 최소 10점, 최대 100점으로 제한
    return Math.min(Math.max(totalScore, 10), 100);
}

function showGameClearScreen() {
    const averageScore = (score / totalProblems).toFixed(2);
    const averageSpeed = (totalTimeTaken / totalProblems).toFixed(2);
    gameArea.innerHTML = `
        <h2>게임 클리어!</h2>
        <p>총 점수: ${score}</p>
        <p>평균 점수: ${averageScore}</p>
        <p>총 문제 수: ${totalProblems}</p>
        <p>평균 속도: ${averageSpeed} 초</p>
        <button id="restart-button">다시 시작</button>
    `;
    document.getElementById("restart-button").addEventListener("click", () => {
        location.reload(); // 페이지 새로고침
    });
}

function newText() {
    currentText = generateRandomExpression();
    textDisplay.textContent = currentText;
    inputField.value = "";
    startTime = new Date();
    result.textContent = "";
    isQuestionActive = true; // 새 문제 시작 시 활성 상태로 설정

    clearInterval(timer);
    timer = setInterval(() => {
        const timeElapsed = new Date() - startTime;
        const timeLeft = timeLimit - timeElapsed;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            result.textContent = "시간 초과!";
            isQuestionActive = false; // 시간 초과 시 비활성 상태로 설정
            setTimeout(newText, 2000);
        } else {
            updateTimeGauge(timeLeft);
        }
    }, 100);
}

function startGame() {
    gameArea.style.display = "block";
    startButton.style.display = "none";
    inputField.focus(); // 텍스트 박스에 포커스
    newText();
}

startButton.addEventListener("click", startGame);

inputField.addEventListener("input", () => {
    if (!isQuestionActive) return; // 문제가 비활성 상태면 입력 무시

    const expectedInput = currentText.replace(/\s/g, '');
    const userInput = inputField.value.replace(/\s/g, '');
    
    if (userInput === expectedInput) {
        clearInterval(timer);
        const timeTaken = (new Date() - startTime) / 1000;
        const expressionLength = expectedInput.length;
        const newPoints = calculateScore(expressionLength, timeTaken);
        score += newPoints;
        totalProblems += 1;
        totalTimeTaken += timeTaken;
        
        const charactersPerMinute = Math.round((expressionLength / timeTaken) * 60);
        result.textContent = `완료! 속도: ${charactersPerMinute} 문자/분, 획득 점수: ${newPoints}`;
        scoreDisplay.textContent = `점수: ${score}`;
        isQuestionActive = false;
        
        if (score >= 200) { // 목표 점수를 200점으로 설정
            showGameClearScreen();
        } else {
            setTimeout(newText, 2000);
        }
    } else if (userInput.length === expectedInput.length) {
        // 길이가 같지만 내용이 다른 경우 오답 처리
        result.textContent = "오답!";
        isQuestionActive = false; // 오답 처리 후 비활성 상태로 설정
        setTimeout(newText, 2000);
    }
});

// 게임 시작 전에는 newText()를 호출하지 않습니다.

