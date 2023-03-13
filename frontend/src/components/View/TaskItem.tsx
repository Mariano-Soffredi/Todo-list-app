import { Card, Dropdown, DropdownButton, ListGroupItem } from "react-bootstrap";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";
import { Task, Todo } from "../../models/todo";
import { dbUpdateTodo, updateTodo } from "../../network/todos_api";
import styles from "../../styles/View.module.css";

interface TaskItemProps {
  todo: Todo
  task: Task
  setTaskToEdit: (task: Task) => void
  setShowEditTaskModal: (val: boolean) => void
  setTodo: (todo: Todo | undefined) => void
}

function TaskItem({ todo, task, setTaskToEdit, setShowEditTaskModal, setTodo }: TaskItemProps) {
  const checkTask = async () => {
    const tasks = todo.tasks;
    tasks[tasks.indexOf(task)].completed = !tasks[tasks.indexOf(task)].completed;
    setTodo({ ...todo });
    dbUpdateTodo(todo)?.then(response => setTodo(response));
  };

  return (
    <ListGroupItem className={styles.task} onClick={checkTask}>
      {task.completed
        ? <ImCheckboxChecked className={styles.checkBox} />
        : <ImCheckboxUnchecked className={styles.checkBox} />
      }
      {' '}
      <Card.Title className={styles.title}>
        {task.title}
      </Card.Title>
      <DropdownButton
        variant='ligth'
        className={`text-muted ms-auto ${styles.options}`}
        title={<SlOptionsVertical className={styles.dots} />}
        size="sm"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}>
        <Dropdown.Item onClick={() => {
          setTaskToEdit(task);
          setShowEditTaskModal(true);
        }}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={async () => {
          // Pre-render
          const idx = todo.tasks.indexOf(task);
          todo.tasks.splice(idx, 1);
          setTodo({...todo});

          setTodo(await updateTodo(todo));
        }}>Delete</Dropdown.Item>
      </DropdownButton>
    </ListGroupItem>
  );
}

export default TaskItem;