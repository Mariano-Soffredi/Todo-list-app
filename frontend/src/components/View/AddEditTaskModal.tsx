import { useState } from 'react';
import { Alert, Button, Form, Modal, ModalHeader } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UnauthorizedError } from '../../errors/http_errors';
import { Task, Todo } from '../../models/todo';
import * as TodosApi from "../../network/todos_api";
import TextInputField from "../form/TextInputField";

interface AddEditTaskModalProps {
  taskToEdit?: Task,
  todo?: Todo,
  onDismiss: () => void,
  onSuccessful: (todo: Todo) => void,
  todoId: string,
}

const AddEditTaskModal = ({ taskToEdit, todo, onDismiss, onSuccessful, todoId }: AddEditTaskModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Task>();

  async function onSubmit(task: Task) {
    try {
      if (todo && taskToEdit) {
        const updatedTodo = await TodosApi.updateTask(todo, taskToEdit, task);
        onSuccessful(updatedTodo);

        // Pre-render
        todo.tasks[todo.tasks.indexOf(taskToEdit)] = Object.assign(taskToEdit, { ...task });
        onSuccessful({...todo});
        return
      }
      const updatedTodo = await TodosApi.createTask(todoId, task);
      onSuccessful(updatedTodo);
    } catch (error) {
      if (error instanceof UnauthorizedError) setErrorText(error.message);
      console.error(error);
    };
  }

  return (
    <Modal show onHide={onDismiss}>
      <ModalHeader closeButton>
        <Modal.Title>
          {taskToEdit ? `Edit: ${taskToEdit.title}` : "Create a New Task"}
        </Modal.Title>
      </ModalHeader>

      <Modal.Body>
        {errorText &&
          <Alert variant="danger">
            {errorText}
          </Alert>
        }
        <Form id='AddEditTaskForm' onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Insert title"
            register={register}
            registerOptions={{ required: "Required" }}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onDismiss} variant="light">
          Cancel
        </Button>
        <Button
          type="submit"
          form='AddEditTaskForm'
          disabled={isSubmitting}
        >
          {taskToEdit ? "Edit Task" : "Create Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEditTaskModal;