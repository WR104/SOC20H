let url = 'https://filebin.net/xrom6qfi37vnnp4i/test.json'
const j = fetch(url)
    .then((response) => response.json())
    .then((e) => {
        return e
    })

var el = document.createElement('html')

let readId = "12cTiV6swRJRDiXlCgTbupr4T-UF_eWIt"
async function downloadFile(realFileId) {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
  
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
  
    fileId = realFileId;
    try {
      const file = await service.files.get({
        fileId: fileId,
        alt: 'media',
      });
      console.log(file.status);
      return file.status;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

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
// const print = async () => {
//     const T = await j

//     inputT = await get()
//     //T.questions.push({})
//     console.log(T.questions)
//     console.log(inputT)

//     questions = T.questions
//     var canvas = document.getElementById('canvas')
//     for (const i in questions) {
//         var question = questions[i]
//         var newlist = document.createElement("ul")
//         var header = document.createElement('a')
//         var newline = document.createElement('br')
//         newlist.appendChild(header)
//         header.textContent = question.describe

//         for (const a in question.answers) {
//             var answer = question.answers[a]
//             var newa = document.createElement('li')
//             var describe = document.createElement('a' + a)
//             newa.appendChild(describe)
//             newlist.appendChild(newa)
//             describe.textContent = answer.string + (answer.check === true ? ' ✔️' : answer.check === false ? ' ❌' : '')
//         }

//         newlist.appendChild(newline)
//         canvas.appendChild(newlist)
//     }
// }