import { useState } from 'react';
import { Button, Card, Container, ListGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import NavBar from "../components/NavBar/NavBar";
import AddEditTaskModal from "../components/View/AddEditTaskModal";
import useTodo from "../hooks/useTodo";
import { Task, Todo } from "../models/todo";
import { User } from "../models/user";
import styles from '../styles/View.module.css';

import TaskItem from '../components/View/TaskItem';
import './View.css';

interface ViewProps {
  loggedInUser: User | null,
  setLoggedInUser: (user: null) => void,
}

const View = ({ loggedInUser, setLoggedInUser }: ViewProps) => {
  const { todo, tasks, loading, setTodo } = useTodo();
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task>();

  return (
    <>
      <NavBar
        loggedInUser={loggedInUser}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      {!loading && loggedInUser &&
        <Container className={styles.viewContainer}>
          <Card className={`${styles.card} m-3`}>
            <Card.Header>
              <Card.Title>
                {todo?.title}
              </Card.Title>
              <Card.Text>
                {todo?.description}
              </Card.Text>
              <Button className={styles.newTask} onClick={() => setShowNewTaskModal(true)}>
                <FaPlus />
                Add new task
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {todo && tasks?.map((task: Task) => (
                  <TaskItem
                    key={task._id}
                    todo={todo}
                    task={task}
                    setTaskToEdit={setTaskToEdit}
                    setShowEditTaskModal={setShowEditTaskModal}
                    setTodo={setTodo}
                  />
                )
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Container>
      }
      {showNewTaskModal &&
        <AddEditTaskModal
          onDismiss={() => setShowNewTaskModal(false)}
          onSuccessful={(updatedTodo: Todo) => {
            setTodo(updatedTodo);
            setShowNewTaskModal(false);
          }}
          todoId={todo?._id || ""}
        />
      }
      {showEditTaskModal &&
        <AddEditTaskModal
          todo={todo}
          taskToEdit={taskToEdit}
          onDismiss={() => setShowEditTaskModal(false)}
          onSuccessful={(updatedTodo: Todo) => {
            setTodo(updatedTodo);
            setShowEditTaskModal(false);
          }}
          todoId={todo?._id || ""}
        />
      }
    </>
  );
}

export default View;