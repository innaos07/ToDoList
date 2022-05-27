
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
                    
                    list.innerHTML = '';
                    filterStatusAll();


                }

                todolistElem = document.createElement('li');
                let todolistNote = document.createElement('span')

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
                        todolistElem.querySelector('.todo-list__elem-note').classList.add('todo-list__elem-note--completed');
                        todolistElem.querySelector('.todo-list__btn-edit').remove();
                        todolistElem.querySelector('.todo-list__btn-completed').className = 'todo-list__btn-active'; 
                    }

                    if(todoObj[key].state == 'deleted'){
                        
                        todolistElem.classList.add('todo-list__elem--deleted--hidden')
                        console.log('render delete elem :',todolistElem)

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
                let buttonDelete = document.createElement('button');
                buttonDelete.className = 'todo-list__btn-delete';
                // buttonDelete.innerHTML = "delete";

                todolistElem.append(buttonDelete);


            }

            function createButtonCompleted(todolistElem) {
                let buttonCompleted = document.createElement('button');
                buttonCompleted.className = 'todo-list__btn-completed';
                // buttonCompleted.innerHTML = "";
                console.log('create button completed')

                todolistElem.append(buttonCompleted);
            }

            function createButtonEdit(todolistElem) {
                let buttonEdit = document.createElement('button');
                buttonEdit.className = 'todo-list__btn-edit';
                // buttonEdit.innerHTML = "edit";
                buttonEdit.dataset.buttonEdit = 'edit';

                
                todolistElem.append(buttonEdit);
            }
            
              function createButtonSave(todoElemEdit) {
                let buttonSave = document.createElement('button');
                buttonSave.className = 'todo-list__btn-save';
                // buttonSave.innerHTML = "save";
                buttonSave.dataset.buttonSave = 'save';
                
                todoElemEdit.append(buttonSave);
            }

            function createButtonActive(todolistElem) {
                let buttonActive = document.createElement('button');
                buttonActive.className = 'todo-list__btn-active';

                todolistElem.append(buttonActive)
                console.log('create button active')

            }

            function createButtonReturn(todolistElem) {
                let buttonReturn = document.createElement('button');
                buttonReturn.className = 'todo-list__btn-return';

                todolistElem.append(buttonReturn)
                console.log('create button return',buttonReturn)

            }
   


            list.addEventListener('click', onClickTodoElem)

            function onClickTodoElem() {

                let target = event.target.closest('.todo-list__btn-delete, .todo-list__btn-completed, .todo-list__btn-edit, .todo-list__btn-save, .todo-list__btn-active, .todo-list__btn-return');
                if(!target) return;

                // console.log('target', target)

                let todolistElem = event.target.closest('.todo-list__elem')
                console.log(todolistElem)
               
                if (target.className == 'todo-list__btn-delete'){
                    let buttonDelete = target;

                    console.log('click delete')
                     console.log(todolistElem)

                    // todolistElem.classList.add('todo-list__elem--deleted');
                    todolistElem.classList.add('todo-list__elem--deleted--hidden')
                    // buttonDelete.remove();
                    // createButtonReturn(todolistElem);
                    
                    // todolistElem.querySelector('.todo-list__btn-active').remove();
                    

                    deleteTodoObjElemStorage(todolistElem);
                    console.log('elem delete')

                 
                } else if (target.className == 'todo-list__btn-completed'){


                    console.log('click completed')
                    let buttonCompleted = target;

                    
                    todolistElem.dataset.stateElem = 'completed';
                    todolistElem.querySelector('.todo-list__elem-note').classList.add('todo-list__elem-note--completed') 
                    createButtonActive(todolistElem)
                    buttonCompleted.remove()
                    todolistElem.querySelector('.todo-list__btn-edit').remove()
                    // buttonCompleted.classList.add('todo-list__btn-completed--press')
                    completedTodoElemStorage(todolistElem); 


                } else if (target.className == 'todo-list__btn-edit'){

                    console.log(' click edit')  
                    let buttonEdit = target;
                  
                    createButtonSave(todolistElem);
                    buttonEdit.remove();
                    createEditArea(todolistElem);

                }  else if (target.className == 'todo-list__btn-save'){
                    let buttonSave = target;
                   
                    console.log('click save');
                    saveTodoNoteEdited(todolistElem); 

                    buttonSave.remove();
                    createButtonEdit(todolistElem);

                    editedTodoElemStorage(todolistElem);     

                }  else if (target.className == 'todo-list__btn-active') {
                    console.log('click active')
                    let buttonActive = target;
                    todolistElem.dataset.stateElem = 'active';

                    createButtonCompleted(todolistElem)
                    todolistElem.querySelector('.todo-list__elem-note').classList.remove('todo-list__elem-note--completed') 
                    createButtonEdit(todolistElem);

                    buttonActive.remove()
                    activeTodoElemStorage(todolistElem);

                } else if (target.className == 'todo-list__btn-return'){
                    console.log('click return')
                    console.log('elem return', todolistElem)
                    activeTodoElemStorage(todolistElem);
                     todolistElem.classList.add('todo-list__elem--deleted--hidden')
                }

            }


            function createEditArea(todoElemEdit) {

                let editArea = document.createElement('textarea');
                let todolistNote = todoElemEdit.querySelector('.todo-list__elem-note');

                editArea.className = 'todo-list__elem-note--edit';
                editArea.value = todolistNote.textContent;

                editArea.style.width = todolistNote.offsetWidth +'px';
                editArea.style.height = todolistNote.offsetHeight +'px';



                todolistNote.replaceWith(editArea);
                editArea.focus();
                
                editArea.onkeydown= function(e){
                      
                    if(editArea.scrollTop > 0){
                        console.log('scrollTop',editArea.scrollTop)

                        // editArea.style.height = 'auto';
                        editArea.style.height = editArea.scrollHeight + 'px';
        
                    }
                  
               }
                          
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


            function completedTodoElemStorage(todoElemCompleted) {
                   
                let keyElem = todoElemCompleted.dataset.keyObj;

                todoObj[keyElem].state = 'completed';
                saveLocalStorage();

                console.log('state completed in localStorage',todoObj[keyElem].state) 
                console.log('completedObj', todoObj);
            }

            function activeTodoElemStorage(todoElemActive) {
                console.log(todoElemActive)
                let keyElem = todoElemActive.dataset.keyObj;
                console.log('keyElem active:',keyElem)

                todoObj[keyElem].state = 'active';
                saveLocalStorage();
                console.log('state active in localStorage',todoObj[keyElem].state) 
                console.log('activeObj', todoObj);
            }

            function deleteTodoObjElemStorage(todoElemDelete) {

                console.log('keyElem', todoElemDelete.dataset.keyObj)
                let keyElem = todoElemDelete.dataset.keyObj;
                console.log(todoObj[keyElem])

                todoObj[keyElem].state = 'deleted';


                console.log('deleteobj',todoObj)

                saveLocalStorage()

            }

      

            navList.addEventListener('click', function(event){
                let target = event.target.closest('.todo-list__nav-link');
                if(!target) return;
                console.log('on filter click ', todoObj);

                list.innerHTML = '';

                if(target.dataset.state == 'all'){
                    console.log('click all')

                    filterStatusAll();

                    // setCurrentNavLink (target);
                  
                 
                } else if(target.dataset.state == 'active') {
                    console.log('starus active')

                    filterStatusActive ();
                    
                    // setCurrentNavLink (target);
                      
                } else if(target.dataset.state == 'completed'){
                    console.log('click completed')

                    filterStatusCompleted()
                    
                    // setCurrentNavLink (target);


                } else if(target.dataset.state == 'deleted'){

                    console.log('click deleted');

                    filterStatusDeleted ()
                    
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
                console.log('status end:',statusFilter)
                setNavFilter(statusFilter)

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
               setNavFilter(statusFilter)

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
               setNavFilter(statusFilter)
            }

            function filterStatusDeleted () {

                for (let key in todoObj){
                    if(todoObj[key].state == 'deleted'){
                        todolistElem = document.createElement('li');
                        todolistElem.innerHTML = todoObj[key].elem;
                        todolistElem.dataset.keyObj = key;
                        todolistElem.dataset.stateElem = todoObj[key].state;

                        todolistElem.className = "todo-list__elem";
                        todolistElem.classList.add('todo-list__elem--deleted');
                        todolistElem.querySelector('.todo-list__btn-delete').remove();
                        todolistElem.querySelector('.todo-list__btn-completed').remove();
                        createButtonReturn(todolistElem);




                        list.append(todolistElem);

                        if(todolistElem) {
                            let buttonClean = document.querySelector('.todo-list__btn-clean');

                            buttonClean.classList.add('todo-list__btn-clean--hidden');
                            buttonClean.addEventListener('click', cleanDeleteElem )
                                                    }
                    }
                } 

                statusFilter = 'deleted';
                console.log('starus end:', statusFilter)
                setNavFilter(statusFilter)
            }

           function cleanDeleteElem() {
                console.log('clean')
               
                list.innerHTML = '';
                    for (let key in todoObj){
                        console.log(key)
                        delete todoObj[key];
                    }

                todoObj.initialId = 0;
                console.log('todoObj after cleaned',todoObj) 
                saveLocalStorage()
                
                document.querySelector('.todo-list__btn-clean').classList.remove('todo-list__btn-clean--hidden')
                console.log('cleaned end')

            }

         
            function  setNavFilter(statusFilter){
               

                for (let item of navList.querySelectorAll('.todo-list__nav-link--current')) {
                    console.log('current need to deleted', item)
                    item.classList.remove('todo-list__nav-link--current')
                }  

                for (let item of navList.querySelectorAll('.todo-list__nav-link')) {
                    // console.log(item)
                    // console.log(item.dataset.state)
                    if(statusFilter == item.dataset.state) {
                        console.log('we have status :', statusFilter, item.dataset.state)
                        item.classList.add('todo-list__nav-link--current')
                    }
                }
               
            }
            




    } 

    document.addEventListener( 'DOMContentLoaded',onPageLoaded )