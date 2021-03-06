(function(app, owl) {
    class TodoView extends owl.View {
        constructor(options) {
            super({
                className: 'v-todo',
                // you can use any template engine here
                template: function () {
                    return (
                        '<form>' +
                        '<h1>Todo list</h1>' +
                        '<input type="text" data-element="title" placeholder="Add a task" />' +
                        '<div data-element="counter" class="v-todo--counter"></div>' +
                        '</form>' +
                        '<div data-element="items"></div>' +
                        '<div data-element="count"></div>'
                    );
                },
                events: {
                    'keyup $title': 'keyup',
                    'submit form': 'submit'
                },
                collection: options.collection
            });
            this.templateCount = function (data) {
                return (
                    '<div class="v-todo--count">' +
                    data.countLeft + ' items left' +
                    '</div>'
                );
            };
            // update links to data-element
            // and update special events (submit, focus, blur)
            this.render();
            this.initListeners();
        }
        render() {
            this.el.innerHTML = this.template();
            this.update();
            this.renderItems();
            this.renderCount();
        }
        renderItems() {
            var items = this.collection.getModels();
            this.elements.items.innerHTML = '';
            items.forEach((model) => {
                var todoItemView = new app.TodoItemView({
                    model: model
                });
                this.elements.items.appendChild(todoItemView.getEl());
            });
        }
        renderCount() {
            var countLeft = 0;
            this.collection.getModels().forEach(function(model) {
                if(!model.get('isDone')) {
                    countLeft++;
                }
            });
            this.elements.count.innerHTML = this.templateCount({
                countLeft: countLeft
            });
        }
        initListeners() {
            this.collection.on('change', () => {
                this.renderItems();
                this.renderCount();
            });
        }
        submit(element, event) {
            var todoItem;
            event.preventDefault();
            todoItem = new app.TodoItemModel({
                title: this.elements.title.value,
                isDone: false
            });
            todoItem.save().then(() => {
                this.collection.fetch();
            });
            this.elements.title.value = '';
        }
        keyup(element) {
            this.elements.counter.innerHTML = element.value.length.toString() || '';
        };
    }
    app.TodoView = TodoView;
})(app, owl);
