let url = 'https://cors-anywhere.herokuapp.com/https://file.io/dsYGC5uEThvk'

apiKey = 'AIzaSyAYXXj5PAvoe2nYITs18RWsQs_J7vFefeE'
//fileId = '1whwIH4q1vAi61QFolCYz8wLTRd5waLic'

quiz1Id = ['1ibU_StlJHZMpLt2tsaPFrnK9ZiZncaF_', '1ATd2Zqp4gz8_qDAw7jY67Q0AqoN5NLmj']


let el = document.createElement('html')
var data = []
let ids = []
testUrl = ["https://raw.githubusercontent.com/WR104/SOC20H/main/quiz1/1.html", "https://raw.githubusercontent.com/WR104/SOC20H/main/quiz1/2.html",
    "https://raw.githubusercontent.com/WR104/SOC20H/main/quiz1/KK.html"]
TotalQuizNum = 5

quizMain = ['1ViK2cmG9bnusamMyL-VpogkZnnIp6eUu', '1sdF4O0Z78QR7gEZdE1aXr1ZPgQn0OY-g',
    '1N7IGqxZMrCjhUdTFM0SQz6D2dHWfC6nE', '1ZD_7zdgatXgTmH0Jyh6euyzTx78eXoWM',
    '1_gAMgMSTi6JLOUm_WKf00KQsRdpyykdz']

function getUrl(fileId) {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`
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

function print(index) {
    const fetchIds = async () => {
        const response = await fetch(getUrl(quizMain[index]))
        const j = await response.json()
        for (var i in j.url) {
            var parts = j.url[i].split("/")
            var id = parts[parts.length - 2]
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
            el.innerHTML = texts[text]
            totalA = el.getElementsByClassName("question_id").length
            var question_num = el.getElementsByClassName("question_text user_content").length;
            for (var i = 0; i < question_num; i++) {
                var currQuestion = []
                var questionUrl = el.getElementsByClassName("update_question_url")[i]
                var questionHref = questionUrl.getAttribute("href");
                var parts = questionHref.split("/")
                var question_id = parts[parts.length-1]


                var answers = []
                var idStr = 'question-' + question_id
                idStr = "input[ name=\"" + idStr + "\" ]"
                var answersEl = el.querySelectorAll(idStr)

                hrefStr = "a[href=\"" + questionHref + "\"]"
                const anchor = el.querySelector(hrefStr)
                const parentDiv = anchor.closest("div").previousElementSibling.previousElementSibling
                const userPoints = parentDiv.querySelector(".user_points").innerHTML.split('<span')[0].trim()
                var question_check = userPoints == '2' ? true : false //check the question is right or wrong

                //const userPoints = parentDiv.querySelector(".user_points").innerHTML

                if(answersEl.length != 0){  //multipe and true_false
                    for(var a=0; a<answersEl.length;a++){
                        var answer_id = answersEl[a].getAttribute("id")
                        answerStr = "label[for=\"" + answer_id + "\" ]"
                        const answer_el = el.querySelector(answerStr)
                        const answer_string = answer_el.querySelector(".answer_text").innerHTML;

                        var answer_heck = null
                        if(answersEl[a].outerHTML.includes("checked")){
                            answer_check = question_check ? true : false
                        }else{
                            answer_check = null
                        }
                        answers.push({"string" : answer_string, "check" : answer_check})
                    }
                }
                data.push({"id" : question_id, "string":el.getElementsByClassName("question_text user_content")[i].innerHTML.trim(),
                "answers": answers})
            }

        }

        questions = [... new Set(data.map(JSON.stringify))].map(JSON.parse)
        var canvas = document.getElementById('canvas')
        for (const i in questions) {
            var question = questions[i]
            var newlist = document.createElement("ul")
            var header = document.createElement('a')
            var newline = document.createElement('br')
            newlist.appendChild(header)
            header.textContent = question.string

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

