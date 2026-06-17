const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function addTask(){
  const text = taskInput.value.trim();

 if(text !== ''){
  const newText = document.createElement('li');
  newText.innerHTML = 
  `<span>${text}</span>
  <button onclick="editar()">Editar</button>
  <button onclick="remover(this)">Remover</button>
  <button onclick="concluir(this)">Concluir</button>` 

  taskList.appendChild(newText);
 }
}


function zerar(){
  taskList.innerHTML = '';
}

  function remover(button){
    const itemToRemove = button.parentElement;
    taskList.removeChild(itemToRemove);
}
  function concluir(button){
    const itemToComplete = button.parentElement;
     itemToComplete.classList.toggle('completed');
}
