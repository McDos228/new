const express = require('express');
const router = express.Router();
const todos = require('../../services/index').todosService;

router.get('/tasks', (req, res)=>{
    let key = req.query.key;
    let order = req.query.order;
    if(!req.query.limit){
        req.query.limit = 3;
    }
    let query = {
        limit: req.query.limit,
        offset: req.query.offset
    };
    if(key){
        query.where = {
            title: {
                $iLike: '%' + key + '%'
            }
        };
    }
    if(!order){
        order = 'id';
    }
    let userId = req.user.id;
    todos.getAllTodos(query, order, userId).then(tasks=>{
        if(tasks){
            let todoList = tasks.map((task)=>{
                return task.dataValues
            });
            res.json(todoList);
        }else {
            res.json({message:'task list not found'});
        }
    }).catch(err=>{
        if (err) res.json({
            message: "Something goes wrong!"
        });
    });
})

.post('/tasks', (req, res, next)=>{
    req.checkBody('title').notEmpty().withMessage('title is required')
        .matches(/^[A-Za-z0-9_]/, "i").withMessage('the title must contain letters or numbers');
    let errors = req.validationErrors();
    if(errors) return next({message: errors[0].msg});
    let title = req.body.title;
    let userId = req.user.id;
    todos.createTodo(title, userId).then(task=>{
        if(task){
            res.json(task);
        }else {
            res.json({message: 'task not found'});
        }
    }).catch((error)=>{
        res.json({
            message: "User isn`t exist. Try to register!"
        });
    });
})

.get('/tasks/:id', (req, res)=>{

    let userId = req.user.id;
    let id = +req.params.id;
    todos.getOneTodo(id, userId).then(task=>{
        if(task){
            res.json(task.dataValues);
        }else {
            res.json({message: 'task not found'});
        }
    }).catch(error=>{
        res.json({message : error.message});
    });

})

.put('/tasks/:id', (req, res, next)=>{
    req.checkBody('title')
        .notEmpty().withMessage('title is required')
        .isLength({ max: 50 }).withMessage('title must be at least 5 characters')
        .matches(/^[A-Za-z0-9_]/, "i").withMessage('the title must contain letters or numbers');
    if(req.body.status){
        req.checkBody('status').notEmpty().withMessage('status is required');
    }
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        return next({message: errorArray.join()});
    }else{
        let id = req.params.id;
        let title = req.body.title;
        let status = req.body.status;
        let userId = req.user.id;
        todos.updateTodo(id, title, status, userId).then((data) => {
            res.json(data);
        }).catch(err=>{
            res.json({message : err});
        })
    }
})

.delete('/tasks/:id', (req, res)=>{
    let userId = req.user.id;
    let id = +req.params.id;
    todos.deleteTodo(id, userId).then((data)=> {
        if(data===1){
            res.json({message: 'Task successfully deleted'});
        }else if(data===0){
            res.json({message: 'Task not found'});
        }
    }).catch(error=>{
        res.json({message: error})
    });

});

module.exports = router;