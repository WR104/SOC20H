let url = 'https://situla.bitbit.net/filebin/62c5b43d5c04c312b5935e823691d793e3ece77181cdf0dfe47a512a5401a4db/ccabc787fb1dff12fcd2c75b9dfe064266f670317b1efd1072cb6508822c3782?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=HZXB1J7T0UN34UN512IW%2F20230116%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230116T211552Z&X-Amz-Expires=30&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D30&response-content-disposition=filename%3D%22test.json%22&response-content-type=application%2Fjson&X-Amz-Signature=6ea37e74b131bafb2613c1248ab8b6a290ca51378b9921e670d93014ef56f901'

const j = fetch(url)
    .then((response) => response.json())
    .then((e) => {
        return e
    })

var el = document.createElement('html')

inputT = []
document.getElementById('fileInput').addEventListener('change', function selectedFileChanged() {
    if (this.isDefaultNamespace.length === 0) {
        alert('请选择文件')
        return null
    }

    const reader = new FileReader()
    reader.onload = function fileReadCompleted() {
        el.innerHTML = reader.result
        for (var i = 0; i < el.getElementsByClassName("question_text user_content").length; i++) {
            answers = []
            for (var a = i; a < i + 4; a++) {
                answers.push({
                    "string": el.getElementsByClassName("answer_text")[a].innerHTML.trim(),
                    "check": null
                })
            }
            item = {
                "describe": el.getElementsByClassName("question_text user_content")[i].innerHTML.trim(),
                "id": el.getElementsByClassName("assessment_question_id")[i].innerHTML.trim(),
                "answers": answers
            }
            inputT.push(item)
        }
    }
    reader.readAsText(this.files[0])

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            for (var i = 0; i < inputT.length; i++) {
                if (!data.questions.includes(inputT[i].id))
                    data.questions.push(inputT[i])
            }
            console.log(data)
            questions = data.questions
            var canvas = document.getElementById('canvas')
            for (const i in questions) {
                var question = questions[i]
                var newlist = document.createElement("ul")
                var header = document.createElement('a')
                var newline = document.createElement('br')
                newlist.appendChild(header)
                header.textContent = question.describe

                for (const a in question.answers) {
                    var answer = question.answers[a]
                    var newa = document.createElement('li')
                    var describe = document.createElement('a' + a)
                    newa.appendChild(describe)
                    newlist.appendChild(newa)
                    describe.textContent = answer.string + (answer.check === true ? ' ✔️' : answer.check === false ? ' ❌' : '')
                }

                newlist.appendChild(newline)
                canvas.appendChild(newlist)
            }
        })
})
