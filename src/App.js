import React, { useState, useEffect} from 'react' ;
import './App.css';
import { MdOutlineDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";


function App() {

  // initialising the various state variabes using useState hook
  const [allTodos, setTodos] = useState([]) ;
  const [newTitle , setNewTitle] = useState("") ;
  const [newDescription , setNewDescription] = useState("") ;
  const [isCompleteScreen , setIsCompleteScreen] = useState(false) ;
  const [completedTodos, setCompletedTodos] = useState([]) ;
  const [currentEdit, setCurrentEdit] = useState("") ;              // represents the index of the todo item currently being edited
  const [currentEditedItem, setCurrentEditedItem] = useState("") ;  // represents the todod item currently being edited

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription
    };

    let updatedTodoArr = [...allTodos] ;
    updatedTodoArr.push(newTodoItem) ;      // adds new todos
    setTodos(updatedTodoArr) ;                // creates a copy of the existing todos and adds all the new todos in array, then updates it
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr))
  };

  const handleDeleteTodo = (index) =>{
    let reducedTodos = [...allTodos] ;
    reducedTodos.splice(index,1) ;   // splice function deletes item at specified index

    localStorage.setItem('todolist', JSON.stringify(reducedTodos)) ;
    setTodos(reducedTodos) ;
  };

  const handleComplete = (index) => {
    let now = new Date() ;
    let dd = now.getDate() ;
    let mm = now.getMonth() ;
    let yyyy = now.getFullYear() ;
    let h = now.getHours() ;
    let m = now.getMinutes() ;
    let s = now.getSeconds() ;
    let completedOn = 
    dd + '-' + mm + '-' + yyyy + 'at' + h + ':' + m + ':' + s ;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos] ;
    updatedCompletedArr.push(filteredItem) ;
    setCompletedTodos(updatedCompletedArr) ;
    handleDeleteCompletedTodo(index) ;                  // deletes completed todo items when called
    localStorage.setItem ('completedTodos' , JSON.stringify(updatedCompletedArr)) ;
  };

  const handleDeleteCompletedTodo = (index) =>{    // when user wants to delete completed todo item
    let reducedTodo = [...completedTodos] ;
    reducedTodo.splice(index,1) ;

    localStorage.setItem ('completedTodos', JSON.stringify(reducedTodo)) ;
    setCompletedTodos (reducedTodo) ;
  };


  useEffect(() =>{
    let savedTodo = JSON.parse (localStorage.getItem('todolist')) ;        // retrieving saved and completed todos from local storage
    let savedCompletedTodos = JSON.parse (localStorage.getItem('completedTodos')) ; // data obtained in JSON Format , hence converting it into JS objects using 'parse' method
    if(savedTodo){   //updating the initial empty array with saved todos and saved completed todos retrieved from local storage
      setTodos (savedTodo);
    }

    if(savedCompletedTodos){
      setCompletedTodos (savedCompletedTodos) ;
    }
  }, []) ; // The empty dependency array [] indicates that this effect doesn't depend on any values from the component's props or state.
  //Therefore, it only runs once after the component is mounted.
  //This ensures that the effect doesn't run again if there are changes to component props or state, preventing unnecessary re-renders.

  const handleEdit = (ind, item) =>{
    setCurrentEdit(ind) ;
    setCurrentEditedItem(item) ;
  }

  const handleUpdateTitle = (value) =>{     // called when the user updates the title of todo item being edited
    setCurrentEditedItem((prev) =>{
      return {...prev, title:value}
    })
  }

  const handleUpdateDescription = (value) =>{   //called when user updates description of the todo item being edited
    setCurrentEditedItem((prev) =>{
      return {...prev,description:value}
    })
  }

  const handleUpdateTodo = () => {    // creats a copy of the existing todo array and replaces it with the 'currentEditedItem'
    let newTodo = [...allTodos] ;
    newTodo[currentEdit] = currentEditedItem ;
    setTodos(newTodo) ;
    setCurrentEdit("") ;
  }

  return (
    <div className='App'>
      <h1>My ToDos</h1>
       
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
          <label>Title</label>
          <input type='text' value = {newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='What is the task title?' />
          </div>

          <div className='todo-input-item'>
          <label>Description</label>
          <input type='text' value = {newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='What is the task description?' />
          </div>

          <div className='todo-input-item'>
            <button type='button'
            onClick={handleAddTodo} className='addBtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className= {`secondaryBtn ${isCompleteScreen === false && 'active'}`}
           onClick={() => setIsCompleteScreen(false)} >
            Todo
          </button>
          <button className=  {`secondaryBtn ${isCompleteScreen === true && 'active'}`}
           onClick={() => setIsCompleteScreen(true)} >
            Completed
          </button>
        </div>

        <div className='todo-list'>

          {isCompleteScreen === (false) && allTodos.map((item, index) =>{
              if(currentEdit === index){
                return(
                <div className='edit_wrapper' key={index} >
                  <input placeholder='Updated Title' onChange={(e) => handleUpdateTitle(e.target.value)}
                  value={currentEditedItem.title} />

                  <textarea placeholder='Updated Description'
                  rows={4}
                  onChange={(e) => handleUpdateDescription(e.target.value)}
                  value={currentEditedItem.description} />

                  <button type='button' onClick={handleUpdateTodo} className='editBtn'>
                    Update
                  </button>
                </div>
                );
              }else{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3> {item.title} </h3>
                  <p> {item.description} </p>
                </div>

              <div>
                <MdOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index)} title='Delete?'/>
                <FaCheckCircle className='check-icon' onClick={() => handleComplete(index)} title='Complete?'/>
                <CiEdit className='edit-icon' onClick={() => handleComplete (index, item)} title='Edit?' />
              </div>
          </div>
            );
          }
          })}

          {isCompleteScreen === (true) && completedTodos.map((item, index) =>{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3> {item.title} </h3>
                  <p> {item.description} </p>
                  <p><small>Completed on : {item.completedOn}</small></p>
                </div>

                <div>
            <MdOutlineDelete className='delete-icon' onClick={() => handleDeleteCompletedTodo(index)} title='Delete?'/>
            </div>
          </div>
            );
          })}

        </div>
      </div>
       

    </div>
  );
}

export default App;
