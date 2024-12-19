// !========================== Start Global Variables================//
const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const loadingScreen = document.querySelector(".loading");
const apiKey = "67632fb660a208ee1fde5154";
let allTodos=[];
getAllTodos();
// !========================== End Global Variables================//


// ========================== Start Events================//
formElement.addEventListener("submit",(e)=>{
e.preventDefault();
if (inputElement.value.trim().length > 0) {
  addTodos();
}
})
// ========================== End Events================//


// ?========================== Start Functions================//

// function to create obj , call API and send obj to API
async function addTodos () { 
showLoading();
  const todo ={
  title:inputElement.value,
  apiKey: apiKey
}
const obj ={
  method:"POST",
  body:JSON.stringify(todo),
  headers: {
    'Content-Type': 'application/json'
  }
}
const response = await fetch("https://todos.routemisr.com/api/v1/todos",obj)
if(response.ok)
{
  const data = await response.json()
  if(data.message ==="success"){
    // GetAllData Todo Show
    Swal.fire({
      title: "Added Successfully!",
      icon: "success",
      draggable: true
    });
    await getAllTodos ();
    formElement.reset();
  }
}
hideLoading()
}

// function to call API to retrieve all todos
async function getAllTodos () { 
  showLoading();
  const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`)
  if(response.ok)
    {
      const data = await response.json()
      if(data.message ==="success"){
      allTodos = data.todos
      displayData ()
      }
    }
    hideLoading();
}

// function to call API to retrieve all todos
function displayData () { 
let cartona="";
for (const todo of allTodos) {
  cartona+=`
  <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">

          <span onclick="markCompleted('${todo._id}')"
          style=" ${todo.completed ? "text-decoration: line-through;" : ""} " class="task-name">
          ${todo.title}</span>

          <div class="d-flex align-items-center gap-4">

            ${todo.completed ? '<span><i class="fa-regular fa-circle-check" style="color: #63e6be"></i></span>' : ""}

            <span onclick="deleteTodo('${todo._id}')" class="icon"> <i class="fa-solid fa-trash-can"></i> </span>

          </div>
        </li>
  `
}
document.querySelector(".task-container").innerHTML = cartona;
changeProgress()
}

// function to delete todos
async function deleteTodo(Id){
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async( result) => {
    if (result.isConfirmed) {
      // code of delete function
      showLoading();
      const todoData={
        todoId:Id
      }
      const obj ={
        method:"DELETE",
        body:JSON.stringify(todoData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch("https://todos.routemisr.com/api/v1/todos",obj)
      if(response.ok)
      {
        const data = await response.json()
        if(data.message ==="success"){
          Swal.fire({
            title: "Deleted!",
            text: "Your Todo has been deleted.",
            icon: "success"
          });
          getAllTodos()
        }
      }
      hideLoading();
    }
  });

}

// function to mark Completed to todo when finish it
async function markCompleted(Id){
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete it!"
  }).then(async(result) => {
    if (result.isConfirmed) {
      showLoading();
      const todoData={
        todoId:Id
      }
      const obj ={
        method:"PUT",
        body:JSON.stringify(todoData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch("https://todos.routemisr.com/api/v1/todos",obj)
      if(response.ok)
      {
        const data = await response.json()
        if(data.message ==="success"){
          Swal.fire({
            title: "Completed!",
            icon: "success"
          });
          getAllTodos()
        }
      }
      hideLoading();
    }
  });
  
}

// function to show user tasks completed from total
function changeProgress(){
  const completedTaskNumber = allTodos.filter((todo) => todo.completed).length; 
  const totalTask = allTodos.length; 

  document.getElementById("progress").style.width = `${(completedTaskNumber / totalTask) * 100}%`;

  const statusNumber = document.querySelectorAll(".status-number span");

  statusNumber[0].innerHTML = completedTaskNumber;
  statusNumber[1].innerHTML = totalTask;
}

//function to  Show Loading
function showLoading() {
  loadingScreen.classList.remove("d-none");
}

//function to hide Loading
function hideLoading() {
  loadingScreen.classList.add("d-none");
}
// ?========================== End Functions================//