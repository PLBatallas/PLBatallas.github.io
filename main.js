//Inicia SpeechSynt API
const Speechsynth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answerIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const mic = document.querySelector(".micro");




const recognition = new SpeechRecognition();
recognition.continuous = false; //solo coge un resultado por reconocimiento
recognition.lang = "en-GB";




let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;
let contador = 0;
let respuesta_dictada;
let opcion = [];


//funcion hablar
function speak (text){
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'
    speechSynthesis.speak(utterance);
}

//reconocimiento de voz
if(SpeechRecognition){
    console.log("Reconocimiento de voz soportado por el explorador")
    
    
  
}
else{
    console.log("Tu navegador no soporta reconocimiento de voz")
}

/*
recognition.onresult = function (event){
    var dictado = event.results[0][0].transcript;
}
*/

//es recomendable para la aplicacion web que el reconocimiento de voz se inicie bajo una
//orden y no automaticamente, para evitar errores por el ruido ambiente.
function reconocimiento(){
    
    if(contador == 0){
        if(Speechsynth.speaking){
            Speechsynth.cancel();
        }

        recognition.start();    
        
    }
    else{
        recognition.stop();
    }
}

recognition.addEventListener("start",startSpeechRecognition);
function startSpeechRecognition(){
    console.log("Empieza el reconocimiento")
    contador ++;
}

recognition.addEventListener("end",endSpeechRecognition);
function endSpeechRecognition(){
    console.log("Reconocimiento detenido")
    obtenerResultado();
    
    
}

recognition.addEventListener("result", resultOfSpeechRecognition)
function resultOfSpeechRecognition(event){
    console.log(event);
    respuesta_dictada = event.results[0][0].transcript;
    console.log(respuesta_dictada);
}

//introduce las preguntas en el array de preguntas
function setAvailableQuestions(){
    const totalQuestion = quiz.length;
    for(let i = 0; i<totalQuestion; i++){
        availableQuestions.push(quiz[i])
    }
}

function getNewQuestion(){
    //numeracion
    questionNumber.innerHTML= "Question " +(questionCounter +1) + " of " + quiz.length;
    //texto de la pregunta elegida al azar
    //esta es la pregunta que tenemos que leer en voz alta con la api webspeech
    const questionIndex = availableQuestions[Math.floor(Math.random()*availableQuestions.length)]
    //Imprime la pregunta
    currentQuestion = questionIndex;
    questionText.innerHTML = currentQuestion.q;
    //Y QUE LA DICTE WEB SPEECH
    speak(questionText.innerHTML);

   
    //borrar la pregunta que ha salido del array de preguntas disponibles
    //para que no se repita en proxmas rondas.
    const index1= availableQuestions.indexOf(questionIndex);
    availableQuestions.splice(index1,1);

    //desplegar las opciones
    const optionLen = currentQuestion.options.length
    //metemos las opciones en el array de opciones posibles de la pregunta actual
    for(let i = 0; i<optionLen; i++){
        availableOptions.push(i);
    }

    //cada vez que se entra a una nueva pregunta se refrescan las div de las opciones
    optionContainer.innerHTML='';
    let animationDelay = 0.5;
    //estas opciones las metemos en el html
    for(let i = 0; i<optionLen; i++){
        //randomizamos el orden de las opciones
        const optonIndex = availableOptions[Math.floor(Math.random() *availableOptions.length)];
        //eliminamos las opciones que ya han salido anteriormente
        const index2 = availableOptions.indexOf(optonIndex);
        availableOptions.splice(index2,1);
        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optonIndex];
        speak(option.innerHTML);
        option.id = optonIndex;
        option.style.animationDelay = animationDelay +'s';
        animationDelay = animationDelay + 0.2;
        option.className ="option";
        optionContainer.appendChild(option);
        option.setAttribute("onclick","getResult(this)");
        opcion[i] = option;
    }
    questionCounter++;
}



