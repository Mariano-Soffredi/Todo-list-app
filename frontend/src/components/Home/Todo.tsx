import styles from "../../styles/Todo.module.css";
import styleUtils from "../../styles/utils.module.css";
import { Link } from 'react-router-dom';
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import { Todo as TodoModel } from "../../models/todo";
import { formatDate } from "../../utils/formatDate";

interface TodoProps {
  todo: TodoModel,
  onEditTodoClicked: (todo: TodoModel) => void,
  onDeleteTodoClicked: (todo: TodoModel) => void,
  className?: string
}

const Todo = ({ todo, className, onDeleteTodoClicked, onEditTodoClicked }: TodoProps) => {
  const {
    title,
    description,
    createdAt,
    updatedAt
  } = todo;

  const dateText: string = (updatedAt > createdAt) ? `Updated: ${formatDate(updatedAt)}` : `Created: ${formatDate(createdAt)}`;

  return (
    <Card as={Link} to={`/view?${todo._id}`} style={{ textDecoration: 'none', color: 'black' }} className={styles.todoCard}>
      <Card.Body>
        <Card.Title className={styleUtils.flexCenter}>
          {title}
          <DropdownButton className="text-muted ms-auto" title="Options" size="sm" onClick={e => e.preventDefault()}>
            <Dropdown.Item onClick={() => onEditTodoClicked(todo)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDeleteTodoClicked(todo)}>Delete</Dropdown.Item>
          </DropdownButton>
        </Card.Title>
        <Card.Text className={styles.todoText}>
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        {dateText}
      </Card.Footer>
    </Card>
  )
};

export default Todo;