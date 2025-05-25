
// express 도구 사용, 3000 포트 사용, mysql.js 모듈 사용, bcrypt 모듈 사용
const express = require('express');
const port = 3000;
const db = require('./mysql.js');
const bcrypt = require('bcrypt');

// express 사용해 app(서버)만들기, app에서 json형식 사용
const app = express();
app.use(express.json()); 

// 127.0.0.1:3000로 들어오면 실행되는 코드(테스트용)
app.get('/', (req, res) => {
    res.send('잘 실행되는구만 흠');
});

app.get('/db', async (req, res) => { // 127.0.0.1:3000/db에 접속하면 실행
  try { 
      const [rows] = await db.query('SELECT * FROM user'); // db에 접속해 user 테이블의 데이터를 가져와서 [rows]에 저장
      res.json(rows); // rows를 json형식으로 변환해서 전송
  
    } catch (err) { // db에 접속하는데 에러가 나면 실행
      console.error('DB 조회 에러:', err);
  }
});


app.post('/db', async (req, res) => { // 127.0.0.1:3000/db에 데이터를 전송하면 실행
    console.log('요청 본문:', req.body); // 보낸 데이터 내용을 콘솔에 출력
    const { ID, PW } = req.body; // 보낸 데이터에서 ID와 PW를 저장

    // ID와 PW가 없으면 에러 메시지 출력
    if (!ID || !PW) { 
        console.log('ID 또는 PW 누락'); 
        return res.status(400).send('ID와 PW를 모두 입력하세요.');
    }

    try { // 비밀번호 해싱 부분
        
        console.log('비밀번호 입력값:', PW); // 콘솔에 사용자가 입력한 비밀번호 출력
        const hashedPW = await bcrypt.hash(PW, 10); // 입력한 pw를 10의 보안강도로 해싱 후 hashedPW에 저장
        console.log('해시된 비밀번호:', hashedPW); // 콘솔에 해시된 비밀번호 출력

        
        const [results] = await db.query('INSERT INTO user (ID, PW) VALUES (?, ?)', [ID, hashedPW]); //db에 ID와 hashedPW를 저장
        console.log('DB 저장 성공',); // 콘솔에 DB 저장 성공 출력
        res.json({ msg: 'DB 저장 성공'}); // json형식으로 DB 저장 성공 메시지 전송
    } catch (err) { // db에 저장하는데 에러가 나면 실행
        console.error('에러 발생:', err);
        res.status(500).json({ msg: '서버 오류', error: err.message });
    }
});

// 서버를 3000 포트로 실행
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