//funciones para obtener el resultado
function obtenerResultado(){ //Esta es para el modo oral

    
        if(respuesta_dictada.toString().toUpperCase() == currentQuestion.options[currentQuestion.answer].toString().toUpperCase()){
            console.log("Respuesta correcta");
            correctAnswers++;
            updateAnswerIndicator("correct");
            for(let i = 0; i<currentQuestion.options.length; i++){
                if(opcion[i].id == currentQuestion.answer){
                    opcion[i].classList.add("correct");
                }
            }
            
        }

        else{
            console.log("Respuesta erronea");
            updateAnswerIndicator("wrong");
            



            const optionLen = optionContainer.children.length;
            for(let i = 0; i<optionLen; i++){
                if(parseInt(optionContainer.children[i].id)===currentQuestion.answer){
                    optionContainer.children[i].classList.add("correct");
                }
                else{
                    optionContainer.children[i].classList.add("wrong");

                }

             }
        }
    

    

    attempt++;
    unclickableOptions();
}

function getResult(opcionEscogida){ //para el modo tap
    //debemos pasar el id de la opcion que es tipo string a entero para comparar
    //ojo en el caso de WEB SPEECH se debería de comparar los arrays
    const id = parseInt(opcionEscogida.id);
    if(id === currentQuestion.answer){
        //lo añadimos a la lista de correctas para mas tarde procesarlo y marcarlo en verde
        opcionEscogida.classList.add("correct");
        //marcar indicador como correcto
        updateAnswerIndicator("correct");
        correctAnswers++;
    }
    else{
        opcionEscogida.classList.add("wrong");
        //marcar indicador como erroneo
        updateAnswerIndicator("wrong");
        //y resaltamos la correcta
        const optionLen = optionContainer.children.length;
        for(let i = 0; i<optionLen; i++){
            if(parseInt(optionContainer.children[i].id)===currentQuestion.answer){
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickableOptions();
}

//una vez se ha elegido una opcion no se puede clicar en las demás ni cambiar de opcion
function unclickableOptions(){
    const optionLen = optionContainer.children.length;
    for(let i = 0; i<optionLen; i++){
        //añadimos a lista de ya respondidas
        optionContainer.children[i].classList.add("already-answered");
    }


}

function answerIndicator(){
    answerIndicatorContainer.innerHTML ='';
    const totalQuestion = quiz.length;
    for(let i= 0; i<totalQuestion; i++){
        const indicator = document.createElement("div");
        answerIndicatorContainer.appendChild(indicator);
    }
}

function updateAnswerIndicator(marca){
    answerIndicatorContainer.children[questionCounter-1].classList.add(marca);
}

//funcion a la que se llama desde el boton next
function next(){
    //si se pulsa next y está hablando el ordenador, se cancela la sintesis de voz
    if(Speechsynth.speaking)
        Speechsynth.cancel();
    if(questionCounter === quiz.length){
        quizOver();
    }
    else{
        getNewQuestion();
    }
    contador = 0;
    
}






function quizOver(){
    //pasamos a la pantalla de resultados
    quizBox.classList.add("hide");
    resultBox.classList.remove("hide");
    quizResult();
}

function quizResult(){
    resultBox.querySelector(".total-question").innerHTML = quiz.length;
    resultBox.querySelector(".total-attempt").innerHTML = attempt;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
    resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
    const percentage = (correctAnswers/quiz.length)*100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed() + "%";
    resultBox.querySelector(".total-score").innerHTML = correctAnswers +" / "+quiz.length;

}

function resetQuiz(){
 questionCounter = 0;
 correctAnswers = 0;
 attempt = 0;

}

function tryAgainQuiz(){
    //pasamos a la pantalla de preguntas
    resultBox.classList.add("hide");
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function goToHome(){
    resultBox.classList.add("hide");
    homeBox.classList.remove("hide");
    resetQuiz();
}


function startQuiz(){

    //cambiamos a la pantalla de preguntas
    homeBox.classList.add("hide");
    quizBox.classList.remove("hide");

    //metemos todas las preguntas en el array de preguntas disponibles
    setAvailableQuestions();
    //luego las sacamos
    getNewQuestion();
    //indicador de avance
    answerIndicator();
}
window.onload = function (){
    homeBox.querySelector(".total-question").innerHTML = quiz.length;
}


