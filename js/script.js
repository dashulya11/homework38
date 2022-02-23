'use strict';

(function () {
    
    const todoList = {
        formId: null,
        form: null,
        findForm() {
            const form = document.getElementById(this.formId);
            
            if (form === null || form.nodeName !== 'FORM') {
                throw new Error('There is no such form on the page');
            }

            this.form = form;
            return form;
        },

        addFormHandler() {
            this.form.addEventListener(
                    'submit',
                    (event) => this.formHandler(event)
                );
        },

        preFillTodoList() {
            document.addEventListener(
                'DOMContentLoaded',
                this.preFillHandler.bind(this)
                
            )
        },

        preFillHandler() {
            const data = this.getData();

            // data.forEach(todoItem => {
            //     const template = this.createTemplate(todoItem);
            //     document
            //     .getElementById('todoItems')
            //     .prepend(template);
            // })
          const itr = data[Symbol.iterator]();

          for (let template of data) {
            template = this.createTemplate(itr.next().value);
            document
              .getElementById('todoItems')
              .prepend(template);
          }
            
        },

        formHandler(event) {
            event.preventDefault();
            const inputs = this.findInputs(event.target);
            const data = {};

            inputs.forEach( input => {
                data[input.name] = input.value;
            })

            this.setData(data);
            const template = this.createTemplate(data);
            document
                .getElementById('todoItems')
                .prepend(template);
            event.target.reset();
        },

        
        setData(data) {
            if (!localStorage.getItem(this.formId)) {
                let arr = [];
                arr.push(data);
                // let data = [data]; //same
                localStorage.setItem(
                this.formId,
                JSON.stringify(arr)
                );

                return;
            } 

            let existingData = localStorage.getItem(this.formId);
            existingData = JSON.parse(existingData);
            existingData.push(data);
            localStorage.setItem(
                this.formId,
                JSON.stringify(existingData)
            );
        },

        getData() {
            return JSON.parse(
                localStorage.getItem(this.formId));
        },

        findInputs( target ) {
            return target.querySelectorAll(
                'input:not([type = submit], [type = reset]), textarea'
            );
        },

        init(todoListFormId) {
            if (typeof todoListFormId !== 'string'  || todoListFormId.length <= 0) {
                throw new Error('Todo List Id is not valid');
            }

            this.formId = todoListFormId;

            this.findForm();
            this.addFormHandler();
            this.preFillTodoList();
            
            
        },

        createTemplate({ title, description }) {
            const todoItem = this.createElement('div', 'col-4');
            const taskWrapper = this.createElement('div', 'taskWrapper');
            todoItem.append(taskWrapper);

            const taskHeading = this.createElement(
                'div', 'taskHeading',
                title
            );
            const taskDescription = this.createElement(
                'div',
                'taskDescription',
                description
            );
            taskWrapper.append(taskHeading);
            taskWrapper.append(taskDescription);
            return todoItem;
        },

        createElement(nodeName, classes , innerContent = null) {
            const el = document.createElement(nodeName);
            if (Array.isArray(classes)) {
                classes.forEach(singleClassName => {
                    el.classList.add(singleClassName);

                })

            } else {
                el.classList.add(classes);
            }
            if (innerContent) {
                el.innerHTML = innerContent;
            }
            
            return el;
        },
        
        deleteWrapper() {
            console.log(this);
        }
    }
    todoList.init('todoForm');

})()