
    function onPageLoaded() {
        console.log('start')

        let buttonAdd =document.querySelector('#btn-add');
        let todoText = document.querySelector('.todo-list__text');
        let list = document.querySelector('.todo-list__list-all');
        let todolistElem;
        let navList = document.querySelector('.todo-list__nav-list');
        let statusFilter = 'all'; 

        let todoObj = {
            initialId: 0,
        };

            todoText.addEventListener('focus', function() {
                
                buttonAdd.addEventListener('click', addTodoListElem );
            
            })     
         
            function addTodoListElem() {
                // console.log('add')
                let text = todoText.value.trim()

                if (!todoText.value.length || !text ) {
                    console.log('stop');
                    return;
                }
                
                createTodolistElem ();
            }

             function validationStatusFilter() {
                  // console.log('status filter before createElement', statusFilter)
                  if(statusFilter == 'deleted' || statusFilter == 'completed'){
                    
                    list.innerHTML = '';                   
                    filterStatusAll();
                }
            }


            function createTodolistElem () {
                
                validationStatusFilter();

                todolistElem = document.createElement('li');
                let todolistNote = document.createElement('span')

                todolistElem.className = "todo-list__elem";
                todolistNote.className = 'todo-list__elem-note';

                todolistNote.innerHTML = todoText.value;
                todolistElem.dataset.stateElem = 'active';

                createButtonDeleteElem (todolistElem);
                createButtonCompleted(todolistElem);
                createButtonEdit(todolistElem)

                todoText.value = "";

                list.append(todolistElem);
                todolistElem.append(todolistNote)

                makeTodoObj(todolistNote);
                saveLocalStorage();

                // console.log('createElement end')

            }

           

            function makeTodoObj(todolistNote) {
                
                todoObj[todoObj.initialId] = {
                    elem: todolistNote.innerHTML, 
                    state: todolistElem.dataset.stateElem,
                };
               
                todolistElem.dataset.keyObj = todoObj.initialId;
              
                todoObj.initialId +=1; 

            }


            function saveLocalStorage() {
         
                localStorage['todo'] = JSON.stringify(todoObj);
                // console.log('todo', localStorage['todo']);

            }

            function renderTodoList(todoObj) {

                // console.log('render')
                for (let key in todoObj){

                    if(key == 'initialId'){
                        continue;
                    }

                    todolistElem = document.createElement('li');   
                    todolistElem.className = "todo-list__elem";
                    let todolistNote = document.createElement('span');
                    todolistNote.className = 'todo-list__elem-note';
                    todolistNote.innerHTML = todoObj[key].elem;


                    if(todoObj[key].state == 'active'){

                        createButtonDeleteElem (todolistElem);
                        createButtonCompleted(todolistElem);
                        createButtonEdit(todolistElem)

                    }

                    if(todoObj[key].state == 'completed'){

                        todolistNote.classList.add('todo-list__elem-note--completed');
                        createButtonActive(todolistElem);
                        createButtonDeleteElem (todolistElem);
                    }

                    if(todoObj[key].state == 'deleted'){

                        createButtonReturn(todolistElem); 
                        todolistElem.classList.add('todo-list__elem--deleted');
                        todolistElem.classList.add('todo-list__elem--deleted--hidden');
                    
                    }
                      
                    todolistElem.dataset.keyObj = key;
                    todolistElem.dataset.stateElem = todoObj[key].state;

                    list.append(todolistElem);
                    todolistElem.append(todolistNote)
                }
                console.log('render end , obj' , todoObj)
            }

            function loadTodoListElem() {
               
                if(localStorage['todo']){
                    // console.log('yes localStorage');
                    todoObj = JSON.parse(localStorage['todo']);
                    // console.log('newobg', todoObj);
                    renderTodoList(todoObj)
                    
                }
            }

            loadTodoListElem();  
           
            function createButtonDeleteElem (todolistElem) {

                let buttonDelete = document.createElement('button');
                buttonDelete.className = 'todo-list__btn-delete';
                todolistElem.append(buttonDelete);
            }

            function createButtonCompleted(todolistElem) {

                let buttonCompleted = document.createElement('button');
                buttonCompleted.className = 'todo-list__btn-completed';
                todolistElem.append(buttonCompleted);
            }

            function createButtonEdit(todolistElem) {

                let buttonEdit = document.createElement('button');
                buttonEdit.className = 'todo-list__btn-edit';
                todolistElem.append(buttonEdit);
            }
            
              function createButtonSave(todoElemEdit) {

                let buttonSave = document.createElement('button');
                buttonSave.className = 'todo-list__btn-save';                
                todoElemEdit.append(buttonSave);
            }

            function createButtonActive(todolistElem) {

                let buttonActive = document.createElement('button');
                buttonActive.className = 'todo-list__btn-active';
                todolistElem.append(buttonActive)

            }

            function createButtonReturn(todolistElem) {

                let buttonReturn = document.createElement('button');
                buttonReturn.className = 'todo-list__btn-return';
                todolistElem.append(buttonReturn)

            }
   

            list.addEventListener('click', onClickTodoElem)

            function onClickTodoElem() {

                let target = event.target.closest('.todo-list__btn-delete, .todo-list__btn-completed, .todo-list__btn-edit, .todo-list__btn-save, .todo-list__btn-active, .todo-list__btn-return');
                if(!target) return;

                let todolistElem = event.target.closest('.todo-list__elem');
               
                if (target.className == 'todo-list__btn-delete'){

                    deleteTodoObjElemStorage(todolistElem);
                    todolistElem.remove();
                 
                } else if (target.className == 'todo-list__btn-completed'){

                    let buttonCompleted = target;
                    onClickButtonCompleted(todolistElem);
                    buttonCompleted.remove()

                } else if (target.className == 'todo-list__btn-edit'){

                    let buttonEdit = target;
                    onClicButtonEdit(todolistElem)
                    buttonEdit.remove();                    

                }  else if (target.className == 'todo-list__btn-save'){

                    let buttonSave = target;
                    let editArea = todolistElem.querySelector('.todo-list__elem-note--edit')
                    let text = editArea.value.trim();
                   
                        if(text == ''){
                            console.log('nothing')
                            editArea.focus()
                            todolistElem.classList.add('todo-list__elem--error');
                            console.log('placeholder')
                            return false;

                        } else if(text){
                            todolistElem.classList.remove('todo-list__elem--error')

                        }

                    onClickButtonSave(todolistElem);
                    buttonSave.remove();
                     
                }  else if (target.className == 'todo-list__btn-active') {

                    let buttonActive = target;
                    onClickButtonActive(todolistElem) 
                    buttonActive.remove()
                    
                } else if (target.className == 'todo-list__btn-return'){

                    activeTodoElemStorage(todolistElem);
                    todolistElem.remove();
                    deletetButtonClean();

                }

            }

            function onClickButtonSave(todolistElem) { 

                saveTodoNoteEdited(todolistElem);
                editedTodoElemStorage(todolistElem);
                   
                createButtonCompleted(todolistElem)
                createButtonEdit(todolistElem);

                todolistElem.classList.remove('todo-list__elem--edit')
            }

            function onClicButtonEdit(todolistElem) {

                createEditArea(todolistElem);
                setFocusEditArea(todolistElem);
                createButtonSave(todolistElem);
                todolistElem.classList.add('todo-list__elem--edit');

                let buttonCompleted = todolistElem.querySelector('.todo-list__btn-completed')
                buttonCompleted.remove();

            }


            function onClickButtonCompleted(todolistElem) {

                todolistElem.dataset.stateElem = 'completed';

                todolistElem.querySelector('.todo-list__elem-note').classList.add('todo-list__elem-note--completed')
                createButtonActive(todolistElem)
                todolistElem.querySelector('.todo-list__btn-edit').remove()
                
                completedTodoElemStorage(todolistElem);

            }

            function onClickButtonActive(todolistElem) {

                todolistElem.dataset.stateElem = 'active';

                createButtonCompleted(todolistElem)
                todolistElem.querySelector('.todo-list__elem-note').classList.remove('todo-list__elem-note--completed') 
                createButtonEdit(todolistElem);

                activeTodoElemStorage(todolistElem);

            }

            function createEditArea(todoElemEdit) {

                let editArea = document.createElement('textarea');
                let todolistNote = todoElemEdit.querySelector('.todo-list__elem-note');

                editArea.className = 'todo-list__elem-note--edit';
                editArea.placeholder = 'There should be your text...'
                editArea.value = todolistNote.innerHTML;

                editArea.style.width = todolistNote.offsetWidth +'px';
                editArea.style.height = todolistNote.offsetHeight + 40+'px';

                todolistNote.replaceWith(editArea);
               
                setCursorEditArea(editArea);
                         
            } 

            function setFocusEditArea(todolistElem) {

                let editArea = todolistElem.querySelector('.todo-list__elem-note--edit');
                editArea.focus();

            }

            function setCursorEditArea(editArea) {

                let text = editArea.value.trim(); 
                editArea.selectionStart =  editArea.selectionEnd = text.length;
                console.log(editArea.value.length,text.length)
                
            }

           

            function saveTodoNoteEdited(todoElemSave) {

                let editedTodoNote = document.createElement('span');
                let editArea = todoElemSave.querySelector('.todo-list__elem-note--edit')

                editedTodoNote.className ='todo-list__elem-note';
                editedTodoNote.innerHTML = editArea.value;

                editArea.replaceWith(editedTodoNote);
            }

            function editedTodoElemStorage(todolistElem) {

                let todolistNote = todolistElem.querySelector('.todo-list__elem-note')
                let keyElem = todolistElem.dataset.keyObj;
                todoObj[keyElem].elem = todolistNote.innerHTML;
                saveLocalStorage();

            }

            function completedTodoElemStorage(todoElemCompleted) {
                   
                let keyElem = todoElemCompleted.dataset.keyObj;
                todoObj[keyElem].state = 'completed';
                saveLocalStorage();

            }

            function activeTodoElemStorage(todoElemActive) {

                let keyElem = todoElemActive.dataset.keyObj;
                todoObj[keyElem].state = 'active';
                saveLocalStorage();
    
            }

            function deleteTodoObjElemStorage(todoElemDelete) {

                let keyElem = todoElemDelete.dataset.keyObj;
                todoObj[keyElem].state = 'deleted';
                saveLocalStorage()
            }

            navList.addEventListener('click', function(event){

                let target = event.target.closest('.todo-list__nav-link');
                if(!target) return;
                // console.log('on filter click ', todoObj);

                list.innerHTML = '';

                if(target.dataset.state == 'all'){

                    filterStatusAll();
                  
                } else if(target.dataset.state == 'active') {
                    // console.log('starus active')

                    filterStatusActive ();
                      
                } else if(target.dataset.state == 'completed'){
                    // console.log('click completed')

                    filterStatusCompleted();
                    
                } else if(target.dataset.state == 'deleted'){
                    // console.log('click deleted');

                    filterStatusDeleted ();
                }
                
            })

            function filterStatusAll () {
 
                let todoObjAll = {};

                for(let key in todoObj){

                    if(todoObj[key].state == 'active' || todoObj[key].state == 'completed'){
                        todoObjAll[key] = todoObj[key];
                    }
                }
                renderTodoList(todoObjAll)
                statusFilter = 'all';
                // console.log('status end:',statusFilter)
                setNavFilter(statusFilter)
                setCleanButton ()

            }

            function filterStatusActive () {

                let todoObjActive = {};

                for (let key in todoObj){

                    if(todoObj[key].state == 'active'){
                        todoObjActive[key] = todoObj[key];
                    }
               }

               renderTodoList(todoObjActive);
               statusFilter = 'active';
               // console.log('starus end', statusFilter)
               setNavFilter(statusFilter);
               setCleanButton ();

            }

            function filterStatusCompleted () {

                let todoObjCompleted = {};

                for (let key in todoObj){

                    if(todoObj[key].state == 'completed'){

                        todoObjCompleted[key] = todoObj[key];
                    }
               }

               renderTodoList(todoObjCompleted)
               statusFilter = 'completed';
               // console.log('starus end ', statusFilter)
               setNavFilter(statusFilter);
               setCleanButton ();

            }

            function filterStatusDeleted () {

                let todoObjDeleted = {};

                    for (let key in todoObj){

                        if(todoObj[key].state == 'deleted'){

                            todoObjDeleted[key] = todoObj[key];
                        }
                 
                    }


                renderTodoList(todoObjDeleted)
                
                for (let item of document.querySelectorAll('.todo-list__elem')){
                    item.classList.remove('todo-list__elem--deleted--hidden')
                }

                statusFilter = 'deleted';
                // console.log('starus end:', statusFilter);
                setNavFilter(statusFilter);
                setCleanButton ();
                
            }

            function createButtonClean(todolistElem) {

                let buttonClean = document.createElement('button');
                buttonClean.innerHTML = 'clean all';
                buttonClean.className = 'todo-list__btn-clean';
                list.after(buttonClean)

            }

           function cleanDeleteElem(event) {

                // console.log('clean')
                list.innerHTML = '';
                for (let key in todoObj){

                    if(todoObj[key].state == 'deleted'){

                        delete todoObj[key];
                    }
                }

                todoObj.initialId = 0;
                // console.log('todoObj after cleaned',todoObj) 
                saveLocalStorage()
                event.target.remove();
                
            }
         
            function  setNavFilter(statusFilter){

                for (let item of navList.querySelectorAll('.todo-list__nav-link--current')) {
                    item.classList.remove('todo-list__nav-link--current');
                }  

                for (let item of navList.querySelectorAll('.todo-list__nav-link')) {
        
                    if(statusFilter == item.dataset.state) {
                        item.classList.add('todo-list__nav-link--current');
                    }
                }
               
            }
            
            function setCleanButton () {

                let todolistElemDeleted = document.querySelector('.todo-list__elem--deleted');

                if(statusFilter == 'deleted'&& !document.querySelector('.todo-list__btn-clean') && todolistElemDeleted){

                    createButtonClean(todolistElem);
                    document.querySelector('.todo-list__btn-clean').addEventListener('click', cleanDeleteElem)

                } else if(statusFilter == 'all'|| statusFilter == 'active'|| statusFilter == 'completed') {

                    if(document.querySelector('.todo-list__btn-clean')){
                        document.querySelector('.todo-list__btn-clean').remove()
                    }
                }
           }


            //if don`t have any todoElements with status deleted , we need to deleted buttonClean`
           function deletetButtonClean() {

                if(list.innerHTML == "") {
                    document.querySelector('.todo-list__btn-clean').remove();
                }

           }
    } 

    document.addEventListener( 'DOMContentLoaded',onPageLoaded )