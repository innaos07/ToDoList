
    function onPageLoaded() {
        console.log('start')



        let buttonAdd =document.querySelector('#btn-add');
       

        let todoText = document.querySelector('.todo-list__text');
        let list = document.querySelector('.todo-list__list-all');
        let todolistElem;
        let buttonClean = document.querySelector('.todo-list__btn-clean');
        let navList = document.querySelector('.todo-list__nav-list');
        let statusFilter = 'all';
       
      


        let todoObj = {
            initialId: 0,
        };

            todoText.addEventListener('focus', function() {
                console.log('focus')
                todoText.value = "";
                setTimeout (() => todoText.selectionStart = todoText.selectionEnd = 0)
                
                buttonAdd.addEventListener('click', onClickButtonAdd );
            
            })   

            todoText.onkeydown = function(e){
                console.log('add Enter')

                    if(e.code =='Enter'){
                       addTodoListElem();

                    }
                }   
            
            function onClickButtonAdd () {
                console.log('add')
                addTodoListElem()
                
            }
         
           function addTodoListElem() {

                let text = todoText.value.trim()

                if (!todoText.value.length || !text ) {
                    console.log('stop');
                    return;
                }
                
                createTodolistElem ();

           }


            function createTodolistElem () {
                

                console.log('status filter before createElement', statusFilter)
                if(statusFilter == 'deleted' || statusFilter == 'completed'){

                    console.log('statusFilter are completed or deleted ')
                    
                     for (let item of navList.querySelectorAll('.todo-list__nav-link--current')){
                        console.log('current item when createElement', item)
                        item.classList.remove('todo-list__nav-link--current')
                    }
                    


                    list.innerHTML = '';
                    filterStatusAll();


                }

                todolistElem = document.createElement('li');
                todolistNote = document.createElement('span')

                todolistElem.className = "todo-list__elem";
                todolistNote.className = 'todo-list__elem-note'

                todolistNote.innerHTML = todoText.value;
                todolistElem.dataset.stateElem = 'active';
                console.log('*** ADD NEW WHEN DELETED');
                list.append(todolistElem);
                todolistElem.append(todolistNote)

                createButtonDeleteElem (todolistElem);
                createButtonCompleted(todolistElem);
                createButtonEdit(todolistElem)

                todoText.value = "";

                makeTodoObj();
                saveLocalStorage();

                console.log('createElement end')

   

            }

            function makeTodoObj() {
                
                todoObj[todoObj.initialId] = {
                    elem: todolistElem.innerHTML, 
                    state: todolistElem.dataset.stateElem,
                };
               
                todolistElem.dataset.keyObj = todoObj.initialId;
              
                todoObj.initialId +=1; 

            }


            function saveLocalStorage() {
         
                localStorage['todo'] = JSON.stringify(todoObj);
                console.log('todo', localStorage['todo']);

            }

            function renderTodoList(todoObj) {

                console.log('render')
                for (let key in todoObj){

                    if(key == 'initialId'){
                        continue;
                    }
                    // console.log('load key localStorage', key);
                    todolistElem = document.createElement('li');
                    todolistElem.innerHTML = todoObj[key].elem;
                    todolistElem.className = "todo-list__elem";
                    console.log('load state', todoObj[key].state )

                    if(todoObj[key].state == 'completed'){
                        todolistElem.querySelector('.todo-list__elem-note ').classList.add('todo-list__elem-note--completed') 
                    }

                    if(todoObj[key].state == 'deleted'){
                        todolistElem.classList.add('todo-list__elem--deleted');
                        todolistElem.classList.add('todo-list__elem--deleted--hidden')
                        console.log('renser delete elem ',todolistElem)

                    }
                      
                    todolistElem.dataset.keyObj = key;
                    todolistElem.dataset.stateElem = todoObj[key].state;



                    list.append(todolistElem);
                }
                console.log('render end , obj' , todoObj)
            }

           

            function loadTodoListElem() {
               
                
                if(localStorage['todo']){
                    console.log('yes localStorage');

                    todoObj = JSON.parse(localStorage['todo']);
                    console.log('newobg', todoObj);
                    renderTodoList(todoObj)
                    
                }
            }
    

            loadTodoListElem();
             
           
          

            function createButtonDeleteElem (todolistElem) {
                buttonDelete = document.createElement('button');
                buttonDelete.className = 'todo-list__btn-delete';
                buttonDelete.innerHTML = "delete";

                todolistElem.append(buttonDelete);


            }

            function createButtonCompleted(todolistElem) {
                buttonCompleted = document.createElement('button');
                buttonCompleted.className = 'todo-list__btn-completed';
                buttonCompleted.innerHTML = "completed"
                
                todolistElem.append(buttonCompleted);
            }

            function createButtonEdit(todolistElem) {
                buttonEdit = document.createElement('button');
                buttonEdit.className = 'todo-list__btn-edit';
                buttonEdit.innerHTML = "edit";
                buttonEdit.dataset.buttonEdit = 'edit';

                
                todolistElem.append(buttonEdit);
            }
            
              function createButtonSave(todoElemEdit ) {
                buttonSave = document.createElement('button');
                buttonSave.className = 'todo-list__btn-save';
                buttonSave.innerHTML = "save";
                buttonSave.dataset.buttonSave = 'save';
                
                todoElemEdit.append(buttonSave);

             
            }
   


            list.addEventListener('click', onClickTodoElem)

            function onClickTodoElem() {

                let target = event.target.closest('.todo-list__btn-delete, .todo-list__btn-completed, .todo-list__btn-edit, .todo-list__btn-save');
                if(!target) return;

                console.log(target)

                let todolistElem = event.target.closest('.todo-list__elem')
                console.log(todolistElem)
               
                if (target.className == 'todo-list__btn-delete'){

                    console.log('delete')
                     console.log(todolistElem)

                    todolistElem.classList.add('todo-list__elem--deleted');
                    todolistElem.classList.add('todo-list__elem--deleted--hidden')

                    deleteTodoObjElemStorage(todolistElem);

                 
                } else if (target.className == 'todo-list__btn-completed'){

                    console.log('completed')

                    
                    todolistElem.dataset.stateElem = 'completed';
                    todolistElem.querySelector('.todo-list__elem-note ').classList.add('todo-list__elem-note--completed') 

                    completedTodoElemStorage(todolistElem);               

                } else if (target.className == 'todo-list__btn-edit'){

                    console.log('edit')  
                    let buttonEdit = target;
                  
                    createButtonSave(todolistElem);
                    buttonEdit.remove();
                    createEditArea(todolistElem);

                }  else if (target.className == 'todo-list__btn-save'){
                    let buttonSave = target;
                   
                    console.log('save');
                    saveTodoNoteEdited(todolistElem); 

                    buttonSave.remove();
                    createButtonEdit(todolistElem);

                    editedTodoElemStorage(todolistElem);     

                }

            }


            function createEditArea(todoElemEdit) {

                let editArea = document.createElement('textarea');
                let todolistNote = todoElemEdit.querySelector('.todo-list__elem-note');

                editArea.className = 'todo-list__elem-note--edit';
                editArea.value = todolistNote.textContent;

                editArea.style.height = todoElemEdit.offsetHeight +'px';


                todolistNote.replaceWith(editArea);
                editArea.focus();
                console.log('add editArea');

            }

            function saveTodoNoteEdited(todoElemSave) {

                let editedTodoNote = document.createElement('span');
                let editArea = todoElemSave.querySelector('.todo-list__elem-note--edit')

                editedTodoNote.className ='todo-list__elem-note';
                editedTodoNote.innerHTML = editArea.value;

                editArea.replaceWith(editedTodoNote);
            }

            function editedTodoElemStorage(todoElemSave) {

                let keyElem = todoElemSave.dataset.keyObj;
                todoObj[keyElem].elem = todoElemSave.innerHTML;
                saveLocalStorage();

                console.log('save',keyElem)
                console.log('saveobj', todoObj)
            }


            function completedTodoElemStorage (todoElemCompleted) {
                   
                let keyElem = todoElemCompleted.dataset.keyObj;

                todoObj[keyElem].state = 'completed';
                saveLocalStorage();

                console.log('statecompleted',todoObj[keyElem].state) 
                console.log('completedObj', todoObj);
            }

            function deleteTodoObjElemStorage(todoElemDelete) {

                console.log('keyElem', todoElemDelete.dataset.keyObj)
                let keyElem = todoElemDelete.dataset.keyObj;
                console.log(todoObj[keyElem])

                todoObj[keyElem].state = 'deleted';


                console.log('deleteobj',todoObj)

                saveLocalStorage()

            }

            buttonClean.onclick = function(event) {
                console.log('clean')
               
                list.innerHTML = '';
                localStorage.clear('todo')
                
                for (let key in todoObj){
                    delete todoObj[key];

                }
                console.log(todoObj)

            }

            navList.addEventListener('click', function(event){
                let target = event.target.closest('.todo-list__nav-link');
                if(!target) return;
                console.log('on filter click ', todoObj);

                list.innerHTML = '';

                if(target.dataset.state == 'all'){
                    console.log('click all')

                    filterStatusAll();

                    setCurrentNavLink (target);
                  
                 
                } else if(target.dataset.state == 'active') {
                    console.log('starus active')

                    filterStatusActive ();
                    
                    setCurrentNavLink (target);
                      
                } else if(target.dataset.state == 'completed'){
                    console.log('click completed')

                    filterStatusCompleted()
                    
                    setCurrentNavLink (target);


                } else if(target.dataset.state == 'delete'){

                    console.log('click deleted');

                    filterStatusDeleted ()
                    setCurrentNavLink (target);
                }
                
            })

            function filterStatusAll () {

                
                let todoObjAll = {};

                for(let key in todoObj){

                    if(todoObj[key].state == 'active' || todoObj[key].state == 'completed'){
                        todoObjAll[key] = todoObj[key];
                    }
                }
                console.log('objAll', todoObjAll)
                renderTodoList(todoObjAll)
                statusFilter = 'all';
                console.log('status end',statusFilter)

            }

            function filterStatusActive () {

                let todoObjActive = {};

                for (let key in todoObj){

                    if(todoObj[key].state == 'active'){
                        todoObjActive[key] = todoObj[key];
                    }
                 
               }

               console.log('objActive', todoObjActive)
               renderTodoList(todoObjActive)
               statusFilter = 'active';
               console.log('starus end', statusFilter)

            }

            function filterStatusCompleted () {

                let todoObjCompleted = {};

                for (let key in todoObj){

                    if(todoObj[key].state == 'completed'){

                        todoObjCompleted[key] = todoObj[key];
                    }
                 
               }

               console.log('objCompleted', todoObjCompleted)
               renderTodoList(todoObjCompleted)
               statusFilter = 'completed';
               console.log('starus end ', statusFilter)
            }

            function filterStatusDeleted () {

                for (let key in todoObj){
                    if(todoObj[key].state == 'deleted'){
                        todolistElem = document.createElement('li');
                        todolistElem.innerHTML = todoObj[key].elem;
                        todolistElem.className = "todo-list__elem";
                        todolistElem.classList.add('todo-list__elem--deleted');

                        list.append(todolistElem);
                    }
                } 

                statusFilter = 'deleted';
                console.log('starus end', statusFilter)

            }

            function  setCurrentNavLink (target){
                    
                for (let item of navList.querySelectorAll('.todo-list__nav-link--current')){
                    console.log('current', item)
                    item.classList.remove('todo-list__nav-link--current')
                }

                target.classList.add('todo-list__nav-link--current');
            }




    } 

    document.addEventListener( 'DOMContentLoaded',onPageLoaded )