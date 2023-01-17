let url = 'https://cors-anywhere.herokuapp.com/https://file.io/dsYGC5uEThvk'

apiKey = 'AIzaSyAYXXj5PAvoe2nYITs18RWsQs_J7vFefeE'
//fileId = '1whwIH4q1vAi61QFolCYz8wLTRd5waLic'

quiz1Id = ['1ibU_StlJHZMpLt2tsaPFrnK9ZiZncaF_', '1ATd2Zqp4gz8_qDAw7jY67Q0AqoN5NLmj']


let el = document.createElement('html')
var data = []
let ids = []
testUrl = ["https://raw.githubusercontent.com/WR104/SOC20H/main/quiz1/1.html", "https://raw.githubusercontent.com/WR104/SOC20H/main/quiz1/2.html"]
TotalQuizNum = 5

quizMain = ['1ViK2cmG9bnusamMyL-VpogkZnnIp6eUu', '1sdF4O0Z78QR7gEZdE1aXr1ZPgQn0OY-g',
    '1N7IGqxZMrCjhUdTFM0SQz6D2dHWfC6nE', '1ZD_7zdgatXgTmH0Jyh6euyzTx78eXoWM',
    '1_gAMgMSTi6JLOUm_WKf00KQsRdpyykdz']

function getUrl(fileId) {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`
}

async function getQuizUrls(index) {
    fetch(getUrl(quizMain[0]))
        .then(response => response.json())
        .then(d => {
            var result = []
            for (var i in d.url) {
                result.push(d.url[i])
            }
            console.log(result)
            return result
        })
        .catch(e => {
            console.log(e)
        })
}

async function initIds(index) {
    fetch(getUrl(quizMain[index]))
        .then(response => response.json())
        .then(d => {
            var ids = []
            for (var i in d.url) {
                var parts = d.url[i].split("/")
                var id = parts[parts.length - 2]
                ids.push(id)
            }
        }
        )
}

function helper(i, totalA) {
    MatchingAnsId = el.getElementsByClassName("question_id")[a].innerHTML.trim()
    checkFlag = null
    while (a < totalA && el.getElementsByClassName("question_id")[a].innerHTML.trim() == MatchingAnsId) {
        if (el.getElementsByClassName("question_input")[a].outerHTML.toString().includes("checked")) {    //selected
            if (el.getElementsByClassName("user_points")[i].innerHTML.trim()[0] == 2) {     //correct
                checkFlag = true
            }
            else {
                checkFlag = false
            }
        }
        answers.push({
            "string": el.getElementsByClassName("answer_text")[a].innerHTML.trim(),
            "check": checkFlag
        })
        a += 1
        checkFlag = null
    }
    item = {
        "describe": el.getElementsByClassName("question_text user_content")[i].innerHTML.trim(),
        "id": el.getElementsByClassName("assessment_question_id")[i].innerHTML.trim(),
        "answers": answers
    }
    data.push(item)

    return a
}

function print(index) {
    const fetchIds = async () => {
        const response = await fetch(getUrl(quizMain[index]))
        const j = await response.json()
        for (var i in j.url){
            var parts = j.url[i].split("/")
            var id = parts[parts.length-2]
            ids.push(id)
        }
    }

    const fetchText = async (url) => {
        const response = await fetch(url)
        return await response.text()
    }

    const getTextFromMultipleFiles = async () => {
        await fetchIds()
        const promises = ids.map(id => fetchText(getUrl(id)));
        //const promises = testUrl.map(url => fetchText(url))
        const texts = await Promise.all(promises);
        return texts;
    }

    getTextFromMultipleFiles().then(texts => {
        for (const text in texts) {
            a = 0   //index for answers
            el.innerHTML = texts[text]
            totalA = el.getElementsByClassName("answer_text").length
            for (var i = 0; i < el.getElementsByClassName("question_text user_content").length; i++) {
                answers = []
                item = {}
                if (a < totalA) {
                    MatchingAnsId = el.getElementsByClassName("question_id")[a].innerHTML.trim()
                }
                checkFlag = null
                while (a < totalA && el.getElementsByClassName("question_id")[a].innerHTML.trim() == MatchingAnsId) {
                    if (el.getElementsByClassName("question_input")[a].outerHTML.toString().includes("checked")) {    //selected
                        if (el.getElementsByClassName("user_points")[i].innerHTML.trim()[0] == 2) {     //correct
                            checkFlag = true
                        }
                        else {
                            checkFlag = false
                        }
                    }
                    answers.push({
                        "string": el.getElementsByClassName("answer_text")[a].innerHTML.trim(),
                        "check": checkFlag
                    })
                    a += 1
                    checkFlag = null
                }
                item = {
                    "describe": el.getElementsByClassName("question_text user_content")[i].innerHTML.trim(),
                    "id": el.getElementsByClassName("assessment_question_id")[i].innerHTML.trim(),
                    "answers": answers
                }
                data.push(item)
            }
        }
        console.log(data)

        questions = [... new Set(data.map(JSON.stringify))].map(JSON.parse)
        var canvas = document.getElementById('canvas')
        for (const i in questions) {
            var question = questions[i]
            var newlist = document.createElement("ul")
            var header = document.createElement('a')
            var newline = document.createElement('br')
            newlist.appendChild(header)
            header.textContent = question.describe

            for (const j in question.answers) {
                var answer = question.answers[j]
                var newa = document.createElement('li')
                var describe = document.createElement('a' + j)
                newa.appendChild(describe)
                newlist.appendChild(newa)
                describe.textContent = answer.string + (answer.check === true ? ' ✔️' : answer.check === false ? ' ❌' : '')
            }

            newlist.appendChild(newline)
            canvas.appendChild(newlist)
        }
    });
    for (var q = 1; q <= TotalQuizNum; q++) {
        const button = document.getElementById(`quiz${q}`)
        button.remove()
    }
}
document.getElementById('quiz1').addEventListener('click', function () { print(0) })
document.getElementById('quiz2').addEventListener('click', function () { print(1) })
document.getElementById('quiz3').addEventListener('click', function () { print(2) })
document.getElementById('quiz4').addEventListener('click', function () { print(3) })
document.getElementById('quiz5').addEventListener('click', function () { print(4) })

