import express from "express";
import * as TodosController from "../controllers/todos";

const router = express.Router();

router.get('/', TodosController.getTodos);

router.get('/:todoId', TodosController.getTodo);

router.post('/', TodosController.createTodo);

router.patch('/:todoId', TodosController.updateTodo);

router.delete('/:todoId', TodosController.deleteTodo)

router.post('/task', TodosController.createTask);

export default router;