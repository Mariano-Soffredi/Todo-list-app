import { Modal, Form, Button } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { Todo } from "../../models/todo";
import { TodoInput } from "../../network/todos_api"
import * as TodosApi from "../../network/todos_api"
import TextInputField from "../form/TextInputField";

interface AddEditTodoDialogProps {
  todoToEdit?: Todo,
  onDismiss: () => void,
  onTodoSaved: (todo: Todo) => void,
}

const AddEditTodoDialog = ({ todoToEdit, onDismiss, onTodoSaved }: AddEditTodoDialogProps) => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TodoInput>({
    defaultValues: {
      title: todoToEdit?.title || "",
      description: todoToEdit?.description || "",
    }
  });

  async function onSubmit(input: TodoInput) {
    try {
      if (todoToEdit) {
        //Pre-render
        onTodoSaved(Object.assign(todoToEdit, input));

        const todoResponse: Todo = await TodosApi.updateTodo(todoToEdit, input);
        onTodoSaved(todoResponse);
        return;
      };
      const todoResponse: Todo = await TodosApi.createTodo(input);
      onTodoSaved(todoResponse);
    } catch (error) {
      console.error(error);
    };
  };

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {todoToEdit ? "Edit todo" : "Add todo"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditTodoForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          <TextInputField
            name="description"
            label="Description"
            as="textarea"
            rows={3}
            placeholder="Description (optional)"
            register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onDismiss} variant="light">
          Cancel
        </Button>
        <Button
          type="submit"
          form="addEditTodoForm"
          disabled={isSubmitting}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEditTodoDialog;